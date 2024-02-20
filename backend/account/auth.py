from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import authenticate as django_authenticate
from django.contrib.auth import login
from ninja.security import HttpBearer

from .models import User

from main.jwt import get_decoded_token


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
        if decoded_token := get_decoded_token(token):
            if user := django_authenticate(request=request, login=decoded_token['login']):
                login(request, user)
                return user
        return None
