// an example handler

module.exports = {
    type: "example",
    handle(socket, payload) {
        // something...
        console.log(payload);
    }
}