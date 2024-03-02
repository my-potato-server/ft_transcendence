import asyncio
from asyncio import sleep
from asgiref.sync import async_to_sync, sync_to_async
from channels.db import database_sync_to_async

from .game import PongGameAsync
from .tournament import Tournament

from account.models import User


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
        self.fast_match_pool = {"pong" : [], "tournament" : []}


    async def fast_match_matched(self, players, gametype, tournament_id=None, level=2):
        print("now on fast_match_matched")
        from .capis import send_message_to

        game_id = self.create_game(gametype, players, tournament_id, level)
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
        return game_id


    async def fast_matching(self, gametype):
        print("now on fast_matching")
        while len(self.fast_match_pool[gametype]) >= 2:
            players = []
            players.append(self.fast_match_pool[gametype].pop(0))
            players.append(self.fast_match_pool[gametype].pop(0))
            await self.fast_match_matched(players, gametype)

    def add_fast_match(self, user_id, gametype):
        print("now on add_fast_match")
        if user_id not in self.fast_match_pool[gametype]:
            self.fast_match_pool[gametype].append(user_id)
        if len(self.fast_match_pool[gametype]) >= 2:
            asyncio.create_task(self.fast_matching(gametype))
        return {'status': "OK", 'message' : "user added at fast match queue"}

    def remove_fast_match(self, user_id, gametype):
    # print("now on add_fast_match")
        print("remove fast match")
        try : self.fast_match_pool[gametype].remove(user_id)
        except : print("fail to remove")



    @database_sync_to_async
    def get_nickname_by_user_id_list(self, user_id_list):
        return [User.objects.get(id=user_id).nickname for user_id in user_id_list]


    async def tournament_matching(self, gametype):
        from .capis import send_message_to
        from game.utils import create_tournament_id

        print("now on tournament_matching")
        players_first_team = []
        players_second_team = []
        while len(self.fast_match_pool[gametype]) >= 4:
            players_first_team.append(self.fast_match_pool[gametype].pop(0))
            players_first_team.append(self.fast_match_pool[gametype].pop(0))
            players_second_team.append(self.fast_match_pool[gametype].pop(0))
            players_second_team.append(self.fast_match_pool[gametype].pop(0))
            self.tournament_matching_launch = False
        first_team_nickname = await self.get_nickname_by_user_id_list(players_first_team)
        second_team_nickname = await self.get_nickname_by_user_id_list(players_second_team)
        message = {
            'method': "tournament_matched",
            'status': "OK",
            'message' : "토너먼트 매칭이 완료되었습니다.",
            'data': {"first_team": first_team_nickname, "second_team": second_team_nickname}
        }
        for player in players_first_team + players_second_team:
            await send_message_to(player, message)
        await sleep(5)
        level = 4
        tournament_id = await database_sync_to_async(create_tournament_id)()
        first_game_id = await self.fast_match_matched(players_first_team, gametype, tournament_id, level)
        second_game_id = await self.fast_match_matched(players_second_team, gametype, tournament_id, level)
        first_game = self.game_id2game[first_game_id]
        second_game = self.game_id2game[second_game_id]
        first_game_winner = None
        second_game_winner = None
        is_clear_first_game = False
        is_clear_second_game = False
        while not is_clear_first_game or not is_clear_second_game:
            if first_game["is_over"] and not is_clear_first_game:
                first_game_winner = first_game["winner_id"]
                self.remove_game(first_game_id)
                is_clear_first_game = True
                await send_message_to(
                    first_game_winner,
                    {
                        'method': "tournament_first_win",
                        'status': "OK",
                        'message': "첫번째 토너먼트에서 승리하였습니다.",
                        'data': None
                    }
                )
            if second_game["is_over"] and not is_clear_second_game:
                second_game_winner = second_game["winner_id"]
                self.remove_game(second_game_id)
                is_clear_second_game = True
                await send_message_to(
                    second_game_winner,
                    {
                        'method': "tournament_first_win",
                        'status': "OK",
                        'message': "첫번째 토너먼트에서 승리하였습니다.",
                        'data': None
                    }
                )
            await sleep(0.1)
        players = [first_game_winner, second_game_winner]
        players_nickname = await self.get_nickname_by_user_id_list(players)
        for player in players:
            await send_message_to(
                player,
                {
                    'method': "tournament_final_matched",
                    'status': "OK",
                    'message' : "토너먼트 결승 매칭이 완료되었습니다.",
                    'data': {"players": players_nickname}
                }
            )
        await sleep(5)
        level = 2
        await self.fast_match_matched(players, gametype, tournament_id, level)


    def add_tournament_match(self, user_id, gametype):
        print("now on add_tournament_match")
        self.fast_match_pool[gametype].append(user_id)
        if len(self.fast_match_pool[gametype]) >= 4:
            asyncio.create_task(self.tournament_matching(gametype))
        return {'status': "OK", 'message' : "user added at tournament match queue"}

    def get_new_id(self):
        self.lastid += 1
        return str(self.lastid)


    def create_room(self):
        pass

    def create_game(self, game_type, players, tournament_id=None, level=2):
        game = {"players": players, "gametype": game_type, "is_over": False,
                "winner_id": None, "instance": None}
        game_id = self.get_new_id()
        if game_type == "pong":
            game["instance"] = PongGameAsync(
                game_id=game_id, is_tournament=False, tournament_id=tournament_id, level=2
            )
        elif game_type == "tournament":
            game["instance"] = PongGameAsync(
                game_id=game_id, is_tournament=True, tournament_id=tournament_id, level=level
            )
        else:
            return "error"

        self.game_id2game[game_id] = game
        for user_id in players:
            self.user_id2game_id[user_id] = game_id
        return game_id


    def remove_game(self, game_id):
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


    def result_tournament_game(self, game_id, winner_id):
        self.game_id2game[game_id]["is_over"] = True
        self.game_id2game[game_id]["winner_id"] = winner_id


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
            gameInstance.update_paddle(playernum, -16)
            return {'status': 'OK', 'message': 'paddle moved'}
        if cmd=="movepaddle_down":
            gameInstance.update_paddle(playernum, 16)
            return {'status': 'OK', 'message': 'paddle moved'}
        if cmd=="pause":
            gameInstance.pause_game()
            return {'status': 'OK', 'message': 'game paused'}

        # 게임 정보 요청
        if cmd=="gameinfo": pass

    def get_game(self, game_id):
        # 게임 인스턴스 반환
        return self.games.get(game_id)

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
        if game_id is None:
            return None
        game = self.game_id2game.get(game_id)
        if game is None:
            return None

        if "players" in game and user_id in game["players"]:
            playerindex = game.get("players").index(user_id)

        return {
            "players": game.get("players"), 
            "playerindex": playerindex,
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
