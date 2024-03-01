import asyncio
from .game import PongGameAsync
from .tournament import Tournament
from asgiref.sync import async_to_sync

debug = True

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

        self.fast_match_pool = {"pong" : []}


    async def fast_match_matched(self, players, gametype):
        print("now on fast_match_matched")
        from .capis import send_message_to
        
        # 게임 만들기
        game_id = self.create_game(game_type=gametype, players=players)

        if game_id == "error" :
            # message = {'status': "error", 'message' : "매칭에 실패했습니다. 매칭을 다시 시도해 주세요." }
            message = {
                'method': "fast_match_matched",
                'status': "error",
                'identify': "server",
                'message' : "매칭에 실패했습니다. 매칭을 다시 시도해 주세요.",
                'data': None
            }

            for user_id in players:
                await send_message_to(user_id, message)
        
        else : 
            # message = {'status': "OK", 'message' : "매칭에 실패했습니다. 매칭을 다시 시도해 주세요." }
            message = {
                'method': "fast_match_matched",
                'status': "OK",
                'identify': "server",
                'message' : "매칭되었습니다. 곧 게임을 시작합니다.", #클라이언트는 게임 화면을 띄우고, capis에 command를 통해 game_start를 보내야 함
                'data': None
            }
            for user_id in players:
                await send_message_to(user_id, message)

        # 플레이어에게 알림 보내기
            # 게임이 만들어졌으면 OK
            # 게임 만들기에 실패하면 error


    async def fast_matching(self, gametype):
        print("now on fast_matching")
        while len(self.fast_match_pool[gametype]) >= 2:
            players = []
            players.append(self.fast_match_pool[gametype].pop(0))
            players.append(self.fast_match_pool[gametype].pop(0))
            await self.fast_match_matched(players, gametype)

    def add_fast_match(self, user_id, gametype="pong"):
        print("now on add_fast_match")
        #지금은 퐁 게임 뿐
        gametype = "pong"

        # 대기열에 추가
        self.fast_match_pool[gametype].append(user_id)

        # 유저가 추가될 떄 매칭로직 실행
        if len(self.fast_match_pool[gametype]) >= 2:
            # loop = asyncio.get_event_loop()
            # loop.create_task(self.fast_matching()) 
            # self.fast_matching()
            asyncio.create_task(self.fast_matching(gametype))

        return {'status': "OK", 'message' : "user added at fast match queue"}
        


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
        game_id = self.get_new_id()
        # 게임 인스턴스 생성 및 저장
        if game_type == "pong":
            game["instance"] = PongGameAsync(game_id=game_id, *args, **kwargs)
        else : return "error"
            
        # 다른 게임 타입에 대한 처리
        # ...
        
        self.game_id2game[game_id] = game

        for user_id in players:
            self.user_id2game_id[user_id] = game_id

        return game_id


    def remove_game(self, game_id, *args, **kwargs):
        
        if not game_id in self.game_id2game: return "error - that game-id not exist"

        players = self.game_id2game[game_id]["players"]
        inscance = self.game_id2game[game_id]["instance"]
        gametype = self.game_id2game[game_id]["gametype"]

        # 플레이어와 게임 사이의 연결 제거
        for user_id in players:
            del self.user_id2game_id[user_id]

        # 게임 결과 서버에 전송
        # await... 서버 api 호출

        del self.game_id2game[game_id]

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
        if cmd=="movepaddle_stop":
            gameInstance.update_paddle(playernum, [0, 0]) 

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
        tournament_id = self.user_id2tournament_id.get(user_id)
        # 사용자가 속한 게임 리턴
        game_id = self.user_id2game_id.get(user_id)
        # 실질적으로는 none이냐 아니냐가 중요할 것 같은데,
        # 게임 연결은 알아서 해 주니까 말이야.
        return tournament_id, game_id

    def get_game_info(self, user_id):
        # 사용자가 속한 게임 리턴
        game_id = self.user_id2game_id.get(user_id)

        if game_id is None: return None

        game = self.game_id2game.get(game_id)

        if game is None: return None

        if "player" in game and user_id in game["player"]:
            playerindex = game.get("player").index(user_id)

        return {
            "players": game.get("players"), 
            "playerindex": playerindex,
            "gametype": game.get("gametype"),
            "gamestate": game.get["instance"].get_game_state()
        }

    def get_tournament_info(self, user_id):
        # 사용자가 속한 토너먼트 리턴
        tournament_id = self.user_id2tournament_id.get(user_id)

        if tournament_id is None: return None

        tournament = self.tournament_id2tournament.get(tournament_id)

        if tournament is None: return None

        return async_to_sync(tournament.get_tournament_state)()

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
