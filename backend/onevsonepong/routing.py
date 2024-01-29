# onevsonepong/routing.py
from django.urls import path
from .consumers import PongConsumer
from channels.routing import ProtocolTypeRouter, URLRouter

websocket_urlpatterns = [
    path('ws/ovopong', PongConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': URLRouter(websocket_urlpatterns)
})