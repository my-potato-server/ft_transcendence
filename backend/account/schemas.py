from ninja import ModelSchema

from .models import User


class UserSchema(ModelSchema):
	class Meta:
		model = User
		fields = ['id', 'login', 'nickname', 'image', 'is_online', 'created_at']
