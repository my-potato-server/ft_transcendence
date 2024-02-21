from django.db import models

from account.models import User


class Match(models.Model):
	id = models.BigAutoField(primary_key=True)
	user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='matches')
	win_user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='win_matches')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
