from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/matchserver/', consumers.MyConsumer.as_asgi()),
]
