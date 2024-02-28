from ninja import Schema


class LoginRequest(Schema):
	code: str
	redirect_uri: str


class MakeTestUserRequest(Schema):
	login: str


class EditNicknameRequest(Schema):
	nickname: str


class FriendRequestByLoginRequest(Schema):
	login: str
