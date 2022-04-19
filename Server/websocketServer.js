const fs = require("fs");
const path = require("path");
const { WebSocketServer } = require("ws");
const { MatchMaking } = require("../Utils/MatchMaking.js");


// console.log("\r\nServer is starting...");
console.log("\r\nOpenRC is starting GNU/Server...\r\n"); // ?

//#region init

// argv
const port = process.argv[2];
if (process.argv.length <= 2) {
    console.log("[EE] usage: ./Server/websocketServer.js [ports]");
    process.exit();
}

const wsServer = new WebSocketServer({ port }, () => {
    console.log(`[II] Server running on port: ${port}\r\n`);
});
//#endregion // init

// imports handler
let handlers = [];
fs.readdir(path.join(".", "Handlers"), (err, file) => {
    file.forEach(e => {
        console.log(`[II] Found Handler: ${e}`);
        const handler = require(path.join("..", "Handlers", e));
        handlers[handler.type] = handler;
    });
});

let id = 0;

wsServer.on("connection", socket => {
    //#region Init
    socket.id = id++;
    socket.onGame = false;
    socket.matchmaking = false;
    socket.match = null;
    socket.sleepstack = 0;

    console.log(`[II] User connected: ${socket.id}`);
    //#endregion // init

    socket.on("message", data => {
        console.log(`[II] ID ${socket.id}: ${data}`);
        handleMessage(socket, data);
    });

    socket.on("close", data => {
        socket.exitting = true; // 클라가 left 를 보낼 가능성이 없는게 아니라서
        console.log(`[II] User disconnected: ${socket.id}`);

        handlers["left"].handle(socket, ""); // 연결 해제 처리
    });
});


function handleMessage(socket, message) { // handles payload to handler
    let json = "";
    try {
        json = JSON.parse(message);
    } catch (ex) {
        console.log(ex);
        //TODO: 요청 보낸 소켓 정보 저장
        return;
    }

    if (handlers[json.type] == null) {
        console.log(`[EE] No handler found for type:${json.type}`);
        //TODO: 요청 보낸 소켓 정보 저장
        return;
    }

    handlers[json.type].handle(socket, json.payload);
}