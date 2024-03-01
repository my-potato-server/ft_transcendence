from django.urls import path

from . import consumers

from account.consumers import OnlineConsumer


websocket_urlpatterns = [
    path('ws/matchserver/', consumers.MyConsumer.as_asgi()),
    path('ws/account/online/', OnlineConsumer.as_asgi()),
]
