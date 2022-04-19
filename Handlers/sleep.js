const { MatchMaking } = require("../Utils/MatchMaking");
const { PrintException } = require("../Utils/PrintException");
const { DataVO } = require("../VO/DataVO")

const MAX_SLEEP_COUNT = 5;
const WAIT_COMEBACK_MS = 20000; // 20초 대기

module.exports = { // TODO: 둘다 sleep 일 시
    type: "sleep",
    handle(socket, payload) {

        if (socket.match != null) { 

            if (socket.match.getOpponentSocket(socket.id).sleep) { // 상대도 sleep 상태
                socket.match.matchEnded(null); // 둘다 나감
                return;
            }

            // 인게임 중이였던경우 상대에게 sleep 전달
            socket.match.send(socket.id, JSON.stringify(new DataVO("sleep", "")));

            socket.sleep = true;
            if (++socket.sleepstack > MAX_SLEEP_COUNT) { // 시스템 악용 방지
                exitted(socket);
                return;
            }
    
            setTimeout(() => { // WAIT_COMEBACK_MS 동안 안 돌아온 경우 처리
                if (socket.sleep) { 
                    exitted(socket);
                }
            }, WAIT_COMEBACK_MS);

        } else if (socket.matchmaking) { // 메치메이킹 중인 경우 취소
            MatchMaking.leaveMatchmaking(socket);
        }

    }
}

function exitted(socket) { // 탈주 처리
    socket.sleepstack = 0;
    socket.match.matchEnded(socket.id);
    socket.close();
}