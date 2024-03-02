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
        
        tournament = {"participants": participants, "gametype": game_type}
        tournament["instance"] = Tournament(participants=participants)
        tournament_id = self.get_new_id()
        for user_id in participants:
            self.user_id2tournament_id[user_id] = tournament_id
        
        self.tournament_id2tournament[tournament_id] = tournament

        return tournament_id
        pass

    def tournament_loop(self, tournament_id=None, call_indentify = None, call_return = None):
        if not (call_indentify == None and call_return == None): # 진행중인 토너먼트에서 불린 경우 
            tournament_id = call_indentify["tournament_id"]

        if tournament_id == None : return "error"     
        
        #토너먼트 ID 확보 완료

        tournament = self.tournament_id2tournament.get(tournament_id)        
        if tournament == None : return "error"

        # 토너먼트 딕셔너리 확보 완료

        participants = tournament.get("players")
        game_type = tournament.get("gametype")
        instance = tournament.get("instance")

        if not (participants and game_type and instance): return "error"


        # 여기서 승자 판별을 하자
            # 만약에 call_indentify 에서 들어온 경우에는 승자를 판별해야 하고
            # 만약에 tournament id가 직접 들어온 경우에는 그냥 시작 해주면 될 것 같은데

        next_match = tournament.next_match()
        if len(tournament.next_match()) == 1 : 
            # 승자가 정해진 경우이다, 마무리 해야함
            # 결과 서버에 
            # 
            pass

        else : # 승자를 입력하고 다음 게임을 진행해야 하는 경우

            pass

        callback_identify = {
            "tournament_id" : tournament_id,
            }

        tournament = self.tournament_id2tournament.get(tournament_id)
        return 


        # while True:
        #     next_match = tournament.next_match()
        #     if len(tournament.next_match()) == 1 :
        #         # 승자가 정해진 경우이다, 마무리 해야함
        #         pass            
        #     await asyncio.sleep(2)


    def remove_tournament(self, tournament_id):
        if not tournament_id in self.tournament_id2tournament: return "error - that tournament_id not exist"

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


    def create_room(self):
        pass

    def create_game(self, game_type, players, result_callback = None, *args, **kwargs):
        # game = {players:user_id_list, gametype:game_type, instance = gameInstance }
        game = {"players": players, "gametype": game_type}
        game_id = self.get_new_id()
        # 게임 인스턴스 생성 및 저장
        if game_type == "pong":
            game["instance"] = PongGameAsync(game_id=game_id, result_callback=result_callback, *args, **kwargs)
        else:
            return "error"

        self.game_id2game[game_id] = game
        for user_id in players:
            self.user_id2game_id[user_id] = game_id
        return game_id


    def remove_game(self, game_id, winner: int):
        if not game_id in self.game_id2game:
            return "error - that game-id not exist"
        players = self.game_id2game[game_id]["players"]
        inscance = self.game_id2game[game_id]["instance"]
        gametype = self.game_id2game[game_id]["gametype"]

        # 플레이어와 게임 사이의 연결 제거
        for user_id in players:
            del self.user_id2game_id[user_id]
        del self.game_id2game[game_id]
        return game_id


    def control(self, user_id, cmd, **kwargs):
        try:
            game_id = self.user_id2game_id.get(user_id)
            game = self.game_id2game.get(game_id)

            gameInstance = game.get("instance")
            if "players" in game and user_id in game["players"]:
                playernum = game.get("players").index(user_id) + 1
            else:
                return {'status': 'Error', 'message': 'Player ID not found in game players list.'}
        except KeyError as e:
            # 키가 없을 경우의 오류 처리
            print(f"Wrong game_id, - KeyError: {e}")
            return {'status': 'Error', 'message': f"Wrong game_id, - KeyError: {e}"}
        except ValueError as e:
            # 리스트에서 값 찾기 실패
            print(f"User not in game, ValueError: {e}")
            return {'status': 'Error', 'message': f"User not in game, ValueError: {e}"}

        # 게임에 참여 : 클라이언트가 완전히 게임을 시작할 준비가 되었을때
        if cmd=="ready to play" :
            gameInstance.ready_play(playernum, user_id)

        # 패들 움직임
        if cmd=="movepaddle_up":
            gameInstance.update_paddle(playernum, -8)
            return {'status': 'OK', 'message': 'paddle moved'}
        if cmd=="movepaddle_down":
            gameInstance.update_paddle(playernum, 8)
            return {'status': 'OK', 'message': 'paddle moved'}

        # 게임 정보 요청
        if cmd=="gameinfo": pass

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

        if "players" in game and user_id in game["players"]:
            playerindex = game.get("players").index(user_id)

        return {
            "players": game.get("players"), 
            "playerindex": playerindex,
            "gametype": game.get("gametype"),
            "gamestate": game.get("instance").get_game_state()
        }

    def get_tournament_info(self, user_id):
        # 사용자가 속한 토너먼트 리턴
        tournament_id = self.user_id2tournament_id.get(user_id)

        if tournament_id is None: return None

        tournament = self.tournament_id2tournament.get(tournament_id)

        if tournament is None: return None

        return async_to_sync(tournament.get_tournament_state)()

        return {
            "players": game.get("players"),
            "gametype": game.get("gametype"),
            "gamestate": game.get("instance").get_game_state()
        }


    async def broadcast_realtime_gamestate2user(self, game_id):
        # 사용자가 속한 게임 리턴
        # game_id = self.user_id2game_id.get(user_id)
        from .capis import send_message_to

        if game_id is None:
            return None
        game = self.game_id2game.get(game_id)
        if game is None:
            return None

        message = {
            'method': "server.game",
            'status': "OK",
            'data': {
                "gametype": game.get("gametype"),
                "realtime_gamestate": game.get("instance").get_game_state()
            }
        }
        players = game.get("players")

        for user_id in players:
            await send_message_to(user_id, message)
        return 

# 사용 예시
if __name__ == "__main__":
    mini_game_server = MiniGameServer()
    mini_game_server.create_game("game123", "pong", player1="Alice", player2="Bob")
    game_instance = mini_game_server.get_game("game123")
