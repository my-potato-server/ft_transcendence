from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin

from .managers import UserManager


class User(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    login = models.CharField(max_length=20, unique=True)
    nickname = models.CharField(max_length=20, unique=True)
    image = models.ImageField(upload_to='profile/', default='default.png')
    is_active = models.BooleanField(default=True)
    is_online = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'login'

    class Meta:
        indexes = [
            models.Index(fields=['login'], name='login_idx'),
        ]


class Friendship(models.Model):
    id = models.BigAutoField(primary_key=True)
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_from_user')
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friendship_to_user')
    requested_by = models.OneToOneField(User, on_delete=models.CASCADE)
    accepted = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('from_user', 'to_user')

    def save(self, *args, **kwargs):
        if self.from_user.id > self.to_user.id:
            self.from_user.id, self.to_user.id = self.to_user.id, self.from_user.id
        super().save(*args, **kwargs)
