# Anki Vector - Node.js API

![Vector](https://captaindashing.com/img/vector-node.jpg)

Learn more about Vector: https://www.anki.com/vector

gRPC calls this library has access to: https://developer.anki.com/vector/docs/generated/anki_vector.messaging.client.html

Python SDK documentation: http://developer.anki.com/vector/docs/

Forums: https://forums.anki.com/

## Getting Started

You can follow steps [here](https://developer.anki.com/vector/docs/initial.html) to set up your Vector robot with the SDK. After you've got the Python SDK setup and working you can proceed to setup the Node.js API:

0) Install from NPM `npm install anki-vector-nodejs`
1) Copy `node_modules/anki-vector-nodejs/config.sample.js` to `node_modules/anki-vector-nodejs/config.js`
2) Fill in values in `config.js` you can obtain from `%home%/.anki_vector/sdk_config.ini`
3) Intialize the API and use it!

```javascript
    var VectorAPI = require("anki-vector-nodejs");
    var vector = new VectorAPI();
    
    // List out all available methods
    // Should be the same (or mostly the same) as: https://developer.anki.com/vector/docs/generated/anki_vector.messaging.client.html
    var routes = vector.listMethods();
    routes.forEach((route) => {
        console.log(`Route ${route.name} : `);
        console.log(`         req fields: ${JSON.stringify(route.requestFields)}`);
        console.log(`         res fields: ${JSON.stringify(route.requestFields)}`);
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

## Privacy Policy and Terms and Conditions

This Node.js library is a personal project and IS NOT affilated with Anki Inc. Please post issues in the [Github issue tracker](https://github.com/KishCom/anki-vector-nodejs/issues) rather than to Anki support.
