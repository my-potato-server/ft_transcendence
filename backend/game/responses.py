from ninja import Schema
from datetime import datetime

from account.schemas import UserSchema


class MatchHistoryResponse(Schema):
	id: int
	tournament_id: int
	level: int
	win_user: UserSchema
	lose_user: UserSchema | None
	winner_score: int
	loser_score: int
	is_walkover: bool
	created_at: datetime


class UserMatchRecordResponse(Schema):
	user: UserSchema
	win_count: int
	lose_count: int
	match_count: int
	win_rate: float
	created_at: datetime
	updated_at: datetime
