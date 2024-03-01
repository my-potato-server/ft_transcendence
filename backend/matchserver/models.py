# import uuid
from django.db import models
from account.models import User
# Create your models here.

# 방의 정보를 적어둔 데이터베이스
class Room(models.Model):
    # id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=100, blank=True, null=True)
    chief = models.ForeignKey(User, on_delete=models.CASCADE, unique=True)

    def __str__(self):
        return self.name

# class UserProfile(models.Model):
#     user = models.OneToOneField(User, on_delete=models.CASCADE)
#     # UserProfile 모델에 추가적인 사용자 정보 필드를 정의할 수 있습니다.

# 웹소켓이 연결된 사용자들을 적어둔 데이터베이스
class UserRoom(models.Model):
    # 사용자
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # 들어가 있는 방
    room = models.ForeignKey(Room, on_delete=models.SET_NULL, null=True, blank=True)
    # 게임서버와 연결된 시각
    joined_at = models.DateTimeField(auto_now_add=True)
    # 게임서버와 연결이 끊어진 시각 (재접속용 기록)
    left_at = models.DateTimeField(null=True, blank=True)

    # #현재 참여하고 있는 게임
    # game_id = models.CharField(max_length=100, blank=True, null=True)