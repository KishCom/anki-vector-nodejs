# Anki Vector - Node.js API

## NOTICE:

The project is largely unmaintained as I have purchased and am waiting for the "Open Source Kit" and "Escape Pod" from [Digital Dream Labs](https://www.digitaldreamlabs.com/pages/digital-dream-labs-vector), the company that bought Vector from Anki. I am sure those releases (estimated July 2020) will obsolete this package.

![Vector](https://captaindashing.com/img/vector-node.jpg)

Learn more about Vector: https://www.anki.com/vector

gRPC calls this library has access to: https://developer.anki.com/vector/docs/proto.html#anki_vector/messaging/external_interface.proto

Python SDK documentation: https://developer.anki.com/vector/docs/index.html

Forums: https://forums.anki.com/

## Getting Started

Follow steps [here](https://developer.anki.com/vector/docs/initial.html) to set up your Vector robot with the SDK (future versions of this API will not require this step). After you've got the Python SDK setup and working you can proceed to setup the Node.js API:

Pass values obtained from `%home%/.anki_vector/sdk_config.ini` directly into the constructor. Then initialize the API and use it!

```javascript
    var VectorAPI = require("anki-vector-nodejs");
    var vector = new VectorAPI({
        VECTOR_SN: "01234567",
        VECTOR_NAME: "Vector-R2D2",
        VECTOR_IP: "192.168.2.42",
        VECTOR_BEARER_TOKEN: "abcdefghijkl1234567890==",
        VECTOR_CRT: "/home/user/.anki_vector/Vector-R2D2-01234567.cert",
        DEBUG_LEVEL: "info" // Not found in the sdk_config.ini. Available options: "trace", "debug", "info", "error", "fatal"
    });
    
    // List out all available methods
    // Should be the same (or mostly the same) as: https://developer.anki.com/vector/docs/generated/anki_vector.messaging.client.html
    var routes = vector.listMethods();
    routes.forEach((route) => {
        console.log(`Route ${route.name} : `);
        console.log(`         req fields: ${JSON.stringify(route.requestFields)}`);
        console.log(`         res fields: ${JSON.stringify(route.responseFields)}`);
    });
    
    // Actually call a method
    console.log("Asking Vector about his protocol version...");
    vector.client.ProtocolVersion({"client_version": vector.VECTOR_CLIENT_VERSION, "min_host_version": vector.VECTOR_MIN_HOST_VERSION}, (err, result) => {
        if (err){
            console.log("Error", err);
        }
        console.log(result);
    });
```

Make Vector say something:

```javascript
    vector.client.SayText({"text": "Hello Everyone", "use_vector_voice": true, "duration_scalar": "1.0"}, (err, result) => {
        if (err){
            console.log("Error", err);
        }else{
            console.log(result);
        }
    });
```

## Privacy Policy and Terms and Conditions

This Node.js library is a personal project and IS NOT affilated with Anki Inc or Digital Dream Labs. Please post issues in the [Github issue tracker](https://github.com/KishCom/anki-vector-nodejs/issues) rather than to Anki or Digital Dream Labs support.
