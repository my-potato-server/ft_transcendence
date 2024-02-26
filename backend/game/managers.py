from django.db import models


class MatchManager(models.Manager):
	def create_match(self, user_id_list, win_user_id):
		match = self.create(win_user_id=win_user_id)
		match.user.add(*user_id_list)
		return match

	def get_match(self, user_id):
		return self.filter(user=user_id)
