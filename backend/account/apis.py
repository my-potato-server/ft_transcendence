from typing import List
from ninja import NinjaAPI, File
from ninja.files import UploadedFile
from django.contrib.auth import authenticate
from django.conf import settings
from django.db.models import Q

from .requests import LoginRequest
from .responses import LoginResponse, UserResponse, FriendshipResponse
from .ft_auth import FtAuth
from .models import User, Friendship
from .auth import AuthBearer

from main.responses import ErrorResponse
from main.jwt import create_token

account_api = NinjaAPI()
friend_api = NinjaAPI()


@account_api.post("/login", response={200: LoginResponse, 400: ErrorResponse})
def login(request, data: LoginRequest):
	try:
		login_name = FtAuth(data.code, data.redirect_uri).get_login()
	except:
		return 400, {"message": "Invalid code or redirect_uri"}
	user = authenticate(request=request, login=login_name)
	if not user:
		user = User.objects.create_user(login=login_name)
	return 200, {"token": create_token(user)}


@account_api.get("/auth-test", auth=AuthBearer())
def auth_test(request):
	return 200, {"message": f"Ok. This user is {request.auth}."}


@account_api.get("/42-oauth-url")
def ft_oauth_url(request):
	ft_api_sign_in = "https://api.intra.42.fr/oauth/authorize"
	redirect_uri = "https://localhost/src/pages/Main"
	response_type = "code"
	ft_api_scope = "public"
	url = (
		f"{ft_api_sign_in}?client_id={settings.FT_UID_KEY}&redirect_uri={redirect_uri}&"
		f"response_type={response_type}&scope={ft_api_scope}"
	)
	return url


@account_api.get("/me", auth=AuthBearer(), response={200: UserResponse})
def me(request):
	return 200, {"user": request.user}


@account_api.post("/edit-nickname", auth=AuthBearer())
def edit_nickname(request, nickname: str):
	request.user.nickname = nickname
	request.user.save()
	return 200, {"message": "Nickname changed"}


@account_api.post("/edit-image", auth=AuthBearer())
def edit_image(request, image: UploadedFile = File(...)):
	request.user.image = image
	request.user.save()
	return 200, {"message": "Image changed"}


@friend_api.post("/list", auth=AuthBearer(), response={200: List[UserResponse]})
def list_friends(request):
	friends = Friendship.objects.filter(Q(from_user=request.user) | Q(to_user=request.user), accepted=True)
	friends_list = [
		UserResponse(user=f.from_user if f.to_user == request.user else f.to_user)
		for f in friends
	]
	return 200, {"friends": friends_list}


@friend_api.get("/requests", auth=AuthBearer(), response={200: List[FriendshipResponse]})
def list_requests(request):
	requests = Friendship.objects \
		.filter(Q(from_user=request.user) | Q(to_user=request.user), accepted=False) \
		.exclude(requested_by=request.user)
	request_list = [
		FriendshipResponse(id=f.id, user=f.from_user if f.to_user == request.user else f.to_user)
		for f in requests
	]
	return 200, {"requests": request_list}


@friend_api.post("/request/{user_id}", auth=AuthBearer())
def request_friend(request, user_id: int):
	user = User.objects.get(id=user_id)
	if user == request.user:
		return 400, {"message": "You can't add yourself"}
	if Friendship.objects \
			.filter(Q(from_user=request.user, to_user=user) | Q(from_user=user, to_user=request.user)) \
			.exists():
		return 400, {"message": "You are already friends"}
	Friendship.objects.create(from_user=request.user, to_user=user, requested_by=request.user)
	return 200, {"message": "Friend request sent"}


@friend_api.post("/accept/{request_id}", auth=AuthBearer())
def accept_friend(request, request_id: int):
	friendship = Friendship.objects.get(id=request_id)
	if friendship.requested_by == request.user:
		return 400, {"message": "You can't accept your own request"}
	if friendship.from_user != request.user and friendship.to_user != request.user:
		return 400, {"message": "This request is not for you"}
	friendship.accepted = True
	friendship.save()
	return 200, {"message": "Friend request accepted"}
