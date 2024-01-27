import math
import time

def window(lowerbound, x, upperbound):
    return max(lowerbound, min(x, upperbound))

def normalize_vec2(tuple_vector):
    # 튜플의 요소 추출
    a, b = tuple_vector

    # 벡터의 크기 계산
    magnitude = math.sqrt(a**2 + b**2)

    # 정규화된 벡터 계산
    normalized_vector = (a / magnitude, b / magnitude)

    return normalized_vector

class obje():
    def __init__(self) -> None:
        self.position = tuple(float, float)
        self.velocity = tuple(float, float)
        self.reftime = float # 위치와 속도가 업데이트된 시간
        pass

    def updateStatue(self, position, velocity, time):
        self.position = position
        self.velocity = velocity
        self.reftime = time

    def updateVelocity(self, velocity, time):
        self.position = self.getPosition(time)
        self.velocity = velocity
        self.reftime = time

    def getPosition(self, time) -> tuple(float, float):
        #return (time - self.reftime) * self.velocity + self.position  (이건 넘파이 수식)
        timediff = (time - self.reftime)
        return tuple(timediff * self.velocity[0] + self.position[0], timediff * self.velocity[1] + self.position[1])
        
    def getVelocity(self, time) -> tuple(float, float): pass

class ball(obje):
    pass

class paddle(obje):
    def getPosition(self, time) -> tuple(float, float):
        #return (time - self.reftime) * self.velocity + self.position  (이건 넘파이 수식)
        timediff = (time - self.reftime)
        return tuple(self.position[0], window(0, timediff * self.velocity[1] + self.position[1], 1))




class timer():
    def __init__(self) -> None:
        self.start_time = None
        self.elapsed_time = 0
        pass
    
    def start(self):
        self.start_time = time.time()
    def now(self) -> float:
        if self.start_time is None: return self.elapsed_time
        else:                       return (self.elapsed_time + time.time - self.start_time)
    def pasue(self):
        self.elapsed_time += time.time() - self.start_time
        self.start_time = None
    def resume(self):
        self.start_time = time.time()
    def stop(self):
        self.start_time = None
        self.elapsed_time = 0




# 게임 서버에서 돌아가는 퐁 게임
class PongGame():
    def __init__(self, players, gameIdentifier, 게임규칙 = None) -> None:

        # 게임 상태
        #  0. 게임 초기화
        #  1. 게임 준비
        #  2. 게임 진행
        #  3. 게임 일시정지
        #  4. 게임 완료
        state = 1


        score = (0,0)

        paddleWidth = 0.02
        paddleHeight = 0.16
        
        paddleSpeed = 0.2
        ballSpeed = 0.3

        teamRedWall = -1
        teamBlueWall = 1




        paddleline = []
        # 패들의 x위치 지정
        paddleline[1] = (0.06 - 1) #왼쪽의 플레이어
        paddleline[2] = - (0.06 - 1)#오른쪽의 플레이어
        paddleline[3] = (0.4 - 1) #왼쪽의 추가 플레이어
        paddleline[4] = - (0.4 - 1)#오른쪽의 추가 플레이어

        pass


        # 패들 위치 초기화
        paddle1 = (0.06 - 1, 1/2) #왼쪽의 플레이어
        paddle2 = (-(0.06 - 1), 1/2) #오른쪽의 플레이어


    def mini_game():
        timer1 = timer()

        gamestat = 

    def mini_gameinput(playernum, direction):
        pass
        



    def gameinput(playerIdentifier, direction):
        #player는 플레이어 식별자.
        #directoin은 up down stop 중 하나
        pass
