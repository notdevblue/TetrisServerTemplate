# 테트리스 서버 (사용이 되지 못한 비운의)
###### 클라이언트 담당한 친구의 개발이 너무 느려저서 기한 안에 끝나지 못했습니다.

* * *

## 사용된 라이브러리
* ws

* * *

## 폴더 구조
* Handlers
    * ...
* Server
    * WebServer.js
    * WebsocketServer.js
* Utils
    * Match.js
    * MatchMaking.js
    * PrintException.js
    * Response.js
    * Vector2.js
* VO/DataVO.js

* * *

## 페킷 타입 정리

<details>
    <summary>페킷 타입</summary>

### 둘 다 사용

### entermm
```js
{ 
}
// 메치메이킹 입장 시
```

### leavemm
```js
{
}
// 메치메이킹 취소 시
```

### loaded
```js
{
}
// 로딩 완료 시 (받으면 다 됬다는 의미)
```

### dead
```js
{
}
// 사망 시 (받으면 상대 사망 의미)
```

### block
```js
{
    (GridStatus[])_tetrisStatus: 그리드 정보
}
```

* * *

### 서버가 클라이언트로

### entergame
```js
{
}
// 메치 잡혔을 때
```

### error
```js
{
    (string)msg: 에러 메세지
}
// 에러 발생 시
```

### sleep
```js
{
}
// 상대방 (아래 설명) 시
```

### returned
```js
{
}
// 상대방 (아레 설명) 시
```

### won
```js
{
}
// 승리 시
```

### lost
```js
{
}
// 패배 시
```

### bothleft
```js
{
}
// 둘 다 나갔을 시
```

### newline
```js
{
}
// 한줄++
```

* * *

### 클라이언트가 서버로

### left
```js
{
}
// 게임 종료 시
```

### sleep
```js
{
}
// 게임 비활성화 상태
// (홈버튼 잘못눌렀거나 전원버튼 잘못눌렀을때)
```

### returned
```js
{
}
// 게임 비활성화 => 활성화 넘어갈 때
// (위 설명 참고)
```
</details>

* * *

<details>
    <summary>소켓 변수</summary>
    
```js
{
    (Match)match: "./Utils/Match.js"
    (int)id: 아이디
    (int)sleepstack: 비활성화 악용 방지
    (bool)onGame: 게임 중인지
    (bool)matchmaking: 메치메이킹 상태
    (bool)exitting: 연결 끊겼을 시 처리 위해 true 로 변경 후 처리 완료 시 undefined 로 변경됨
    (bool)sleep: 게임 비활성화 됬을 때 true
}
```
    
</details>
    
* * *

<details>
    <summary>헨들러 예시</summary>

```js
module.exports = {
    type: "example",
    handle(socket, payload) {
        // something...
        console.log(payload);
    }
}   
```
예시 헨들러<br/>
type 과 handle() 이 필수로 존재해야 함<br/>
    
```js
module.exports = {
    type: "block",
    handle(socket, payload) {
        if (socket.match == null) { // 메칭 중이 아닐 시
            sendResponse(socket, "게임 중이 아닙니다.", "error");
            return;
        }

        socket.match.send(socket.id, JSON.stringify(new DataVO("block", payload)));
    }
}
```
블럭 정보 넘기는 헨들러<br/><br/>

</details>

* * *

<details>
    <summary>동적 헨들러 추가</summary>
    
```js
let handlers = [];
fs.readdir(path.join(".", "Handlers"), (err, file) => {
    file.forEach(e => {
        console.log(`[II] Found Handler: ${e}`);
        const handler = require(path.join("..", "Handlers", e));
        handlers[handler.type] = handler;
    });
});
```
헨들러를 불러온 뒤 handler Dictionary 에 추가함<br/><br/>
    
</details>

* * *

<details>
    <summary>서버 접속과 페킷 처리</summary>

```js
socket.id = id++;
socket.onGame = false;
socket.matchmaking = false;
socket.match = null;
socket.sleepstack = 0;

console.log(`[II] User connected: ${socket.id}`);
```
아이디를 부여하고, 기본 변수를 초기화 함<br/>
    
```js
socket.on("message", data => {
    console.log(`[II] ID ${socket.id}: ${data}`);
    handleMessage(socket, data);
});
```
```js
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
```
JSON 디코딩 후 type 이 handlers Dictionary 에 존재하는지 확인 후 handle 함수 호출<br/><br/>

</details>

* * *

<details>
    <summary>메치메이킹 처리</summary>

```js
constructor() {
    this.onSocketsMM = []; // 메치메이킹 중인 소켓들
    this.matchID = 0;

    this.USERS_ON_SAME_GAME = 2;
    this.MATCH_CHECK_MILLISECONDS = 500;


    setInterval(() => { // 0.5초마다 메치 확인
        this.acquireMatch();
    }, this.MATCH_CHECK_MILLISECONDS);
}
```
생성자 <br/>    

```js
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
```
메치메이킹 대기열 추가와 삭제<br/>
    
```js
acquireMatch() {
    // 대기 인원이 방을 만들 수 있는 인원보다 작다면 아무런 연산 하지 않음
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
```
메치메이킹 얻어내는 함수<br/><br/>

</details>

* * *

<details>
    <summary>sendResponse.js</summary>

```js
module.exports = {
    sendResponse(socket, msg, type) {

        if (msg != "") { // 에러 전달
            type = "error";
            msg = JSON.stringify({ msg: msg });
        }

        socket.send(JSON.stringify(new DataVO(type, msg)));
        console.log(`Response of socket ${socket.id}'s type: ${type}, request: ${msg == "" ? "no message" : msg}`);
    },
    send(socket, dataVO) {
        socket.send(JSON.stringify(dataVO));
    }
}
```
간단한 답변을 주는 기능을 가짐<br/><br/>

</details>
