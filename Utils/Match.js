const { DataVO } = require("../VO/DataVO");

class Match {
    constructor(id, users) {
        this.matchID = id;
        this.users = users;

        this.loaded = 2; // 클라이언트가 로딩 됬을때마다 1 줄어듬

        this.awake();
    }

    awake() {
        this.users.forEach(socket => {
            socket.match = this;
        });
    }

    broadcast(msg) {
        this.users.forEach(socket => {
            socket.send(msg);
        });
    }

    send(myid, data) { // 상대방에게 send 함
        let socket = this.getOpponentSocket(myid);
        console.log(socket.id);
        socket.send(data);
    }

    getOpponentSocket(myid) { // 상대방 소켓 가져옴
        return this.users.filter(e => e.id != myid)[0];
    }

    onloaded() {
        if (--this.loaded == 0) {
            this.broadcast(JSON.stringify(new DataVO("loaded", "")));
        }
    }

    matchEnded(lostSocketID) { // 게임 종료 시
        
        if (lostSocketID == null) { // 둘다 나가서 호출된 경우
            this.broadcast(JSON.stringify(new DataVO("bothleft", "")));
        } else {
            this.users[lostSocketID].send(JSON.stringify(new DataVO("lost", "")));
            this.getOpponentSocket(lostSocketID).send(JSON.stringify(new DataVO("won", "")));
        }

        this.users.forEach(e => {
            e.match = null;
        });
    }
}


module.exports = {
    Match: Match
}