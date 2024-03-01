
## 0. Online 버튼 누르기
### Request. get_user_state로 유저의 상태를 확인한다.
```json
{
  "method":"matchserver.get_user_state",
  "responseId":1
}
```
### Response-1. 기존에 생성해놓은 room이 없을 경우
```json
{
    "method": "matchserver.get_user_state",
    "status": "OK",
    "identify": null,
    "responseId": 1,
    "data": {
        "status": "OK",
        "room_id": null,
        "tournament_id": null,
        "game_id": null
    }
}
```

## 1. Room 생성하기
### Request. create_room으로 room을 생성한다
```json
{
  "method": "matchserver.create_room",
  "parameters": {
    "name": "temproom51",
    "password": null
  },
  "responseId": 1
}
```
### Response-1. 방이 생성되었을 경우
```json
{
    "method": "matchserver.create_room",
    "status": "OK",
    "identify": null,
    "responseId": 1,
    "data": {
        "status": "OK",
        "message": "Room created",
        "room_id": 231
    }
}
```
방 생성이 정상적으로 되면 입장할 수 있도록 서버에서 추가적으로 response를 내려줌
```json
{
    "type": "send_message",
    "text": {
        "method": "client.room_was_update",
        "status": "OK",
        "identify": "from_server",
        "data": {
            "status": "OK",
            "data": {
                "name": "temproom51",
                "participants": [
                    "hhan"
                ]
            }
        }
    }
}
```
### Response-2. 이미 생성된 방이 있을 경우
```json
{
    "method": "matchserver.create_room",
    "status": "OK",
    "identify": null,
    "responseId": 1,
    "data": {
        "status": "Error",
        "message": "User is already in a room."
    }
}
```

## 2. 생성된 방 리스트 불러오기
### Request. list_room로 방 리스트를 불러온다.
```json
{
  "method":"matchserver.list_room",
  "responseId":39
}
```
### Response. 방 리스트
```json
{
    "method": "matchserver.list_room",
    "status": "OK",
    "identify": null,
    "responseId": 1,
    "data": [
        {
            "id": 231,
            "name": "temproom51"
        }
    ]
}
```

## 3. room_id로 특정 방 입장하기
### Request. enter_room으로 room에 입장한다.
```json
{
  "method":"matchserver.enter_room",
  "parameters":{
    "room_id":231,
    "room_password":null
  },
  "responseId":1
}
```
### Response. 방에 정상적으로 입장됐을 경우
```json
{
    "method": "matchserver.enter_room",
    "status": "OK",
    "identify": null,
    "responseId": 39,
    "data": {
        "status": "OK",
        "message": "Room entered"
    }
}
```

## 4. room_id로 특정 방 불러오기
### Request. info_room으로 room을 불러온다.
```json
{
  "method":"matchserver.info_room",
  "parameters":{
    "room_id":231
  },
  "responseId":1
}
```
### Response. 방 정보
```json
{
    "method": "matchserver.info_room",
    "status": "OK",
    "identify": null,
    "responseId": 39,
    "data": {
        "status": "OK",
        "data": {
            "name": "temproom51",
            "participants": [
                "hhan",
                "temp"
            ]
        }
    }
}
```

## 5. 게임 시작하기(방장만 가능)
### Request. start_game으로 게임을 시작한다.
```json
{
  "method":"matchserver.start_game",
  "responseId":1
}
```
아직 미완성인듯?


## ETC-1. Room 삭제하기(방장만)
### Request.
```json
{
  "method":"matchserver.delete_room",
  "responseId":1
}
```
### Response-1. 방이 정상적으로 삭제되었을 경우
```json
{
    "method": "matchserver.delete_room",
    "status": "OK",
    "identify": null,
    "responseId": 1,
    "data": {
        "status": "OK",
        "message": "Room deleted"
    }
}
```

## ETC-2. Room 나가기(유저만)
