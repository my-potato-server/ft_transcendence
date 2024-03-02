import jwt
import datetime
from django.conf import settings


def create_token(user):
	payload = {
		'user_id': user.id,
		'login': user.login,
		'nickname': user.nickname,
		'created_at': user.created_at.isoformat(),
		'exp': datetime.datetime.now(datetime.UTC) + datetime.timedelta(days=30),
	}
	token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
	return token


def get_decoded_token(token):
	try:
		decoded_token = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
	except jwt.ExpiredSignatureError:
		return None
	except jwt.InvalidTokenError:
		return None
	return decoded_token
