import numpy as np
import random
import asyncio


class PongGameAsync:
    def __init__(self, game_id, result_callback = None, callback_indetify = None):
        self.ball_position = {'x': 640, 'y': 360}
        self.ball_velocity = {'x': random.choice([-3, 3]), 'y': random.choice([-4, 4])}
        self.left_paddle_y = 360
        self.right_paddle_y = 360
        self.left_player_score = 0  # 플레이어 1의 점수
        self.right_player_score = 0  # 플레이어 2의 점수
        self.winner = None  # 승자

        self.game_start = False # 게임 시작 상태
        self.game_over = False  # 게임 종료 상태
        self.ready = [False, False]
        self.fps = 60
        self.game_id = game_id
        self.result_callback = result_callback
        self.callback_indetify = callback_indetify
        self.start_game()


    def ready_play(self, playerindex):
        player = playerindex - 1
        print("ready play", player)
        if player < 0 or 1 < player :
            return "player index out of range error"
        else :
            self.ready[player] = True
            print("ready play true", player)
        if all(self.ready) == True :
            self.game_start = True
            print("game start")
        pass


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
        elif self.ball_position['x'] <= 20 and self.left_paddle_y - 40 <= self.ball_position[
            'y'] <= self.left_paddle_y + 40:
            self.ball_velocity['x'] = -self.ball_velocity['x']
            self.ball_velocity['x'] *= 1.05
        # 오른쪽 패들에 부딪히면
        elif self.ball_position['x'] >= 1260 and self.right_paddle_y - 40 <= self.ball_position[
            'y'] <= self.right_paddle_y + 40:
            self.ball_velocity['x'] = -self.ball_velocity['x']
            self.ball_velocity['x'] *= 1.05

    def update_paddle(self, playernum, direction):
        if playernum == 1:
            self.left_paddle_y += direction
        if playernum == 2:
            self.right_paddle_y += direction
        if self.left_paddle_y >= 660:
            self.left_paddle_y = 660
        elif self.left_paddle_y <= 0:
            self.left_paddle_y = 0
        if self.right_paddle_y >= 660:
            self.right_paddle_y = 660
        elif self.right_paddle_y <= 0:
            self.right_paddle_y = 0

    def reset_ball(self):
        self.ball_position = {'x': 640, 'y': 360}
        self.ball_velocity = {'x': random.choice([-3, 3]), 'y': random.choice([-1, 1])}

    def get_game_state(self):
        return {
            'left_paddle_y': self.left_paddle_y,
			'right_paddle_y': self.right_paddle_y,
			'ball_position': self.ball_position,
			'left_player_score': self.left_player_score,
			'right_player_score': self.right_player_score,
            "game_over": self.game_over,
            "game_start": self.game_start,
            'winner': self.winner,
        }
    
    def get_realtime_state(self):
        return {
            'left_paddle_y': self.left_paddle_y,
			'right_paddle_y': self.right_paddle_y,
			'ball_position': self.ball_position,
			'left_player_score': self.left_player_score,
			'right_player_score': self.right_player_score,
            "game_over": self.game_over,
            "game_start": self.game_start,
            'winner': self.winner,
        }

    def check_game_over(self):
        if self.left_player_score >= 5:
            self.game_over = True
            self.winner = 1
        elif self.right_player_score >= 5:
            self.game_over = True
            self.winner = 2

    async def game_loop(self):
        from .minigameserver import MiniGameServer
        while not self.game_start:
            await asyncio.sleep(1/2) # 게임이 시작되기를 기다림
        await asyncio.sleep(1) # 약간의 딜레이
        while not self.game_over:
            self.move_ball()
            await MiniGameServer().broadcast_realtime_gamestate2user(self.game_id)
            await asyncio.sleep(1/self.fps)  # 초당 60회 업데이트, 일시정지 상태에서도 체크
        # 결과 저장
        # self.result_callback(call_return=self.get_game_state(), call_indetify=self.callback_indetify)
        MiniGameServer().remove_game(self.game_id)  # 게임 종료 후 게임 삭제
        
    def start_game(self):
        loop = asyncio.get_event_loop()
        loop.create_task(self.game_loop())  # game_loop를 비동기 태스크로 실행
        # 여기에서 start_game 메서드는 game_loop의 완료를 기다리지 않고 바로 리턴함
