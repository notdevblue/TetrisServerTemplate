const { sendResponse } = require("../Utils/Response");
const { DataVO } = require("../VO/DataVO")

module.exports = {
    type: "loaded",
    handle(socket, payload) {
        if (socket.match == null) {
            sendResponse(socket, "게임 중이 아닙니다.", "error");
            return;
        }

        socket.match.onloaded();
    }
}