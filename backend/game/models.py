from decimal import Decimal

from django.db import models
from django.db.models import F, Case, When, Value
from django.db.models.functions import Cast

from .managers import MatchHistoryManager

from account.models import User


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
		expression=Case(
			When(win_count=0, lose_count=0, then=Value(
				0.0, output_field=models.DecimalField(max_digits=6, decimal_places=3, default=0.0))
			),
			When(win_count=0, then=Value(
				0.0, output_field=models.DecimalField(max_digits=6, decimal_places=3, default=0.0))
			),
			When(lose_count=0, then=Value(
				100.0, output_field=models.DecimalField(max_digits=6, decimal_places=3, default=0.0))
			),
			default=F('win_count') * 100 / (F('win_count') + F('lose_count')),
			output_field=models.DecimalField(max_digits=6, decimal_places=3, default=0.0),
		),
		output_field=models.DecimalField(max_digits=6, decimal_places=3, default=0.0),
		db_persist=True,
	)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class Tournament(models.Model):
	id = models.BigAutoField(primary_key=True)
	users = models.ManyToManyField(User, related_name='tournaments')
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)


class MatchHistory(models.Model):
	id = models.BigAutoField(primary_key=True)
	tournament = models.ForeignKey(Tournament, on_delete=models.PROTECT, related_name='matche_histories')
	level = models.PositiveIntegerField(default=0)
	win_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='win_match_histories')
	winner_score = models.PositiveIntegerField(default=0)
	lose_user = models.ForeignKey(User, on_delete=models.PROTECT, related_name='lose_match_histories', null=True)
	loser_score = models.PositiveIntegerField(default=0)
	is_walkover = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)
	updated_at = models.DateTimeField(auto_now=True)

	objects = MatchHistoryManager()
