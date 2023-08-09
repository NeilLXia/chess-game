import os
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.generic import TemplateView
# from model.postgres import createGame
# from model.index import getTree, createTree


def index(request):
    # return HttpResponse('Hello World')
    return render(request, 'index-django.html')

# def newGame():
#     game_id = createGame()
#     createTree(game_id)
#     print('new game', game_id)
#     return game_id, 201


# def getGame(game_id):
#     gameHistory = getTree(game_id)
#     return JsonResponse(gameHistory, status=200)


# def updateGame(game_id):
#     return JsonResponse(game_id, status=201)
