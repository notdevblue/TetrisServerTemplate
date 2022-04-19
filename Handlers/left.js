const { MatchMaking } = require("../Utils/MatchMaking");
const { PrintException } = require("../Utils/PrintException");
const { DataVO } = require("../VO/DataVO")

module.exports = {
    type: "left",
    handle(socket, payload) {
        if (!socket.exitting) {
            PrintException("Client not disconnected", [`SOCKET ID: ${socket.id}`]);
            return;
        }

        if (socket.match != null) { // 인게임 중이였던경우 상대에게 나갔다고 전달
            socket.match.send(socket.id, JSON.stringify(new DataVO("left", "")));
            
        } else if (socket.matchmaking) { // 메치메이킹 중인 경우 취소
            MatchMaking.leaveMatchmaking(socket);
        }
        
        // 초기화
        socket.match = undefined;
        socket.id = undefined;
        socket.matchmaking = undefined;
        socket.onGame = undefined;
        socket.exitting = undefined;
    }
}