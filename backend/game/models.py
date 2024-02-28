from django.db import models
from django.db.models import F

from .managers import MatchManager

from account.models import User


class Match(models.Model):
	id = models.BigAutoField(primary_key=True)
	user = models.ManyToManyField(User, related_name='matches')
	win_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='win_matches')
	lose_user = models.ManyToManyField(User, related_name='lose_matches')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	objects = MatchManager()


class UserMatchRecord(models.Model):
	id = models.BigAutoField(primary_key=True)
	user = models.OneToOneField(User, on_delete=models.PROTECT, related_name='match_records')
	win_count = models.PositiveIntegerField(default=0)
	lose_count = models.PositiveIntegerField(default=0)
	match_count = models.GeneratedField(
		expression=F('win_count') + F('lose_count'),
		output_field=models.PositiveIntegerField(default=0),
		db_persist=True,
	)
	win_rate = models.GeneratedField(
		expression=F('win_count') / (F('win_count') + F('lose_count')) * 100,
		output_field=models.DecimalField(max_digits=6, decimal_places=3, default=0.0),
		db_persist=True,
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class Tournament(models.Model):
	id = models.BigAutoField(primary_key=True)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)
