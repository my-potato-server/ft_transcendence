from django.contrib.auth.backends import ModelBackend
from ninja.security import HttpBearer

from .models import User

from main.jwt import validate_token


class CustomBackend(ModelBackend):
    def authenticate(self, request, login=None, **kwargs):
        try:
            user = self.get_user(login)
            return user
        except User.DoesNotExist:
            return None

    def get_user(self, login):
        try:
            return User.objects.get(login=login)
        except User.DoesNotExist:
            return None


class AuthBearer(HttpBearer):
    def authenticate(self, request, token):
        return validate_token(token)
