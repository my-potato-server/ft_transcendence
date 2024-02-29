"""
ASGI config for potato project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/howto/deployment/asgi/
"""

import os

from channels.routing import ProtocolTypeRouter
from django.core.asgi import get_asgi_application

from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import matchserver.routing
import onevsonepong.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'potato.settings')
asgi_application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": asgi_application,
    "websocket": AuthMiddlewareStack(
        URLRouter(
            # matchserver.routing.websocket_urlpatterns
            onevsonepong.routing.websocket_urlpatterns
        )
    ),
})
