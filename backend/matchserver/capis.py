# consumer APIs 
# json으로 받아 consumer가 호출할 수 있는 함수들으 모음
import re


from django.utils import timezone
from channels.db import database_sync_to_async
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .minigameserver import MiniGameServer

from .models import Room, UserRoom


@database_sync_to_async
def connect_to_server(user, password=None):
    # 데이터베이스에 기록이 남아있는지 확인 (이후 구현)
    # 끊어진지 얼마 안 되었다면, 자동으로 재접속 시도 (이후 구현)
    # 끊어진지 오래 되었거나 정보가 없다면, 새로 접속

    user_room = UserRoom.objects.update_or_create(
            user=user,
            defaults={'room': None}  # 사용자가 방에 들어가 있지 않음을 가정
            )
    
    return user_room

    pass

@database_sync_to_async
def disconnect_to_server(user, password=None):
    # 정상 종료인 경우 데이터베이스에서 기록을 삭제
    # 비정상 종료인 경우, 최근 끊어짐 시각에 기록을 남김
    
    # 사용자의 UserRoom 레코드를 찾아 left_at 필드에 현재 시각 기록
    try:
        user_room = UserRoom.objects.get(user=user)
        user_room.left_at = timezone.now()
        user_room.save()
    except UserRoom.DoesNotExist:
        # 사용자에 대한 UserRoom 레코드가 없는 경우, 필요한 처리 수행
        pass
    pass




@database_sync_to_async
def create_room(name, user_id, password=None):
    #입력 유효성 검사.================
    ###
    ### 이름은 string 이여야 함
    if not isinstance(name, str):
        return {'status': 'Error', 'message': "Name must be a string"}
        # raise ValueError("Name must be a string")
    ###
    ### 비밀번호는 없거나 문자열이여야 함
    if password is not None and not isinstance(password, str):
        return {'status': 'Error', 'message': "Password must be a string or None"}
        # raise ValueError("Password must be a string or None")
    ###
    ### 방 이름 길이 검사
    if len(name) > 100:
        return {'status': 'Error', 'message': "Name length must be less than or equal to 100 characters"}
    ###
    ### 방 이름 허용문자 검사
    if not re.match("^[A-Za-z0-9 -]+$", name):
        return {'status': 'Error', 'message': "Name must only contain letters, numbers, spaces, or hyphens"}
    ###
    ### 방 비밀번호 길이 검사
    if password and len(password) > 100:
        return {'status': 'Error', 'message': "Password length must be less than or equal to 100 characters"}
    ###
    ### 비밀번호 복잡성 검사 추가
    # if password:
    #     min_length = 8
    #     if len(password) < min_length:
    #         return {'status': 'Error', 'message': f"Password must be at least {min_length} characters long"}
    #     if not re.search("[A-Z]", password):
    #         return {'status': 'Error', 'message': "Password must contain at least one uppercase letter"}
    #     if not re.search("[a-z]", password):
    #         return {'status': 'Error', 'message': "Password must contain at least one lowercase letter"}
    #     if not re.search("[0-9]", password):
    #         return {'status': 'Error', 'message': "Password must contain at least one digit"}
    #     if not re.search("[!@#$%^&*(),.?\":{}|<>]", password):
    #         return {'status': 'Error', 'message': "Password must contain at least one special character"}

    ###
    ### 유저는 방에 참여하고 있으면 안 됨.
    try:
        # 유저가 이미 방에 참여하고 있는지 확인
        user_room = UserRoom.objects.filter(user__id=user_id, room__isnull=False).first()
        if user_room:
            # 이미 다른 방에 참여 중이면 에러 메시지 반환
            return {'status': 'Error', 'message': 'User is already in a room.'}
        
            # 데이터베이스 접근하여 방 생성 =====
        room, created = Room.objects.get_or_create(name=name, cheif=user_id, defaults={'password': password})
        if created:
            return {'status': 'OK', 'message': 'Room created', 'room_id': room.id}
        else:
            return {'status': 'Error', 'message': 'Room already exists'}
    except :
        return {'status': 'Error', 'message': 'Failed to create room due to an integrity error.'}   
        # # 유저가 참여하고 있지 않은 경우, 새로운 방 생성
        # with transaction.atomic():
        #     room = Room.objects.create(name=room_name)
        #     UserRoom.objects.update_or_create(
        #         user_id=user_id,
        #         defaults={'room': room}
        #     )
        #     return {'status': 'OK', 'message': 'Room created successfully.', 'room_id': room.id}




# @database_sync_to_async
# def delete_room(room_id):
#     # 데이터베이스 접근하여 방 삭제 =====
#     try:
#         room = Room.objects.get(id=room_id)
#         room.delete()
#         return {'status': 'OK', 'message': 'Room deleted', 'room_id': room_id}
#     except Room.DoesNotExist:
#         return {'status': 'Error', 'message': 'Room does not exist'}


# 방 조회하기
@database_sync_to_async
def list_room():
    rooms = Room.objects.all().values('id', 'name')  # id와 name 필드만 가져옴
    return list(rooms)
    pass

# 방 참여하기
@database_sync_to_async
def enter_room(user_id, room_id, room_password=None):
    try:
        user_room = UserRoom.objects.get(user__id=user_id)
        # 유저가 이미 방에 참여하고 있는지 확인
        if (user_room.room): return {'status': 'Error', 'message': 'User is already in a room.'}
        room = Room.objects.get(id=room_id)
        if not room.password == room_password: 
            return {'status': 'Error', 'message': 'Wrong Room Password'}
        user_room.room = room
        user_room.save()
        return {'status': 'OK', 'message': 'Room entered'}
    except UserRoom.DoesNotExist:
        return {'status': 'Error', 'message': 'UserRoom does not exist'}
    except Room.DoesNotExist:
        return {'status': 'Error', 'message': 'Room does not exist'}


# 방 나가기
@database_sync_to_async
def exit_room(user_id):
    try:
        user_room = UserRoom.objects.get(user__id=user_id)
        if (user_room.room.chief == user_id):
            return {'status': 'Error', 'message': 'RoomCheif cannot exit room'}
        user_room.room = None
        user_room.save()
        return {'status': 'OK', 'message': 'Room exited'}
    except UserRoom.DoesNotExist:
        return {'status': 'Error', 'message': 'UserRoom does not exist'}


# 방 삭제 함수
@database_sync_to_async
def delete_room(room_id, user_id):
    # 방 ID 유효성 검사
    if not isinstance(room_id, int):
        return {'status': 'Error', 'message': "Invalid room ID"}

    try:
        room = Room.objects.get(id=room_id)
    except:
        return {'status': 'Error', 'message': "Room does not exist"}

    # 권한 검사
    if not room.chief == user_id:
        return {'status': 'Error', 'message': "Only Room Cheif can delete room"}


    # 안전 확인 (예시 코드, 추가 로직 필요)
    # if room.has_active_users():
    #     return {'status': 'Error', 'message': "Room has active users"}


    # 빙에 있는 인원 내보내기 ========
    # send_message_to_room_that_room_was_updated(room_id)
    send_message_to_room_that_room_was_deleted(room_id)
    user_ids = get_user_ids_by_room_id()
    for id in user_ids:
        exit_room(id)

    # 방 삭제 로직
    room.delete()
    return {'status': 'OK', 'message': 'Room deleted'}

@database_sync_to_async
def start_room(room_id, user_id):
    # 토너먼트 게임을 시작.
    user_room = UserRoom.objects.get(user__id=user_id)
    if (user_room.room.chief == user_id):
        return {'status': 'Error', 'message': 'Only RoomCheif can start game'}
    pass


# 방의 정보를 요청
@database_sync_to_async
def info_room(room_id):
    # 어떤거 전해줘야 하나...
    # 방 이름
    # 방 참여자 명단. 닉네임으로
    # 또 필요한거 있나? 
    try:
        room = Room.objects.get(id=room_id)
        user_rooms = UserRoom.objects.filter(room=room)
        
        # 방 참여자 명단 추출
        participants = [user_room.user.username for user_room in user_rooms]
        
        room_info = {
            'name': room.name,
            'participants': participants,
            # 필요하다면 여기에 더 많은 방 정보를 추가할 수 있습니다.
        }
        return {'status': 'OK', 'data': room_info}
    except Room.DoesNotExist:
        return {'status': 'Error', 'message': 'Room does not exist'}



# async def undefined_method(self, **kwargs):
#     # 방 삭제 로직 구현
#     # 예시 응답
#     return {'status': 'OK', 'message': 'Room deleted', 'room_id': kwargs.get('room_id')}


# 클라이언트에게 웹 소켓으로 메시지를 보냄.
async def send_message_to(user_session_identify, method, status, identify, data=None):
    channel_layer = get_channel_layer()
    # 사용자별 고유 그룹 이름을 정의 (예: username을 그룹 이름으로 사용)
    group_name = user_session_identify
    
    # 메시지 형식을 Channels가 인식할 수 있도록 구성
    message = {
        'type': 'send_message',  # Consumer 내에서 정의해야 할 메서드 이름
        'method': method,
        'status': status,
        'identify': identify,
        'data': data or {}
    }

    # 비동기 함수를 동기 코드 내에서 호출
    await channel_layer.group_send(
        group_name,
        message
    )

# 데이터베이스를 조회해서 특정 방에 있는 사람들의 모든 유저의 ID를 세션ID 형태로 리턴
@database_sync_to_async
def get_user_session_identifiers_by_room_id(room_id):
    user_rooms = UserRoom.objects.filter(room__id=room_id)
    session_identifiers = [f'user_session_{user_room.user.id}' for user_room in user_rooms]
    return session_identifiers

# 데이터베이스를 조회해서 특정 방에 있는 사람들의 모든 유저의 ID를 리턴
@database_sync_to_async
def get_user_ids_by_room_id(room_id):
    user_rooms = UserRoom.objects.filter(room__id=room_id)
    user_ids = [user_room.user.id for user_room in user_rooms]
    return user_ids


# 특정 방에 있는 모든 클라이언트에게 메시지를 보냄
async def send_message_to_room(room_id, message):
    channel_layer = get_channel_layer()
    # 사용자별 고유 그룹 이름을 정의 (예: username을 그룹 이름으로 사용)
    session_identifires = get_user_session_identifiers_by_room_id(room_id)
    
    # 메시지 형식을 Channels가 인식할 수 있도록 구성
    message += {
        'type': 'send_message',  # Consumer 내에서 정의해야 할 메서드 이름
    }

    for id in session_identifires:
        await channel_layer.group_send(
            id,
            message
        )    
    
# 보낼만한 메시지
async def send_message_to_room_that_room_was_deleted(room_id):
    #send_message_to_room()
    pass
async def send_message_to_room_that_room_was_updated(room_id):
    pass

@database_sync_to_async
def enter_game(game_id):
    pass

@database_sync_to_async
def exit_game(game_id):
    pass

async def control_game(cmd, **kwargs):

    # 대진표 받아오기
        if cmd == "get_tournament_bracket":
            pass

    # 게임 조작하기
        if cmd == "game_control":
            pass

    # 일시정지하기
        if cmd == "game_pause":
            pass

    # 일시정지 풀기
        if cmd == "game_resume":
            pass
        

    if (cmd == ""):
        pass
    pass
