"""
ASGI config for potato project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auto import AuthMiddlewareStack
from django.urls import path
from onevsonepong.comsumers import PongConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potato.settings')
# asgi_application = get_asgi_application()

# application = ProtocolTypeRouter({
#     "http": asgi_application,
#     "websocket": URLRouter(websocket_urlpatterns),
# })

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            path("ws/ovopong/", WebSocketConsumer.as_asgi()),
        ])
    ),
})