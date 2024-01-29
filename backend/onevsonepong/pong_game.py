# onevsonepong/pong_game.py

import random

class PongGame:
	def __init__(self):
		self.ball_position = {'x': 640, 'y': 360}
		self.ball_velocity = {'x': random.choice([-3, 3]), 'y': random.choice([-4, 4])}
		self.left_paddle_y = 360
		self.right_paddle_y = 360
		self.left_player_score = 0
		self.right_player_score = 0
		self.game_over = False
		self.winner = None
		self.key = None
		self.player = None

	def move_ball(self):
		self.ball_position['x'] += self.ball_velocity['x']
		self.ball_position['y'] += self.ball_velocity['y']

		# 왼쪽 벽에 부딪히면
		if self.ball_position['x'] <= 0:
			self.ball_velocity['x'] = -self.ball_velocity['x']
			self.right_player_score += 1
			self.reset_ball()
		# 오른쪽 벽에 부딪히면
		elif self.ball_position['x'] >= 1280:
			self.ball_velocity['x'] = -self.ball_velocity['x']
			self.left_player_score += 1
			self.reset_ball()
		# 위쪽 벽에 부딪히면
		elif self.ball_position['y'] <= 0:
			self.ball_velocity['y'] = -self.ball_velocity['y']
			self.ball_velocity['x'] *= 1.05
		# 아래쪽 벽에 부딪히면
		elif self.ball_position['y'] >= 720:
			self.ball_velocity['y'] = -self.ball_velocity['y']
			self.ball_velocity['x'] *= 1.05
		# 왼쪽 패들에 부딪히면
		elif self.ball_position['x'] <= 20 and self.left_paddle_y - 40 <= self.ball_position['y'] <= self.left_paddle_y + 40:
			self.ball_velocity['x'] = -self.ball_velocity['x']
			self.ball_velocity['x'] *= 1.05
		# 오른쪽 패들에 부딪히면
		elif self.ball_position['x'] >= 1260 and self.right_paddle_y - 40 <= self.ball_position['y'] <= self.right_paddle_y + 40:
			self.ball_velocity['x'] = -self.ball_velocity['x']
			self.ball_velocity['x'] *= 1.05

	def reset_ball(self):
		self.ball_position = {'x': 640, 'y': 360}
		self.ball_velocity = {'x': random.choice([-3, 3]), 'y': random.choice([-1, 1])}

	def move_paddle(self):
		if self.player == '1':
			if self.key == 'ArrowUp':
				self.left_paddle_y -= 4
			elif self.key == 'ArrowDown':
				self.left_paddle_y += 4
		elif self.player == '2':
			if key == 'ArrowUp':
				self.right_paddle_y -= 4
			elif key == 'ArrowDown':
				self.right_paddle_y += 4
		if (self.left_paddle_y >= 660):
			self.left_paddle_y = 660
		elif (self.left_paddle_y <= 0):
			self.left_paddle_y = 0
		if (self.right_paddle_y >= 660):
			self.right_paddle_y = 660
		elif (self.right_paddle_y <= 0):
			self.right_paddle_y = 0
		self.key = 'none'
		self.player = 'none'

	def check_game_over(self):
		if self.left_player_score >= 5:
			self.game_over = True
			self.winner = 1
		elif self.right_player_score >= 5:
			self.game_over = True
			self.winner = 2

	def reset(self):
		self.ball_position = {'x': 640, 'y': 360}
		self.ball_velocity = {'x': random.choice([-4, 4]), 'y': random.choice([-4, 4])}
		self.left_paddle_y = 360
		self.right_paddle_y = 360
		self.left_player_score = 0
		self.right_player_score = 0
		self.game_over = False
		self.winner = None

	def get_game_state(self):
		return {
			# 'ballX': self.ball_position['x'],
			# 'ballY': self.ball_position['y'],
			'left_paddle_y': self.left_paddle_y,
			'right_paddle_y': self.right_paddle_y,
			'ball_position': self.ball_position,
			'left_player_score': self.left_player_score,
			'right_player_score': self.right_player_score,
			'game_over': self.game_over,
			'winner': self.winner,
		}

	def update(self):
		self.move_paddle()
		self.move_ball()
		self.check_game_over()
		return self.get_game_state()