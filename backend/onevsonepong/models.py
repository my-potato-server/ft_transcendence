# onevsonepong/models.py
from django.db import models

class Game(models.Model):
	left_paddle_y = models.IntegerField(default=360)
	right_paddle_y = models.IntegerField(default=360)
	ball_position = models.JSONField(default=dict)
	left_player_score = models.IntegerField(default=0)
	right_player_score = models.IntegerField(default=0)
	game_over = models.BooleanField(default=False)
	winner = models.IntegerField(default=0)
	key = models.CharField(max_length=10, default='')
	player = models.CharField(max_length=10, default='')