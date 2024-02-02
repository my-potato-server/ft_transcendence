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

class Obje():
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

class Ball(Obje):
    pass

class Paddle(Obje):
    def getPosition(self, time) -> tuple(float, float):
        #return (time - self.reftime) * self.velocity + self.position  (이건 넘파이 수식)
        timediff = (time - self.reftime)
        return tuple(self.position[0], window(0, timediff * self.velocity[1] + self.position[1], 1))




class Timer():
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

    Timer

    def __init__(self, players, gameIdentifier, 게임규칙 = None) -> None:

        # # 게임 상태
        # #  0. 게임 초기화
        # #  1. 게임 준비
        # #  2. 게임 진행
        # #  3. 게임 일시정지
        # #  4. 게임 완료
        # state = 1


        # score = (0,0)

        # paddleWidth = 0.02
        # paddleHeight = 0.16
        
        # paddleSpeed = 0.2
        # ballSpeed = 0.3

        # teamRedWall = -1
        # teamBlueWall = 1


        # paddleline = []
        # # 패들의 x위치 지정
        # paddleline[1] = (0.06 - 1) #왼쪽의 플레이어
        # paddleline[2] = - (0.06 - 1)#오른쪽의 플레이어
        # paddleline[3] = (0.4 - 1) #왼쪽의 추가 플레이어
        # paddleline[4] = - (0.4 - 1)#오른쪽의 추가 플레이어

        # pass


        # # 패들 위치 초기화
        # paddle1 = (0.06 - 1, 1/2) #왼쪽의 플레이어
        # paddle2 = (-(0.06 - 1), 1/2) #오른쪽의 플레이어



        #게임
        # 타이머
        # 이벤트 히스토리
        # 상태
        # 충돌 이벤트 버퍼
        # 이벤트 큐
        # 결과

        # 타이머
        timer = Timer()

        # 이벤트 히스토리
        eventHistory = []

        # 상태
        state = dict()

        # 충돌 이벤트 버퍼
        collideEventBuffer = 0

        # 이벤트 큐
        eventQueue = 0

        # 결과
        result = 0





    def gameinput(playerIdentifier, direction):
        #player는 플레이어 식별자.
        #directoin은 up down stop 중 하나

        #  return 값은 게임의 상태
        # state 또는 result 를 주면 될 것 같은데
        pass


    def gamestart():
        # 타이머 초기화

        # 기물들을 초기 위치에 배치하기

        # 공에 속도 부여 이벤트 큐에 추가,

        # 게임 업데이트()
        pass
    
    def gameUpdate():
        # 1. 충돌 이벤트 버퍼에서 이벤트 확인

            # 1-1 만약 실행시간이 지났다면, 이벤트_수행(충돌 이벤트 버퍼)

        # 2. 이벤트 큐가 차 있다면, 꺼내어 이벤트_수행(이벤트)
        pass
    
    def event_run(event):
        # 이벤트 하나를 히스토리에 추가하고 상태를 업데이트

        # 1. 이벤트를 받는다.

        # 2. 이벤트를 기준으로 상태를 업데이트한다.

        # 3. 업데이트한 상태를 바탕으로 충돌 이벤트 버퍼를 업데이트한다

        # 4. 이벤트를 히스토리에 넣는다.
        pass

    def state_update():
        # 1. 이벤트 주체의 상태를 확인하고 위치를 계산.

        # 2. 새 (위치, 속도, 시간) 부여

        # 3. 게임 결과 업데이트

        # 4. 상태를 바탕으로 다음 충돌 계산

        # 5. 계산 결과를 이벤트로 만들어 충돌 이벤트 버퍼에 추가

        # 6. 리턴
        pass