import os
import json
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
    if not game_id:
        return HttpResponse('Error in new game creation', status=400)
    return redirect(reverse('get_game') + '?game_id={id}'.format(id=game_id))


async def getGame(request):
    game_id = request.GET.get('game_id', None)
    if not game_id:
        return HttpResponse('Error, no game_id provided', status=400)

    game_tree = model.getTree(game_id)
    if not game_tree:
        return HttpResponse('Error, game not found', status=404)

    return JsonResponse(game_tree, status=201)


async def addNode(request):
    if request.method == 'POST':
        game_id = request.POST.get('game_id', None)
        data = json.loads(request.body.decode())
        print(data)

        if not game_id:
            return HttpResponse('Error, no game_id provided', status=400)

        # model.updateTree(game_id, newNode)

        # model.addToTree(game_id, data)

        # return JsonResponse(game_tree, status=201)
    else:
        game_id = request.GET.get('game_id', None)
        return redirect(reverse('get_game') + '?game_id={id}'.format(id=game_id))
