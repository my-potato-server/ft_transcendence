# chat/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
import json

from matchserver import capis
from inspect import isfunction, getmembers

def get_method_actions(prefix, module):
    method_actions = {}
    # getmembers 함수를 사용하여 모듈 내의 모든 멤버를 조회
    for name, func in getmembers(module, isfunction):
        if name.startswith(prefix):  # 특정 접두사로 시작하는 함수 이름을 필터링
            action_name = f"matchserver.{name}"
            method_actions[action_name] = func
    return method_actions

# 'capis' 모듈에서 'prefix'로 시작하는 모든 함수를 method_actions 딕셔너리에 추가
prefix = ""  # 필요한 경우 특정 접두사를 설정할 수 있습니다.
method_actions = get_method_actions(prefix, capis)

# 사용 예시
print(method_actions)


class MyConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_authenticated:
            await self.accept()
            self.user_room  = await capis.connect_to_server(self.user)  # 사용자 인스턴스 전달
            self.user_session_identify = f'user_session_{self.user_room.user.id}'

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
        if self.user.is_authenticated:
            await capis.disconnect_to_server(self.user)  # 사용자 인스턴스 전달
            await self.channel_layer.group_discard(
                self.user_session_identify,
                self.channel_name
            )


    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        method = text_data_json.get('method')
        parameters = text_data_json.get('parameters', {})
        identify = text_data_json.get('identify')


        # 메서드 딕셔너리 (예시다. 아래에서 덮어쓴다.)
        method_actions = {
            'matchserver.make_room': capis.make_room,
            'matchserver.delete_room': capis.delete_room,
            # 'matchserver.delete_room': capis.delete_room,
        }
        # 원형은 위와 같다. 이는 connect에서 게산한 내용으로 덮어 쓰는 것
        method_actions = self.method_action
 
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
            await self.send_response(method=method, status="ERROR - Invalid method name", identify=identify, data=response)


    async def send_response(self, method, status, identify, data=None):
        response = {
            'method': method,
            'status': status,
            'identify': identify,
            'data': data or {}  # data가 None이면 빈 딕셔너리를 반환
        }
        await self.send(text_data=json.dumps(response))


    # 메시지 전송
    async def send_message(self, event):
        await self.send(text_data=json.dumps(event))
        # # event 딕셔너리에서 메시지 데이터 추출
        # method = event['method']
        # status = event['status']
        # identify = event['identify']
        # data = event['data']

        # event -= {'type': 'send_message'}

        # # 클라이언트에게 메시지 전송
        # await self.send(text_data=json.dumps({
        #     'method': method,
        #     'status': status,
        #     'identify': identify,
        #     'data': data
        # }))
        
        # 클라이언트에게 메시지 전송
        # await self.send(text_data=json.dumps(event))



    