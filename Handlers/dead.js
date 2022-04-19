const { sendResponse } = require("../Utils/Response");
const { DataVO } = require("../VO/DataVO")

module.exports = {
    type: "dead",
    handle(socket, payload) {
        if (socket.match == null) {
            sendResponse(socket, "게임 중이 아닙니다.", "error");
            return;
        }

        socket.match.matchEnded(socket.id);
    }
}