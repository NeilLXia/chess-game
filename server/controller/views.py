import os
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.generic import TemplateView
from django.shortcuts import redirect
from django.urls import reverse
import model.model as model


def index(request):
    return render(request, 'index-django.html')


async def newGame(request):
    game_id = await model.createGame()
    print('new game', game_id)
    if game_id == None:
        return 'Error in new game creation', 400
    return redirect(reverse('get_game') + '?game_id={game_id}'.format(game_id))


async def getGame(request):
    game_id = request.GET.get('game_id', None)
    if game_id == None:
        return "Error, no game_id provided", 400

    await model.createTree(game_id)
    print('new game 2', game_id)
    return game_id, 201


# def getGame(game_id):
#     gameHistory = getTree(game_id)
#     return JsonResponse(gameHistory, status=200)


# def updateGame(game_id):
#     return JsonResponse(game_id, status=201)
