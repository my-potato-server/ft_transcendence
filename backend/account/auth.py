from django.contrib.auth.backends import ModelBackend

from .models import User


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
