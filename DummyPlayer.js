const WebSocket = require("ws");
const { DataVO } = require("./VO/DataVO");

const ws = new WebSocket("ws://localhost:46000");
const ws1 = new WebSocket("ws://localhost:46000");
const ws2 = new WebSocket("ws://localhost:46000");

ws.on("open", () => {
    console.log("Connected");


    let payload = JSON.stringify({ msg: "A" });

    ws.send(JSON.stringify(new DataVO("createroom", payload)));
    ws.send(JSON.stringify(new DataVO("ready", "")));
});

ws.on("message", data => {
    console.log("ws: " + data.toString());
});

ws1.on("open", () => {
    console.log("Connected");


    let payload = JSON.stringify({ roomid: 0 });
    ws1.send(JSON.stringify(new DataVO("joinroom", payload)));
    ws1.send(JSON.stringify(new DataVO("ready", "")));
});

ws1.on("message", data => {
    console.log("ws1: " + data.toString());
});

ws2.on("open", () => {
    console.log("Connected");


    // let payload = JSON.stringify({ msg: "A" });?

    ws2.send(JSON.stringify(new DataVO("roomquery", "")));
});

ws2.on("message", data => {
    console.log("ws2: " + data.toString());
});