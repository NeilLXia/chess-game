from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.urls import re_path
from controller.consumers import MoveRecorderConsumer

websocket_urlpatterns = [
    re_path(
        r'\/game\/\?game_id=(?P<game_name>\d+)$', MoveRecorderConsumer.as_asgi()
    ),
]

application = ProtocolTypeRouter(
    {
        "websocket": AuthMiddlewareStack(
            URLRouter(
                websocket_urlpatterns
            )
        ),
    }
)
