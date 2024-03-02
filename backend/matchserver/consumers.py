# chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json
import base64
from urllib.parse import parse_qs

from matchserver import capis
from inspect import isfunction, getmembers
from account.models import User
from channels.db import database_sync_to_async

from inspect import getmembers, isroutine

def get_method_actions(prefix, module):
    method_actions = {}
    # getmembers 함수를 사용하여 모듈 내의 모든 멤버를 조회
    for name, obj in getmembers(module):
        # 특정 접두사로 시작하는 이름을 필터링하고, 일반 함수 또는 데코레이터가 적용된 객체를 대상으로 함
        if name.startswith(prefix) and (isroutine(obj) or hasattr(obj, '__call__')):
            action_name = f"matchserver.{name}"
            method_actions[action_name] = obj
    return method_actions

# def get_method_actions(prefix, module):
#     method_actions = {}
#     # getmembers 함수를 사용하여 모듈 내의 모든 멤버를 조회
#     for name, func in getmembers(module, isfunction):
#         if name.startswith(prefix):  # 특정 접두사로 시작하는 함수 이름을 필터링
#             action_name = f"matchserver.{name}"
#             method_actions[action_name] = func
#     return method_actions

# 'capis' 모듈에서 'prefix'로 시작하는 모든 함수를 method_actions 딕셔너리에 추가
prefix = ""  # 필요한 경우 특정 접두사를 설정할 수 있습니다.
method_actions = get_method_actions(prefix, capis)

# 사용 예시
print(method_actions)

def decode_jwt_get_user_id(token):
    # JWT 토큰을 '.'을 기준으로 분리합니다.
    header, payload, signature = token.split('.')
    
    # Base64로 인코딩된 페이로드를 디코딩합니다.
    payload += '=' * (-len(payload) % 4)  # 패딩 문제 수정
    decoded_payload = base64.urlsafe_b64decode(payload).decode('utf-8')
    
    # JSON 문자열을 파싱하여 딕셔너리로 변환합니다.
    payload_data = json.loads(decoded_payload)
    
    # user_id를 추출하여 반환합니다.
    return payload_data.get('user_id')  # 'user_id'는 실제 키 이름에 따라 변경해야 할 수 있습니다.

@database_sync_to_async
def get_user_id(user_room):
    return user_room.user.id

class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # ws://yourserver/ws/?token=<your_token> 쿼리 파라미터에서 토큰을 가져옵니다.
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]
        user_id = decode_jwt_get_user_id(token)
        try:
            self.user = await database_sync_to_async(User.objects.get)(id=user_id)
        except:
            await self.close()

        if True:#임시조치
            await self.accept()
            self.user_room, created  = await capis.connect_to_server(self.user)  # 사용자 인스턴스 전달
            self.user_id = user_id
            self.user_session_identify = f'user_session_{self.user_id}'

            await self.channel_layer.group_add(     # 사용자별 그룹에 가입
                self.user_session_identify,
                self.channel_name
            )
        else:
            await self.close()
        
        # capis에서 부를 수 있는 함수들을 method_action에 담는다.
        prefix = ""  # 필요한 경우 특정 접두사를 설정할 수 있습니다.
        self.method_action = get_method_actions(prefix, capis)
 

    async def disconnect(self, close_code):
        if True:
            await capis.disconnect_to_server(self.user)  # 사용자 인스턴스 전달
            await self.channel_layer.group_discard(
                self.user_session_identify,
                self.channel_name
            )
        await self.close()


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        print("recived : " , text_data_json)

        method = text_data_json.get('method')
        parameters = text_data_json.get('parameters', {})
        identify = text_data_json.get('identify')


        # 메서드 딕셔너리 (예시다. 아래에서 덮어쓴다.)
        # method_actions = {
        #     'matchserver.make_room': capis.make_room,
        #     'matchserver.delete_room': capis.delete_room,
        #     # 'matchserver.delete_room': capis.delete_room,
        # }
        # 원형은 위와 같다. 이는 connect에서 게산한 내용으로 덮어 쓰는 것
        method_actions = self.method_action
        
        if not isinstance(parameters, dict):
            await self.send_response(method=method, status="ERROR - Parameter Should be Dict type", identify=identify, data=None)
            return
        
        # 파라미터에서 user_id는 덮어쓰기
        parameters['user_id'] = self.user_id

        # # 메서드 실행
        # if method in method_actions:
        #     response = await method_actions[method](**parameters)
        #     await self.send(text_data=json.dumps(response))
        # else:
        #     await self.send(text_data=json.dumps({'error': 'Invalid method name'}))

        if method in method_actions:
            response = await method_actions[method](**parameters)
            await self.send_response(method=method, status="OK", identify=identify, data=response)
        else:
            await self.send_response(method=method, status="ERROR - Invalid method name", identify=identify, data=None)


    async def send_response(self, method, status, identify, data=None):
        response = {
            'method': method,
            'status': status,
            'identify': identify,
            'responseId': self.user_id,
            'data': data or {}  # data가 None이면 빈 딕셔너리를 반환
        }
        print("send : " , response)
        await self.send(text_data=json.dumps(response))


    # 메시지 전송
    async def send_message(self, event):
        print("send_event : " , event)
        await self.send(text_data=json.dumps(event))



    