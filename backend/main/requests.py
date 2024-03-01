from ninja import Schema
from pydantic import EmailStr


class SubscribeRequest(Schema):
	email: EmailStr
