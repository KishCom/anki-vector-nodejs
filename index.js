const grpc = require("grpc");
const path = require("path")
const fs = require("fs");
const protoLoader = require("@grpc/proto-loader");
const bunyan = require("bunyan");
const packagejson =require("./package.json");
let log, config, client;

const VECTOR_CLIENT_VERSION = 2;
const VECTOR_MIN_HOST_VERSION = 0;

var LoggerInterceptor = function(options, nextCall) {
    return new grpc.InterceptingCall(nextCall(options), {
        start(passedMetadata, listener, nnext) {
            nnext(passedMetadata, {
                onReceiveMetadata (mdata, next) {
                    log.trace("onReceiveMetadata", mdata);
                    next(mdata);
                },
                onReceiveMessage (message, next) {
                    log.trace("onReceiveMessage", message);
                    next(message);
                },
                onReceiveStatus (status, next) {
                    log.trace("onReceiveStatus", status);
                    next(status);
                },
            });
        },
        sendMessage(message, next) {
            log.trace("sendMessage", message);
            next(message);
        },
        halfClose(next) {
            log.trace("halfClose");
            next();
        },
        cancel(message, next) {
            log.trace("cancel", message);
            next(message);
        }
    });
};

var VectorAPI = function(configObj){
    if (fs.existsSync("./config.js")){
        config = require("./config.js");
    }
    if (!configObj){
        console.error("Missing config.js file or no config object passed in.");
        throw new Error("Missing config.js file or no config object passed in.");
    }else{
        config = configObj;
    }

    // Have the gRPC libs spit out more debug data
    if (configObj && configObj.gRPCDebug){
        grpc.setLogVerbosity(0);
    }

    // Configure bunyan logging
    log = bunyan.createLogger({
        name: packagejson.name + " " + packagejson.version,
        streams: [{
            level: config.DEBUG_LEVEL, // Priority of levels looks like this: Trace -> Debug -> Info -> Warn -> Error -> Fatal
            stream: process.stdout
        }]
    });
    // TODO improve detection of these values
    if (!config || !config.VECTOR_NAME || !config.VECTOR_SN || !config.VECTOR_BEARER_TOKEN || !config.VECTOR_IP || !config.VECTOR_CRT){
        log.error("Missing config.js values. Please edit values in config.sample.js and rename it 'config.js'");
        process.exit(-1);
    }
    var proto = grpc.loadPackageDefinition(
        protoLoader.loadSync(path.join(__dirname, "./protobufs/anki_vector/messaging/external_interface.proto"), {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: ["node_modules/google-proto-files", path.join(__dirname, "protobufs")]
        })
    );

    // build meta data credentials
    var metadata = new grpc.Metadata();
    metadata.add('authorization', `Bearer ${config.VECTOR_BEARER_TOKEN}`);
    var headerCreds = grpc.credentials.createFromMetadataGenerator((_args, callback) => callback(null, metadata));
    // build ssl credentials using the cert
    if (!fs.existsSync(config.VECTOR_CRT)){
        log.error("Missing Vector certificate file. Make sure you've got the proper file location specified in your config.js");
        process.exit(-1);
    }
    var sslCreds = grpc.credentials.createSsl(fs.readFileSync(config.VECTOR_CRT));
    // combine so that every call is properly encrypted and authenticated
    var credentials = grpc.credentials.combineChannelCredentials(sslCreds, headerCreds);
    // Pass the crendentials when creating a channel
    // ExternalInterface is the only exposed gRPC service right now, so we hardcode the client to it.
    // The idea is if Anki opens other gRPC services later you can call client.SERVICE.METHOD -- but for now since there's only 1 service we call: client.METHOD
    client = new proto.Anki.Vector.external_interface.ExternalInterface(config.VECTOR_IP, credentials, {"grpc.ssl_target_name_override": config.VECTOR_NAME, interceptors: [LoggerInterceptor]});
    this.client = client;
    this.VECTOR_CLIENT_VERSION = VECTOR_CLIENT_VERSION;
    this.VECTOR_MIN_HOST_VERSION = VECTOR_MIN_HOST_VERSION;
};

VectorAPI.prototype.listMethods = function(){
    const proto = grpc.loadPackageDefinition(
        protoLoader.loadSync(path.join(__dirname, "./protobufs/anki_vector/messaging/external_interface.proto"), {
            keepCase: true,
            longs: String,
            enums: String,
            defaults: true,
            oneofs: true,
            includeDirs: ["node_modules/google-proto-files", path.join(__dirname, "protobufs")]
        })
    );
    let finalRoutes = {};
    const rootLevelRoutes = Object.keys(proto.Anki.Vector.external_interface);
    rootLevelRoutes.forEach((rootLevelRoute) => {
        const service = proto.Anki.Vector.external_interface[rootLevelRoute].service || false;
        if (service){
            if (!finalRoutes[rootLevelRoute]){
                finalRoutes[rootLevelRoute] = [];
            }
            const secondLevelRoutes = Object.keys(proto.Anki.Vector.external_interface[rootLevelRoute].service);
            secondLevelRoutes.forEach((secondLevelRoute) => {
                const reqFields = [];
                proto.Anki.Vector.external_interface[rootLevelRoute].service[secondLevelRoute].requestType.type.field.forEach((field) => {
                    reqFields.push({
                        name: field.name,
                        type: String(field.type).replace("TYPE_", "")
                    });
                });
                const resFields = [];
                proto.Anki.Vector.external_interface[rootLevelRoute].service[secondLevelRoute].responseType.type.field.forEach((field) => {
                    reqFields.push({
                        name: field.name,
                        type: String(field.type).replace("TYPE_", "")
                    });
                });
                finalRoutes[rootLevelRoute].push({
                    name: secondLevelRoute,
                    responseStream: proto.Anki.Vector.external_interface[rootLevelRoute].service[secondLevelRoute].responseStream,
                    requestStream: proto.Anki.Vector.external_interface[rootLevelRoute].service[secondLevelRoute].requestStream,
                    requestFields: reqFields,
                    responseFields: resFields
                });
            });
        }
    });
    // Syntactic sugar: ExternalInterface is currently the only exposed gRPC service API, we need not nest it until there's more
    finalRoutes = finalRoutes.ExternalInterface;
    return finalRoutes;
};

VectorAPI.prototype.getLogger = () => log;
module.exports = VectorAPI;

