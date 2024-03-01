import numpy as np
import asyncio


class PongGameAsync:
    def __init__(self, game_id):
        self.arena_bounds = np.array([1.0, 0.5])  # 경기장의 경계 (가로, 세로)
        self.ball_position = np.array([0.0, 0.0])  # 공의 초기 위치
        self.ball_velocity = np.array([0.03, 0.01])  # 공의 초기 속도
        self.ball_maxspeed = 0.2
        self.paddle1_position = np.array([-0.8 * self.arena_bounds[0], 0.0])  # 패들1의 초기 위치
        self.paddle2_position = np.array([0.8 * self.arena_bounds[0], 0.0])  # 패들2의 초기 위치
        self.paddle1_velocity = np.array([0.0, 0.0])  # 패들1의 초기 속도
        self.paddle2_velocity = np.array([0.0, 0.0])  # 패들2의 초기 속도
        self.paddle_size = np.array([0.05, 0.2])  # 패들의 크기 (가로, 세로)
        self.paddle_max_speed = 0.05  # 패들의 최대 속도
        self.score1 = 0  # 플레이어 1의 점수
        self.score2 = 0  # 플레이어 2의 점수
        self.game_start = False # 게임 시작 상태
        self.game_over = False  # 게임 종료 상태
        self.is_paused = False  # 게임이 일시정지 상태인지 나타내는 플래그
        self.ready = [False, False]
        self.fps = 60
        self.game_id = game_id
        self.start_game()

    def ready_play(self, playerindex):
        if playerindex < 0 or 1 < playerindex :
            return "player index out of range error"
        else :
            self.ready[playerindex] = True

        if all(self.ready) == True : self.game_start = True

        pass

    def update_ball(self):
        # 공 위치 업데이트 (1초에 60번 업데이트를 가정하여 속도 조정)
        self.ball_position += self.ball_velocity / self.fps
        
        # 경계 조건 검사 및 공 반사
        if not (0 <= self.ball_position[1] <= self.arena_bounds[1]):
            self.ball_velocity[1] = -self.ball_velocity[1]

        # 공이 좌우 경계를 벗어났을 때 점수 처리 및 위치 초기화
        if self.ball_position[0] < -self.arena_bounds[0]:
            self.score1 += 1
            self.reset_ball()
        elif self.ball_position[0] > self.arena_bounds[0]:
            self.score2 += 1
            self.reset_ball()

        # 패들 1 위치이동
        new_position = self.paddle1_position + self.paddle1_velocity / self.fps
        self.paddle1_position = self.clip_position(new_position)

        # 패들 2 위치이동
        new_position = self.paddle2_position + self.paddle2_velocity / self.fps
        self.paddle2_position = self.clip_position(new_position)

        #공이 패들에 부딧혔을떄, 패들의 중심점부터 공의 위치까지의 벡터를 노멀 벡터로 사용해서 공을 반사.
        # 패들1 충돌 검사
        if self.ball_position - self.paddle1_position < self.paddle_size:
            
            # 입사 벡터 I와 정규화된 법선 벡터 N 정의
            I = self.ball_velocity # 입사 벡터
            N = self.ball_position - self.paddle1_position  # 법선 벡터 (패들중심->공 벡터)

            I = I/np.linalg.norm(I) #정규화
            N = N/np.linalg.norm(N) #정규화

            # 반사 벡터 R 계산
            R = I - 2 * np.dot(I, N) * N
            
            R = R/np.linalg.norm(R) #정규화
            
            self.ball_velocity = R * self.ball_maxspeed
            
        # 패들2 충돌 검사
        if self.ball_position - self.paddle2_position < self.paddle_size:
            
            # 입사 벡터 I와 정규화된 법선 벡터 N 정의
            I = self.ball_velocity # 입사 벡터
            N = self.ball_position - self.paddle2_position  # 법선 벡터 (패들중심->공 벡터)

            I = I/np.linalg.norm(I) #정규화
            N = N/np.linalg.norm(N) #정규화

            # 반사 벡터 R 계산
            R = I - 2 * np.dot(I, N) * N
            
            R = R/np.linalg.norm(R) #정규화
            
            self.ball_velocity = R * self.ball_maxspeed



    def update_paddle(self, paddle, direction):
        # 방향 벡터 정규화 및 최고속도에 곱하여 속도 계산 (1초에 60번 업데이트를 가정하여 속도 조정)
        direction = np.array(direction)
        if np.linalg.norm(direction) > 0:
            normalized_direction = direction / np.linalg.norm(direction)
            velocity = normalized_direction * self.paddle_max_speed / self.fps
        else:
            velocity = np.array([0.0, 0.0])

        if paddle == 1: self.paddle1_velocity = velocity
        if paddle == 2: self.paddle2_velocity = velocity


    def clip_position(self, position):
        clipped_position = np.clip(position, -self.arena_bounds + self.paddle_size / 2, self.arena_bounds - self.paddle_size / 2)
        return clipped_position

    def reset_ball(self):
        self.ball_position = np.array([0.0, 0.0])
        self.ball_velocity = np.array([-self.ball_velocity[0], self.ball_velocity[1]])

    def get_game_state(self):
        return {
            "ball_position": self.ball_position.tolist(),
            "paddle1_position": self.paddle1_position.tolist(),
            "paddle2_position": self.paddle2_position.tolist(),
            "score1": self.score1,
            "score2": self.score2,
            "game_over": self.game_over,
            "game_pause": self.is_paused,
            "gmae_start": self.game_start
        }
    
    def get_game_state(self):
        return {
            "ball_position": self.ball_position.tolist(),
            "paddle1_position": self.paddle1_position.tolist(),
            "paddle2_position": self.paddle2_position.tolist(),
            "score1": self.score1,
            "score2": self.score2,
            "game_over": self.game_over,
            "game_pause": self.is_paused,
        }

    async def game_loop(self):
        from .minigameserver import MiniGameServer
        while not self.game_start:
            await asyncio.sleep(1/2) # 게임이 시작되기를 기다림
        await asyncio.sleep(1) # 약간의 딜레이
        while not self.game_over:
            if not self.is_paused:  # 게임이 일시정지 상태가 아닐 때만 업데이트
                await self.update_ball()
            await asyncio.sleep(1/self.fps)  # 초당 60회 업데이트, 일시정지 상태에서도 체크
        MiniGameServer().remove_game()

    def pause_game(self):
        self.is_paused = True

    def resume_game(self):
        self.is_paused = False
        
    def start_game(self):
        loop = asyncio.get_event_loop()
        loop.create_task(self.game_loop())  # game_loop를 비동기 태스크로 실행
        # 여기에서 start_game 메서드는 game_loop의 완료를 기다리지 않고 바로 리턴함

# 테스트용 게임루프
async def game_loop(game):
    screen = turtle.Screen()
    screen.title("Async Pong")
    screen.bgcolor("black")
    screen.setup(width=600, height=300)
    
    # 키 입력 처리를 위한 함수
    def paddle1_up():
        game.update_paddle(1, [0, 1])
        
    def paddle1_down():
        game.update_paddle(1, [0, -1])
        
    screen.listen()
    screen.onkeypress(paddle1_up, "w")
    screen.onkeypress(paddle1_down, "s")
    
    while not game.game_over:
        game.update_ball()
        # 게임 상태 업데이트 및 그리기 로직...
        
        await asyncio.sleep(1/60)  # 60Hz로 업데이트

async def main():
    game = PongGameAsync()
    await game_loop(game)

if __name__ == "__main__":
    import turtle
    import asyncio
    import numpy as np

    main()