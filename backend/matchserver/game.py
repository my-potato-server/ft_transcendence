import numpy as np

class PongGameAsync:
    def __init__(self):
        self.arena_bounds = np.array([1.0, 1.0])  # 경기장의 경계 (가로, 세로)
        self.ball_position = np.array([0.0, 0.0])  # 공의 초기 위치
        self.ball_velocity = np.array([0.03, 0.01])  # 공의 초기 속도
        self.paddle1_position = np.array([0.0, 0.8])  # 패들1의 초기 위치
        self.paddle2_position = np.array([0.0, -0.8])  # 패들2의 초기 위치
        self.paddle1_velocity = np.array([0.0, 0.0])  # 패들1의 초기 위치
        self.paddle2_velocity = np.array([0.0, 0.0])  # 패들2의 초기 위치
        self.paddle_size = np.array([0.2, 0.05])  # 패들의 크기 (가로, 세로)
        self.paddle_max_speed = 0.05  # 패들의 최대 속도
        self.score1 = 0  # 플레이어 1의 점수
        self.score2 = 0  # 플레이어 2의 점수
        self.game_over = False  # 게임 종료 상태

    def update_ball(self):
        # 공 위치 업데이트 (1초에 60번 업데이트를 가정하여 속도 조정)
        self.ball_position += self.ball_velocity / 60
        
        # 경계 조건 검사 및 공 반사
        if not (0 <= self.ball_position[1] <= self.arena_bounds[1]):
            self.ball_velocity[1] = -self.ball_velocity[1]

        # 공이 좌우 경계를 벗어났을 때 점수 처리 및 위치 초기화
        if self.ball_position[0] > self.arena_bounds[0]:
            self.score1 += 1
            self.reset_ball()
        elif self.ball_position[0] < -self.arena_bounds[0]:
            self.score2 += 1
            self.reset_ball()

    def update_paddle(self, paddle, direction):
        # 방향 벡터 정규화 및 최고속도에 곱하여 속도 계산 (1초에 60번 업데이트를 가정하여 속도 조정)
        direction = np.array(direction)
        if np.linalg.norm(direction) > 0:
            normalized_direction = direction / np.linalg.norm(direction)
            velocity = normalized_direction * self.paddle_max_speed / 60
        else:
            velocity = np.array([0.0, 0.0])

        if paddle == 1:
            new_position = self.paddle1_position + velocity
            self.paddle1_position = self.clip_position(new_position)
        elif paddle == 2:
            new_position = self.paddle2_position + velocity
            self.paddle2_position = self.clip_position(new_position)

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
            "game_over": self.game_over
        }
