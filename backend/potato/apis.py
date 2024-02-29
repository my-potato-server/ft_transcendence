from ninja import NinjaAPI

from account.apis import account_api, friend_api
from main.apis import main_api
from game.apis import match_api


api = NinjaAPI()


api.add_router("", main_api)
api.add_router("account/", account_api)
api.add_router("friend/", friend_api)
api.add_router("match/", match_api)
