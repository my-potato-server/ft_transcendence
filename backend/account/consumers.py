import json
from ninja import Schema
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from .models import User

from main.jwt import get_decoded_token


class OnlineSchema(Schema):
	token: str


class OnlineConsumer(AsyncWebsocketConsumer):
	@database_sync_to_async
	def edit_user_online(self, user_id, is_online):
		user = User.objects.get(id=user_id)
		user.is_online = is_online
		user.save()
		return user

	async def connect(self):
		await self.accept()

	async def disconnect(self, close_code):
		user = await self.edit_user_online(self.user_id, False)
		print(f"OnlineConsumer : {user.nickname} is offline")

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		data = OnlineSchema(**text_data_json)
		if decoded_token := get_decoded_token(data.token):
			self.user_id = decoded_token["user_id"]
			user = await self.edit_user_online(self.user_id, True)
			print(f"OnlineConsumer : {user.nickname} is online")
		else:
			print("OnlineConsumer : Invalid token")
