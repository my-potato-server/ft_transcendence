class MiniGameServer:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(MiniGameServer, cls).__new__(cls)
            # 인스턴스 변수 초기화
            cls._instance.games = {}
        return cls._instance

    def create_game(self, game_id, game_type, *args, **kwargs):
        # 게임 인스턴스 생성 및 저장
        if game_type == "pong":
            self.games[game_id] = PongGame(*args, **kwargs)
        # 다른 게임 타입에 대한 처리
        # ...

    def control(user_id, cmd):
        # 게임에 참여
        # 게임 일시 정지
        # 게임 일시정지 해제
        # 패들 움직임
        pass

    def get_game(self, game_id):
        # 게임 인스턴스 반환
        return self.games.get(game_id)

    def remove_game(self, game_id):
        # 게임 인스턴스 제거
        if game_id in self.games:
            del self.games[game_id]

# 사용 예시
mini_game_server = MiniGameServer()
mini_game_server.create_game("game123", "pong", player1="Alice", player2="Bob")
game_instance = mini_game_server.get_game("game123")
