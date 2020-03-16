const VectorAPI = require("./index");
const config = require("./config");


/*
Route BehaviorControl : 
         req fields: [{"name":"control_release","type":"MESSAGE"},{"name":"control_request","type":"MESSAGE"},{"name":"control_granted_response","type":"MESSAGE"},{"name":"control_lost_event","type":"MESSAGE"},{"name":"keep_alive","type":"MESSAGE"},{"name":"reserved_control_lost_event","type":"MESSAGE"}]
         res fields: []
Route AssumeBehaviorControl : 
         req fields: [{"name":"control_release","type":"MESSAGE"},{"name":"control_request","type":"MESSAGE"},{"name":"control_granted_response","type":"MESSAGE"},{"name":"control_lost_event","type":"MESSAGE"},{"name":"keep_alive","type":"MESSAGE"},{"name":"reserved_control_lost_event","type":"MESSAGE"}]
         res fields: []

*/

const vector = new VectorAPI(config);
vector.client.AssumeBehaviorControl({"control_request": {"priority": 30}}, (errr, res) => {
    if (errr){
        console.log("Error", errr);
    }
    console.log(res);
    // Look up the required request values for SayText: https://developer.anki.com/vector/docs/proto.html#Anki.Vector.external_interface.SayTextRequest
    //"name":"text","type":"STRING"},{"name":"use_vector_voice","type":"BOOL"},{"name":"duration_scalar","type":"FLOAT"},{"name":"status","type":"MESSAGE"},{"name":"state","type":"ENUM"}]
    console.log("Say text:");
    vector.client.SayText({"text": "Hello Everyone", "use_vector_voice": true, "duration_scalar": "1.0"}, (err, result) => {
        if (err){
            console.log("Error", err);
        }
        console.log("SayTextRes:", result);
    });
});
