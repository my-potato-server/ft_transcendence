class ball():
    def __init__(self) -> None:
        self.position = tuple(float, float)
        self.velocity = tuple(float, float)
        self.reftime = float # 위치와 속도가 업데이트된 시간
        pass

    def updateStatue(self, position, velocity, time): pass
    def updateVelocity(self, velocity, time):
        self.position = self.getPosition(time)
        self.velocity = velocity
        self.reftime = time

    def getPosition(self, time) -> tuple(float, float):
        #return (time - self.reftime) * self.velocity + self.position  (이건 넘파이 수식)
        timediff = (time - self.reftime)
        return tuple(timediff * self.velocity[0] + self.position[0], timediff * self.velocity[1] + self.position[1])
        
    def getVelocity(self, time) -> tuple(float, float): pass


class player():
    def __init__(self) -> None:
        self.position = tuple(float, float)
        self.velocity = tuple(float, float)
        self.reftime = float # 위치와 속도가 업데이트된 시간
        pass

    def updateStatue(position, velocity, time): pass

    def getPosition(time) -> tuple(float, float): pass
    def getVelocity(time) -> tuple(float, float): pass



import time
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

        paddleline = []
        # 패들의 x위치 지정
        paddleline[1] = (0.06 - 1) #왼쪽의 플레이어
        paddleline[2] = - (0.06 - 1)#오른쪽의 플레이어
        paddleline[3] = (0.06 - 1) #왼쪽의 추가 플레이어
        paddleline[4] = - (0.06 - 1)#오른쪽의 추가 플레이어

        pass


        # 패들 위치 초기화
        paddle1 = (0.06 - 1, 1/2) #왼쪽의 플레이어
        paddle2 = (-(0.06 - 1), 1/2) #오른쪽의 플레이어


    def game()