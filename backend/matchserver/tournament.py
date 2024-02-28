# class Tournament:
#     def __init__(self, participants):
#         self.level = 0
#         while 2 ** (self.level) < len(participants):
#             self.level += 1
#         self.matches = [None] * (2 ** (self.level + 1))
#         self.index = 2 ** (self.level - 1) - 1
#         for participant in participants:
#             self.index += 1
#             self.matches[self.index] = participant

#     async def next_match(self):
#         for i in range(2 ** (self.level - 1) - 1, 2 ** self.level - 1):
#             if self.matches[i] is None:
#                 left = self.matches[2 * i + 1]
#                 right = self.matches[2 * i + 2]
#                 if left is not None and right is not None:
#                     return (left, right), (self.level, i, self.matches)
#         return None, (self.level, self.index, self.matches)

#     async def put_result(self, winner):
#         _, match_index, _ = await self.next_match()[1]
#         self.matches[match_index // 2] = winner
#         if match_index // 2 == 1:
#             self.level -= 1


class Tournament:
    def __init__(self, participants):
        self.level = 0
        while 2 ** (self.level) < len(participants):
            self.level += 1
        self.matches = [None] * (2 ** (self.level + 1))
        self.index = 2 ** (self.level) - 1
        for participant in participants:
            self.index += 1
            self.matches[self.index] = participant

        self.now_level = self.level
        self.now_index = 0

    async def next_match(self):

        # 최종 인원이 1명 남았다면 그 혼자만 리턴
        if self.now_level < 1 : return self.matches[1]

        winner_index = 2 ** (self.now_level - 1) + self.now_index
        left  = self.matches[2 ** self.now_level + 2 * self.now_index + 0]
        right = self.matches[2 ** self.now_level + 2 * self.now_index + 1]
        if left is None or right is None:
            if left  is not None : self.matches[winner_index] = left
            if right is not None : self.matches[winner_index] = right
            # self.now_index += 1
            # if self.now_index >= (2 ** (self.now_level - 1)) : 
            #     self.now_level -= 1
            #     self.now_index = 0
            await self.index_pp()
            return await self.next_match()
        if left is not None and right is not None:
            return left, right

    async def put_result(self, winner):
        if self.now_level < 1 : return self.matches[1]

        winner_index = 2 ** (self.now_level - 1) + self.now_index
        left  = self.matches[2 ** self.now_level + 2 * self.now_index + 0]
        right = self.matches[2 ** self.now_level + 2 * self.now_index + 1]

        if winner == left : self.matches[winner_index] = left
        if winner == right: self.matches[winner_index] = right

        await self.index_pp()

    async def index_pp(self):
        self.now_index += 1
        if self.now_index >= (2 ** (self.now_level - 1)) : 
            self.now_level -= 1
            self.now_index = 0

if __name__ == "__main__":
    import asyncio

    async def test_tournament():
        participants = ['A', 'B', 'C', 'D', 'E', 'F', 'G']
        tournament = Tournament(participants)

        results = ['A', 'C', 'E', 'A', 'E', 'A']  # 예정된 각 경기의 승자

        for result in results:
            print(tournament.matches)
            print(await tournament.next_match())
            await tournament.put_result(result)

        print(tournament.matches)
        print(await tournament.next_match())


    asyncio.run(test_tournament())
