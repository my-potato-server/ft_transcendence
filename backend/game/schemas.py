from ninja import ModelSchema

from .models import MatchHistory, UserMatchRecord


class MatchHistorySchema(ModelSchema):
	class Meta:
		model = MatchHistory
		fields = '__all__'


class UserMatchRecordSchema(ModelSchema):
	class Meta:
		model = UserMatchRecord
		fields = '__all__'
