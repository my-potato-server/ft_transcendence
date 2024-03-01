from .game import PongGameAsync
from .tournament import Tournament

class MiniGameServer:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.initialize()
        return cls._instance

 
    # game = {players:user_id_list, gametype:"pong", instance = gameInstance }
    def initialize(self):
        self.user_id2game_id = {}
        self.game_id2game = {}
        self.lastid = 0

        self.user_id2tournament_id = {}  # 오타 수정
        self.tournament_id2tournament = {}  # 오타 수정

        self.user_id2room_id = {}
        self.room_id2room = {}


    def get_new_id(self):
        self.lastid += 1
        return str(self.lastid)
    
    # def get_new_id(self):
    #     self.lastid += 1
    #     return str(self.lastid)
    
    # #유저를 게임과 연결
    # def connect_user2game(self, user_id, game_id):
    #     self.user_id2game_id[user_id] = game_id
    #     pass

    # #유저를 게임과 연결 해제
    # def disconnect_user2game(self, user_id):
    #     del self.user_id2game_id[user_id]
    #     pass

    def create_tornament(self, game_type, participants):
        pass
    
    def create_room(self):pass

    def create_game(self, game_type, players, *args, **kwargs):
        # game = {players:user_id_list, gametype:game_type, instance = gameInstance }
        game = {"players": players, "gametype": game_type}
        # 게임 인스턴스 생성 및 저장
        if game_type == "pong":
            game["inscance"] = PongGameAsync(*args, **kwargs)
        else : return "error"
            
        # 다른 게임 타입에 대한 처리
        # ...
        
        game_id = self.get_new_id()
        self.game_id2game[game_id] = game

        for user_id in players:
            self.user_id2game_id[user_id] = game_id

        return game_id


    def remove_game(self, game_id, *args, **kwargs):
        
        if not game_id in self.game_id2game: return "error - that game-id not exist"

        players = game_id2game[game_id]["players"]
        inscance = game_id2game[game_id]["instance"]
        gametype = game_id2game[game_id]["gametype"]

        # 플레이어와 게임 사이의 연결 제거
        for user_id in players:
            del user_id2game_id[user_id]

        # 게임 결과 서버에 전송
        # await... 서버 api 호출

        del game_id2game[game_id]

        return game_id


    def control(self, user_id, cmd, **kwargs):

        # game = self.game_id2game[ self.user_id2game_id(user_id) ]
        
        # gameInstance = game["instance"]
        # playernum = game["player"].index(user_id) + 1
        
        try:
            game_id = self.user_id2game_id.get(user_id)
            game = self.game_id2game.get(game_id)

            gameInstance = game.get("instance")
            if "player" in game and user_id in game["player"]:
                playernum = game.get("player").index(user_id) + 1
            else:
                # 적절한 오류 처리나 대체 로직
                print("Player ID not found in game players list.")
        except KeyError as e:
            # 키가 없을 경우의 오류 처리
            print(f"Wrong game_id, - KeyError: {e}")
        except ValueError as e:
            # 리스트에서 값 찾기 실패
            print(f"User not in game, ValueError: {e}")


        # 게임에 참여 : 클라이언트가 완전히 게임을 시작할 준비가 되었을때
        if cmd=="ready to play" :
            gameInstance.ready_play(playernum)
        # 게임 일시 정지
        if cmd=="puase":
            # gameInstance.pause_game(game["players"].index(user_id) + 1)
            pass
        # 게임 일시정지 해제
        if cmd=="resume": 
            # gameInstance.resume_game(game["players"].index(user_id) + 1)
            pass

        # 패들 움직임
        if cmd=="movepaddle_up":
            gameInstance.update_paddle(playernum, [0, 1]) 
        if cmd=="movepaddle_down":
            gameInstance.update_paddle(playernum, [0, -1]) 

        # 게임 정보 요청
        if cmd=="gameinfo" :pass

    def get_game(self, game_id):
        # 게임 인스턴스 반환
        return self.games.get(game_id)

    # def remove_game(self, game_id):
    #     # 게임 인스턴스 제거
    #     if game_id in self.games:
    #         del self.games[game_id]

    def get_user_status(self, user_id):
        # 사용자가 속한 토너먼트
        tournament_id = user_id2tournament_id.get(user_id)
        # 사용자가 속한 게임 리턴
        game_id = user_id2game_id.get(user_id)
        # 실질적으로는 none이냐 아니냐가 중요할 것 같은데,
        # 게임 연결은 알아서 해 주니까 말이야.
        return tournament, game

    def get_game_info(self, user_id):
        # 사용자가 속한 게임 리턴
        game_id = user_id2game_id.get(user_id)

        if game_id is None: return None

        game = game_id2game.get(game_id)

        if game is None: return None

        return 
        {
            "players": game.get("players"), 
            "gametype": game.get("gametype"),
            "gamestate": game.get["instance"].get_game_state()
        }

    def get_tournament_info(self, user_id):
        # 사용자가 속한 토너먼트 리턴
        tournament_id = user_id2tournament_id.get(user_id)

        if tournament_id is None: return None

        tournament = tournament_id2tournament.get(tournament_id)

        if tournament is None: return None

        return async_to_sync(tournament.get_tournament_state())

        return 
        {
            #대진표
            

            "players": game.get("players"), 
            "gametype": game.get("gametype"),
            "gamestate": game.get["instance"].get_game_state()
        }


# 사용 예시
if __name__ == "__main__":
    mini_game_server = MiniGameServer()
    mini_game_server.create_game("game123", "pong", player1="Alice", player2="Bob")
    game_instance = mini_game_server.get_game("game123")
