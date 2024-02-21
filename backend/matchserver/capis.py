# consumer APIs 
# json으로 받아 consumer가 호출할 수 있는 함수들으 모음
import re

from channels.db import database_sync_to_async
from .models import Room


@database_sync_to_async
def connect_to_server(name, password=None):
    # 데이터베이스에 기록이 남아있는지 확인
    # 끊어진지 얼마 안 되었다면, 자동으로 재접속 시도
    # 끊어진지 오래 되었거나 정보가 없다면, 새로 접속
    pass

@database_sync_to_async
def disconnect_to_server(name, password=None):
    # 정상 종료인 경우 데이터베이스에서 기록을 삭제
    # 비정상 종료인 경우, 최근 끊어짐 시각에 기록을 남김
    pass


@database_sync_to_async
def create_room(name, password=None):
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
    
    # 데이터베이스 접근하여 방 생성 =====
    room, created = Room.objects.get_or_create(name=name, defaults={'password': password})
    if created:
        return {'status': 'OK', 'message': 'Room created', 'room_id': room.id}
    else:
        return {'status': 'Error', 'message': 'Room already exists'}

# @database_sync_to_async
# def delete_room(room_id):
#     # 데이터베이스 접근하여 방 삭제 =====
#     try:
#         room = Room.objects.get(id=room_id)
#         room.delete()
#         return {'status': 'OK', 'message': 'Room deleted', 'room_id': room_id}
#     except Room.DoesNotExist:
#         return {'status': 'Error', 'message': 'Room does not exist'}


# 방 삭제 함수
@database_sync_to_async
def delete_room(room_id):
    # 방 ID 유효성 검사
    if not isinstance(room_id, int):
        return {'status': 'Error', 'message': "Invalid room ID"}

    try:
        room = Room.objects.get(id=room_id)
    except ObjectDoesNotExist:
        return {'status': 'Error', 'message': "Room does not exist"}

    # 권한 검사 (예시 코드, 실제 구현에는 사용자 인증 로직 필요)
    # if not user_has_permission(request.user, room):
    #     return {'status': 'Error', 'message': "No permission to delete this room"}

    # 안전 확인 (예시 코드, 추가 로직 필요)
    # if room.has_active_users():
    #     return {'status': 'Error', 'message': "Room has active users"}


    # 빙에 있는 인원 내보내기 ========

    # 방 삭제 로직
    room.delete()
    return {'status': 'OK', 'message': 'Room deleted'}


# async def undefined_method(self, **kwargs):
#     # 방 삭제 로직 구현
#     # 예시 응답
#     return {'status': 'OK', 'message': 'Room deleted', 'room_id': kwargs.get('room_id')}

