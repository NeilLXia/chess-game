import os
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.generic import TemplateView
from django.shortcuts import redirect
from django.urls import reverse
from model.model import createGame, createTree, getTree


def index(request):
    # return HttpResponse('Hello World')
    return render(request, 'index-django.html')


def newGame():
    game_id = createGame()
    print('new game', game_id)
    return redirect(reverse('get_game') + '?game_id={game_id}'.format(game_id))


def getGame(game_id):
    createTree(game_id)
    print('new game 2', game_id)
    return game_id, 201


# def getGame(game_id):
#     gameHistory = getTree(game_id)
#     return JsonResponse(gameHistory, status=200)


# def updateGame(game_id):
#     return JsonResponse(game_id, status=201)
