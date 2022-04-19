const { DataVO } = require("../VO/DataVO");

module.exports = {
    sendResponse(socket, msg, type) {

        if (msg != "") { // 에러 전달
            type = "error";
            msg = JSON.stringify({ msg: msg });
        }

        socket.send(JSON.stringify(new DataVO(type, msg)));
        console.log(`Response of socket ${socket.id}'s type: ${type}, request: ${msg == "" ? "no message" : msg}`);
    },
    send(socket, dataVO) {
        socket.send(JSON.stringify(dataVO));
    }
}