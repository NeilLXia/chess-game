from django.urls import path

from . import views

urlpatterns = [
    path('/?game_id=<str: game_id>/', views.getGameStream, name='get_game_stream')
]
