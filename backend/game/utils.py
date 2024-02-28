from .models import Tournament, MatchHistory, UserMatchRecord


def create_tournament_id():
	return Tournament.objects.create().id


def create_match_history(
		tournament_id: int,
		level: int,
		win_user_id: int,
		lose_user_id: int,
		winner_score: int = None,
		loser_score: int = None,
		is_walkover: bool = False,
):
	tournament = Tournament.objects.get(id=tournament_id)
	win_user = tournament.users.filter(id=win_user_id).first()
	lose_user = tournament.users.filter(id=lose_user_id).first()

	tournament.users.add(win_user)
	win_user_record = UserMatchRecord.objects.get_or_create(user=win_user)
	win_user_record.win_count += 1
	win_user_record.save()
	if lose_user:
		tournament.users.add(lose_user)
		lose_user_record = UserMatchRecord.objects.get_or_create(user=lose_user)
		lose_user_record.lose_count += 1
		lose_user_record.save()

	MatchHistory.objects.create(
		tournament=tournament,
		level=level,
		win_user=win_user,
		winner_score=winner_score,
		lose_user=lose_user,
		loser_score=loser_score,
		is_walkover=is_walkover,
	)
