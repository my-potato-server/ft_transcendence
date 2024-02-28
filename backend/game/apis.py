from typing import List
from ninja import NinjaAPI

from .models import UserMatchRecord, MatchHistory, Tournament

from account.auth import AuthBearer


match_api = NinjaAPI(urls_namespace="match")


@match_api.get("/rank")
def get_rank(request):
	data = UserMatchRecord.objects.order_by('-win_rate')
	return 200, {"data": data}
