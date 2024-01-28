from ninja import NinjaAPI
from django.contrib.auth import authenticate
from django.conf import settings

from .requests import LoginRequest
from .responses import LoginResponse
from .ft_auth import FtAuth
from .models import User
from .auth import AuthBearer

from main.responses import ErrorResponse
from main.jwt import create_token


api = NinjaAPI()


@api.post("/login", response={200: LoginResponse, 400: ErrorResponse})
def login(request, data: LoginRequest):
	try:
		login_name = FtAuth(data.code, data.redirect_uri).get_login()
	except:
		return 400, {"message": "Invalid code or redirect_uri"}
	user = authenticate(request=request, login=login_name)
	if not user:
		User.objects.create_user(login=login_name)
	return 200, {"token": create_token(login_name)}


@api.get("/auth-test", auth=AuthBearer())
def auth_test(request):
	return 200, {"message": "ok"}


@api.get("/test-url")
def test_url(request):
	ft_api_sign_in = "https://api.intra.42.fr/oauth/authorize"
	redirect_uri = "https://localhost"
	response_type = "code"
	ft_api_scope = "public"
	url = (
		f"{ft_api_sign_in}?client_id={settings.FT_UID_KEY}&redirect_uri={redirect_uri}&"
		f"response_type={response_type}&scope={ft_api_scope}"
	)
	return url
