const { sendResponse } = require("../Utils/Response");
const { DataVO } = require("../VO/DataVO")

module.exports = {
    type: "newline",
    handle(socket, payload) {
        if (socket.match == null) {
            sendResponse(socket, "게임 중이 아닙니다.", "error");
            return;
        }

        socket.match.send(socket.id, JSON.stringify(new DataVO("newline", payload)));
    }
}