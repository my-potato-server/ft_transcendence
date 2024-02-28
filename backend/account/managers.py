import string
import random

from django.contrib.auth.models import BaseUserManager


class UserManager(BaseUserManager):
    @staticmethod
    def _get_random_string(length):
        return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(length))

    def create_user(self, login):
        user = self.model(login=login, nickname=login)
        user.set_password(self._get_random_string(30))
        user.save(using=self._db)
        return user

    def get_or_create_user(self, login):
        user = self.filter(login=login).first()
        if user:
            return user
        return self.create_user(login)

    def create_superuser(self, login, password):
        user = self.model(login=login)
        user.set_password(password)
        user.is_superuser = True
        user.save(using=self._db)
        return user
