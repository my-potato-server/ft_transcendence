from ninja import Schema


class LoginResponse(Schema):
	token: str
