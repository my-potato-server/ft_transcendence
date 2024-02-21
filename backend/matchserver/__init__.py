class TournamentLobby:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.participants = []

    def add_participant(self, participant):
        self.participants.append(participant)

    def remove_participant(self, participant):
        if participant in self.participants:
            self.participants.remove(participant)
        else:
            print(f"{participant} is not in the lobby.")

    def display_participants(self):
        print(f"Participants in {self.name} (ID: {self.id}):")
        for participant in self.participants:
            print(participant)

# 테스트
if __name__ == "__main__":
    lobby = TournamentLobby(1, "Tournament Lobby 1")
    
    # 참가자 추가
    lobby.add_participant("Player 1")
    lobby.add_participant("Player 2")
    lobby.add_participant("Player 3")
    
    # 참가자 출력
    lobby.display_participants()
    
    # 참가자 제거
    lobby.remove_participant("Player 2")
    
    # 참가자 출력
    lobby.display_participants()
