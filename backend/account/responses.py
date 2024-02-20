from ninja import Schema

from .schemas import UserSchema


class LoginResponse(Schema):
	token: str


class UserResponse(Schema):
	user: UserSchema
