import jwt
import datetime
from django.conf import settings


def create_token(login):
	payload = {
		'login': login,
		'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=30),
	}
	token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
	return token


def validate_token(token) -> bool:
	try:
		jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
	except jwt.ExpiredSignatureError:
		return False
	except jwt.InvalidTokenError:
		return False
	return True
