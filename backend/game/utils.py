from .models import Tournament


def create_tournament_id():
	return Tournament.objects.create().id
