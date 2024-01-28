from ninja import Schema


class LoginRequest(Schema):
	code: str
	redirect_uri: str
