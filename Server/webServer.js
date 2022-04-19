const http = require('http');
const express = require('express');
const request = require("request");
const bodyParser = require("body-parser");
const { post, get } = require('request');
const { PrintException } = require('../Utils/PrintException');
const app = express();

var server = http.createServer(app);
const DB_SERVER_URL = "http://localhost/";

//#region Init
console.log("\r\nOpenRC is starting GNU/WebServer...\r\n");

// argv
if (process.argv.length <= 2) {
    console.log("[EE] usage: ./Server/webServer.js [ports]");
    process.exit();
}
app.set("port", process.env.PORT || process.argv[2]);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
//#endregion // Init


server.listen(app.get("port"), () => {
    console.log(`[II] WebServer running on port ${app.get("port")}\r\n`);
});

app.post("/set/", (req, res) => { // INSERT

    sendRequest({
        game: req.body.game,
        score: req.body.score,
        name: req.body.name
    }, result => {
        res.send(result)
    });
});

app.post("/get/", (req, res, next) => { // SELECT
    sendRequest({
        game: req.body.game,
        range: req.body.range
    }, result => {
        res.send(result);
    });
});

// DB 서버로 요청을 보냄
function sendRequest(data, callback) {
    try {
        request.post(DB_SERVER_URL, {
            form: data
        }, (err, res, body) => {
            if (err != null) { // 오류
                console.log(err);
            }

            // 성공
            callback(body);
        });

    } catch (ex) {
        PrintException("DB Server Request Error", [console.log(ex)]);
    }
}