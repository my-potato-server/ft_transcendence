# onevsonepong/consumers.py

import json
import asyncio
from channels.generic.websocket import AsyncWebsocketConsumer
from .pong_game import PongGame

class PongConsumer(AsyncWebsocketConsumer):
	def __init__(self):
		super().__init__()
		self.pong_game = PongGame()

	async def connect(self):
		await self.accept()
		self.pong_game = PongGame()
		initial_game_state = self.pong_game.get_game_state()
		await self.send(text_data=json.dumps(initial_game_state))
		asyncio.create_task(self.game_loop())

	async def game_loop(self):
		while True:
			self.pong_game.update()
			game_state = self.pong_game.get_game_state()
			await self.send(text_data=json.dumps(game_state))
			await asyncio.sleep(1/24)

	async def disconnect(self, close_code):
		pass

	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		action = text_data_json['action']
		self.pong_game.key = text_data_json['key']
		self.pong_game.player = text_data_json['player']
		left_paddle_y = text_data_json['left_paddle_y']
		right_paddle_y = text_data_json['right_paddle_y']
		ball_position = text_data_json['ball_position']
		left_player_score = text_data_json['left_player_score']
		right_player_score = text_data_json['right_player_score']
		game_over = text_data_json['game_over']
		winner = text_data_json['winner']

		if action == 'game_over':
			self.pong_game = reset()

		self.pong_game.move_paddle()

		left_paddle_y = self.pong_game.left_paddle_y
		right_paddle_y = self.pong_game.right_paddle_y
		ball_position = self.pong_game.ball_position
		left_player_score = self.pong_game.left_player_score
		right_player_score = self.pong_game.right_player_score
		game_over = self.pong_game.game_over
		winner = self.pong_game.winner

		await self.send(text_data=json.dumps({
			'left_paddle_y': left_paddle_y,
			'right_paddle_y': right_paddle_y,
			'ball_position': ball_position,
			'left_player_score': left_player_score,
			'right_player_score': right_player_score,
			'game_over': game_over,
			'winner': winner,
		}))