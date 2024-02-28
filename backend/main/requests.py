from ninja import Schema


class SubscribeRequest(Schema):
	email: str
