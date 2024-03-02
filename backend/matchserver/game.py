import random
import asyncio
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async

from account.models import User
from game.models import Tournament, MatchHistory, UserMatchRecord


class PongGameAsync:
    def __init__(self, game_id, is_tournament=False, tournament_id=None, level=2):
        self.ball_position = {'x': 640, 'y': 360}
        self.ball_velocity = {'x': random.choice([-3, 3]), 'y': random.choice([-4, 4])}
        self.left_paddle_y = 360
        self.right_paddle_y = 360
        self.left_player_score = 0  # 플레이어 1의 점수
        self.right_player_score = 0  # 플레이어 2의 점수
        self.winner = None  # 승자

        self.is_tournament = is_tournament
        self.tournament_id = tournament_id
        self.level = level

        self.left_user_id = None
        self.right_user_id = None

        self.game_start = False # 게임 시작 상태
        self.game_over = False  # 게임 종료 상태
        self.game_pause = False  # 게임 일시정지 상태
        self.ready = [False, False]
        self.fps = 60
        self.game_id = game_id
        self.start_game()


    def ready_play(self, playerindex, user_id):
        if playerindex == 1:
            self.left_user_id = user_id
        if playerindex == 2:
            self.right_user_id = user_id

        player = playerindex - 1
        print("ready play", player)
        if player < 0 or 1 < player:
            return "player index out of range error"
        else :
            self.ready[player] = True
            print("ready play true", player)
        if all(self.ready) == True:
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
            self.ball_velocity['y'] = -self.ball_velocity['y'] + random.random() * 1.5
            self.ball_velocity['x'] *= 1.25
        # 아래쪽 벽에 부딪히면
        elif self.ball_position['y'] >= 720:
            self.ball_velocity['y'] = -self.ball_velocity['y'] - random.random() * 1.5
            self.ball_velocity['x'] *= 1.25
        # 왼쪽 패들에 부딪히면
        elif self.ball_position['x'] <= 20 and self.left_paddle_y - 40 <= self.ball_position[
            'y'] <= self.left_paddle_y + 40:
            self.ball_velocity['x'] = -self.ball_velocity['x'] + random.random() * 1.5
            self.ball_velocity['x'] *= 1.25
        # 오른쪽 패들에 부딪히면
        elif self.ball_position['x'] >= 1260 and self.right_paddle_y - 40 <= self.ball_position[
            'y'] <= self.right_paddle_y + 40:
            self.ball_velocity['x'] = -self.ball_velocity['x'] - random.random() * 1.5
            self.ball_velocity['x'] *= 1.25

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

    def pause_game(self):
        self.game_pause = True if self.game_pause == False else False

    def reset_ball(self):
        self.ball_position = {'x': 640, 'y': 360}
        self.ball_velocity = {'x': random.choice([-3, 3]), 'y': random.choice([-4, 4])}

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
            "left_user_id": self.left_user_id,
            "right_user_id": self.right_user_id,
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
            if self.game_pause:
                await MiniGameServer().broadcast_realtime_gamestate2user(self.game_id)
                await asyncio.sleep(1/self.fps)
                continue
            self.move_ball()
            self.check_game_over()
            await MiniGameServer().broadcast_realtime_gamestate2user(self.game_id)
            await asyncio.sleep(1/self.fps)  # 초당 60회 업데이트, 일시정지 상태에서도 체크

        # 결과 저장
        await self.save_result()
        if self.is_tournament and self.level != 2:
            MiniGameServer().result_tournament_game(
                game_id=self.game_id,
                winner_id=self.left_user_id if self.winner == 1 else self.right_user_id,
            )
        else:
            MiniGameServer().remove_game(self.game_id)  # 게임 종료 후 게임 삭제
        
    def start_game(self):
        loop = asyncio.get_event_loop()
        loop.create_task(self.game_loop())  # game_loop를 비동기 태스크로 실행
        # 여기에서 start_game 메서드는 game_loop의 완료를 기다리지 않고 바로 리턴함


    @database_sync_to_async
    def save_result(self):
        tournament_id = Tournament.objects.create().id
        tournament_id = self.tournament_id if self.tournament_id is not None else tournament_id

        win_user_id = self.left_user_id if self.winner == 1 else self.right_user_id
        lose_user_id = self.right_user_id if self.winner == 1 else self.left_user_id
        winner_score = self.left_player_score if self.winner == 1 else self.right_player_score
        loser_score = self.right_player_score if self.winner == 1 else self.left_player_score

        tournament = Tournament.objects.get(id=tournament_id)
        win_user = User.objects.filter(id=win_user_id).first()
        lose_user = User.objects.filter(id=lose_user_id).first() if lose_user_id is not None else None

        tournament.users.add(win_user)
        win_user_record, _ = UserMatchRecord.objects.get_or_create(user=win_user)
        win_user_record.win_count += 1
        win_user_record.save()
        if lose_user:
            tournament.users.add(lose_user)
            lose_user_record, _ = UserMatchRecord.objects.get_or_create(user=lose_user)
            lose_user_record.lose_count += 1
            lose_user_record.save()

        match_history = MatchHistory.objects.create(
            tournament=tournament,
            level=self.level,
            win_user=win_user,
            winner_score=winner_score,
            lose_user=lose_user,
            loser_score=loser_score,
            is_walkover=False,
        )
        return match_history
