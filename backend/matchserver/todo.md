### 해야 할 일
- 

1. 연결
2. 연결 해제

1. 방 만들기
2. 방 조회하기
3. 방 참여하기
4. 방 나가기
5. 방 삭제하기
6. 방 정보 보기

1. 방 정보 변경 통지하기

1. 방에 있는 모두의 세션ID 조회하기

1. 방에있는 모두에게 메시지 보내기
 (일단은 방이 업데이트됨 메시지만 보내면)
 (클라이언트가 다시 메서드를 불러서 방을 새로고침 하는걸로 하자)
 방이 삭제될때, 방에서 나가진건 따로 보내자.




 json을 사용하자
```json
{
  "method": "matchserver.make_room",
  "identify" : "123456" // 클라이언트 입장에서의 편의를 위해 임시로 사용하는 식별코드, 내용변경 없이 그대로 리턴해 준다.
  //"jwt": "eyJhbGciOiJIUzI1R....JV_adQssw5c",
  "parameter": {
    "name": "pingpong_challenge",
    "password": "10001"
  }
}
```

json을 전송하는 것으로 메서드를 실행하자.
만약에 적절한 메서드가 오지 않으면 json을 이용해서 오류를 응답해 준다.

```json
{
  "method": "matchserver.make_room",
  "status": "OK",
  "identify" : "123456", //내용변경 없이 그대로 리턴해 준다.
  "return": {
    "status": "OK",
    "ID": "00001"
  }
}
```

```json
{
  "method": "matchserver.makk_room",
  "status": "ERROR - Invalid method name", //해당하는 메서드가 없는 경우 오류 출력
  "identify" : "123456", //내용변경 없이 그대로 리턴해 준다.
  "return": {}
}
```

```json
{
  "method": "matchserver.make_room",
  "status": "OK", //해당하는 메서드가 없는 경우 오류 출력
  "identify" : "123456", //내용변경 없이 그대로 리턴해 준다.
  "return": {
    "status": "Error",
    "message": "Password must be a string or None"
    }
}
```



1. minigameserver 의 remove_game에서 게임 결과 전송 ()
2. 서버가 클라이언트에게 보내는 메시가 전달되도록 수정 ✅
3. minigameserver의    def get_new_id(self): 메서드를 수정해서 hhan님의 생성기를 사용하도록 하기.