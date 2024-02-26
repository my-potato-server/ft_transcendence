from typing import List
from ninja import NinjaAPI

from .models import Match, UserMatchRecord

from account.auth import AuthBearer


match_api = NinjaAPI(urls_namespace="match")


@match_api.post("", auth=AuthBearer())
def match(request, user_id_list: List[int], win_user_id: int):
	Match.objects.create_match(user_id_list, win_user_id)
	for user_id in user_id_list:
		match_record = UserMatchRecord.objects.get_or_create(user_id=user_id)
		if user_id == win_user_id:
			match_record.win_count += 1
		else:
			match_record.lose_count += 1
		match_record.save()
	return 200, {"message": "Match created"}


@match_api.get("/{user_id}")
def get_match(request, user_id: int):
	record = UserMatchRecord.objects.get(user_id=user_id)
	if not record:
		return 404, {"message": "User not found"}
	data = Match.objects.get_match(user_id)
	return 200, {"record": record, "matches": data}


@match_api.get("/rank")
def get_rank(request):
	data = UserMatchRecord.objects.order_by('-win_rate')
	return 200, {"data": data}
