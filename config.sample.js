// These are sample values and will not work by default.
// Please see your %home%/.anki_vector/sdk_config.ini to get the values for your Vector
// If you do not have this file please install and configure the Official Vector Python SDK first: https://developer.anki.com/vector/docs/initial.html
const config = {
    VECTOR_SN: "01234567",
    VECTOR_NAME: "Vector-R2D2",
    VECTOR_IP: "192.168.2.42",
    VECTOR_BEARER_TOKEN: "abcdefghijkl1234567890==",
    VECTOR_CRT: "/home/user/.anki_vector/Vector-R2D2-01234567.cert",
    DEBUG_LEVEL: "info" // Not found in the sdk_config.ini. Available options: "trace", "debug", "info", "error", "fatal"
};
module.exports = config;
