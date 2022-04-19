# 페킷 정리

## 둘 다 사용

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

## 서버가 클라이언트로

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

## 클라이언트가 서버로

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

* * *

### Socket 변수
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