const { DataVO } = require("../VO/DataVO");
const { Match } = require("./Match");
const { sendResponse, send } = require("./Response")
const { PrintException } = require("./PrintException.js");

class MatchMaking
{
    constructor() {
        this.onSocketsMM = []; // 메치메이킹 중인 소켓들
        this.matchID = 0;

        this.USERS_ON_SAME_GAME = 2;
        this.MATCH_CHECK_MILLISECONDS = 500;
        

        setInterval(() => { // 0.5초마다 메치 확인
            this.acquireMatch();
        }, this.MATCH_CHECK_MILLISECONDS);
    }

    enterMatchmaking(socket) {
        if (socket.matchmaking) { // 이미 메치메이킹 중인 소켓의 요청
            sendResponse(socket, "이미 메치메이킹 중입니다.", "popup");
            return;
        }

        socket.matchmaking = true;
        sendResponse(socket, "", "entermm");
        this.onSocketsMM.push(socket);
    }

    leaveMatchmaking(socket) {
        if (!socket.matchmaking) { // 메치 중이 아닌 소켓의 요청
            sendResponse(socket, "메치 메이킹 중이 아닙니다.", "popup");
            return;
        }

        socket.matchmaking = false;
        sendResponse(socket, "", "leavemm");
        this.onSocketsMM.splice(this.onSocketsMM.findIndex(x => x == socket), 1);
    }

    userleft(socket) {
        if (!socket.exitting) { // 접속 끊긴 소켓이 아님
            PrintException("Socket Not Disconnected Exception");
        }
    }

    acquireMatch() {
        if (this.onSocketsMM.length < this.USERS_ON_SAME_GAME) return;

        let matchedSockets = [];
        
        for (let i = 0; i < this.USERS_ON_SAME_GAME; ++i) { // 랜덤하게 유저 뽑아 메치 생성
            let idx = Math.floor(Math.random() * this.onSocketsMM.length);
            matchedSockets.push(this.onSocketsMM[idx]);
            sendResponse(this.onSocketsMM.splice(idx, 1)[0], "", "entergame");
        }

        new Match(this.matchID++, matchedSockets);
    }

    filterDummyData() { // undefined 삭제
        this.onSocketsMM = this.onSocketsMM.filter(x => x != null);
    }
}

module.exports = {
    MatchMaking : new MatchMaking()
}