const { MatchMaking } = require("../Utils/MatchMaking");
const { PrintException } = require("../Utils/PrintException");
const { DataVO } = require("../VO/DataVO")

module.exports = {
    type: "returned",
    handle(socket, payload) {
        if (!socket.sleep) {
            // 뭔가 잘못된 요청
            PrintException("Socket was not at sleep", [`Socket ID: ${socket.id}`]);
            return;
        }

        socket.sleep = false;

        if (socket.match != null) { // 돌아왔다고 전달
            socket.match.send(socket.id, JSON.stringify(new DataVO("returned", "")));
        }
    }
}