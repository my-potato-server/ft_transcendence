from .game import PongGameAsync

class MiniGameServer:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MiniGameServer, cls).__new__(cls)
            # 인스턴스 변수 초기화
            cls._instance.games = {}
        return cls._instance

    def __init__(self) -> None:
        # game = {players:user_id_list, gametype:"pong", instance = gameInstance }
        self.user_id2game_id = {}
        self.game_id2game = {}
        self.lastid = 0

        self.user_id2tornament_id = {}
        self.tornament_id_id2tornament = {}

        self.user_id2room_id = {}
        self.room_id2room = {}

        pass

    def get_new_id(self):
        self.lastid += 1
        return str(self.lastid)
    
    # def get_new_id(self):
    #     self.lastid += 1
    #     return str(self.lastid)
    
    #유저를 게임과 연결
    def connect_user2game(self, user_id, game_id):
        self.user_id2game_id[user_id] = game_id
        pass

    #유저를 게임과 연결 해제
    def disconnect_user2game(self, user_id):
        del self.user_id2game_id[user_id]
        pass

    def create_tornament(self, game_type, participants):
        pass
    
    def create_room(self):pass

    # def create_game(self, game_type, players, *args, **kwargs):
        
    #     # game = {players:user_id_list, gametype:game_type, instance = gameInstance }
    #     game = {}
    #     # 게임 인스턴스 생성 및 저장
    #     if game_type == "pong":
    #         self.games[game_id] = PongGameAsync(*args, **kwargs)
    #     else :
            
    #     # 다른 게임 타입에 대한 처리
    #     # ...
        
    #     game = {players:user_id_list, gametype:game_type, instance = gameInstance }

    #     game_id = self.get_new_id()
    #     self.game_id2game[game_id] = {}

    #     return game_id

    def control(self, user_id, cmd, **kwargs):

        # game = self.game_id2game[ self.user_id2game_id(user_id) ]
        
        # gameInstance = game["instance"]
        # playernum = game["player"].index(user_id) + 1
        
        try:
            game_id = self.user_id2game_id.get(user_id)
            game = self.game_id2game.get(game_id)

            gameInstance = game.get("instance")
            if "player" in game and user_id in game["player"]:
                playernum = game["player"].index(user_id) + 1
            else:
                # 적절한 오류 처리나 대체 로직
                print("Player ID not found in game players list.")
        except KeyError as e:
            # 키가 없을 경우의 오류 처리
            print(f"KeyError: {e}")
        except ValueError as e:
            # 리스트에서 값 찾기 실패
            print(f"ValueError: {e}")


        # 게임에 참여 : 클라이언트가 완전히 게임을 시작할 준비가 되었을때
        if cmd=="ready to play" : pass
        # 게임 일시 정지
        if cmd=="puase": pass
        # 게임 일시정지 해제
        if cmd=="resume": pass
        # 패들 움직임
        if cmd=="movepaddle" : pass
        # 게임 정보 요청
        if cmd=="gameinfo" :pass

    def get_game(self, game_id):
        # 게임 인스턴스 반환
        return self.games.get(game_id)

    def remove_game(self, game_id):
        # 게임 인스턴스 제거
        if game_id in self.games:
            del self.games[game_id]

# 사용 예시
if __name__ == "__main__":
    mini_game_server = MiniGameServer()
    mini_game_server.create_game("game123", "pong", player1="Alice", player2="Bob")
    game_instance = mini_game_server.get_game("game123")
