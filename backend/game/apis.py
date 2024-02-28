from typing import List
from ninja import NinjaAPI, Router
from ninja.orm import create_schema
from django.db.models import Q

from .models import UserMatchRecord, MatchHistory, Tournament
from .utils import create_tournament_id, create_match_history
from .schemas import MatchHistorySchema
from .responses import MatchHistoryResponse, UserMatchRecordResponse

from account.auth import AuthBearer
from account.models import User


match_api = Router(tags=["match"])


@match_api.get("/rank", response={200: List[UserMatchRecordResponse]})
def get_rank(request):
	data = UserMatchRecord.objects.order_by('-win_rate')
	return 200, data


@match_api.get("/rank/me", auth=AuthBearer(), response={200: UserMatchRecordResponse})
def get_my_rank(request):
	data, _ = UserMatchRecord.objects.get_or_create(user=request.user)
	return 200, data


@match_api.get("/history/me", auth=AuthBearer(), response={200: List[MatchHistoryResponse]})
def get_my_match_history(request):
	user = request.user
	data = MatchHistory.objects.filter(Q(win_user=user) | Q(lose_user=user)).order_by('-created_at')
	return 200, data


@match_api.get("/history/{tournament_id}", response={200: List[MatchHistorySchema]})
def get_match_history(request, tournament_id: int):
	data = MatchHistory.objects.filter(tournament_id=tournament_id).order_by('-created_at')
	return 200, data


@match_api.post("/test/make-win-tournament", auth=AuthBearer(), summary="user가 4강 토너먼트 전부 승리한 케이스")
def test_make_win_tournament(request):
	user = request.user
	test_user1 = User.objects.get_or_create_user(login="test_user1")
	test_user2 = User.objects.get_or_create_user(login="test_user2")
	test_user3 = User.objects.get_or_create_user(login="test_user3")
	tournament_id = create_tournament_id()

	create_match_history(tournament_id, 4, user.id, test_user1.id, 10, 5)
	create_match_history(tournament_id, 4, test_user2.id, test_user3.id, 8, 4)
	create_match_history(tournament_id, 2, user.id, test_user2.id, 9, 3)
	return 200, {"message": f"{tournament_id} tournament success"}


@match_api.post("/test/make-lose-tournament", auth=AuthBearer(), summary="user가 4강 토너먼트 전부 패배한 케이스")
def test_make_lose_tournament(request):
	user = request.user
	test_user1 = User.objects.get_or_create_user(login="test_user1")
	test_user2 = User.objects.get_or_create_user(login="test_user2")
	test_user3 = User.objects.get_or_create_user(login="test_user3")
	tournament_id = create_tournament_id()

	create_match_history(tournament_id, 4, test_user1.id, user.id, 15, 13)
	create_match_history(tournament_id, 4, test_user2.id, test_user3.id, 6, 2)
	create_match_history(tournament_id, 2, test_user2.id, test_user1.id, 8, 3)
	return 200, {"message": f"{tournament_id} tournament success"}


@match_api.post(
	"/test/make-win-walkover-tournament",
	auth=AuthBearer(),
	summary="user가 4강 토너먼트 부전승으로 진출 후 승리한 케이스"
)
def test_make_win_walkover_tournament(request):
	user = request.user
	test_user1 = User.objects.get_or_create_user(login="test_user1")
	test_user2 = User.objects.get_or_create_user(login="test_user2")
	tournament_id = create_tournament_id()

	create_match_history(tournament_id, 4, user.id, is_walkover=True)
	create_match_history(tournament_id, 4, test_user1.id, test_user2.id, 8, 4)
	create_match_history(tournament_id, 2, user.id, test_user1.id, 9, 3)
	return 200, {"message": f"{tournament_id} tournament success"}


@match_api.post(
	"/test/make-lose-walkover-tournament",
	auth=AuthBearer(),
	summary="user가 4강 토너먼트 부전승으로 진출 후 패배한 케이스"
)
def test_make_lose_walkover_tournament(request):
	user = request.user
	test_user1 = User.objects.get_or_create_user(login="test_user1")
	test_user2 = User.objects.get_or_create_user(login="test_user2")
	tournament_id = create_tournament_id()

	create_match_history(tournament_id, 4, user.id, is_walkover=True)
	create_match_history(tournament_id, 4, test_user1.id, test_user2.id, 8, 4)
	create_match_history(tournament_id, 2, test_user1.id, user.id, 9, 3)
	return 200, {"message": f"{tournament_id} tournament success"}
