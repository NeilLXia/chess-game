import os
from flask import Flask, request, jsonify, send_from_directory
from postgres import createGame
from model import getTree, createTree

app = Flask(__name__, static_folder='../client/static')

# API routes controller


@app.route('/newgame', methods=["POST"])
def newGame():
    game_id = createGame()
    createTree(game_id)
    print('new game', game_id)
    return game_id, 201


@app.route('/getgame/<game_id>')
def getGame(game_id):
    gameHistory = getTree(game_id)
    return jsonify(gameHistory), 200


@app.route('/updategame/<game_id>', methods=["PUT"])
def updateGame(game_id):
    body = request.json
    return jsonify(game_id), 201


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def Home(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path), 200
    else:
        return send_from_directory(app.static_folder, 'index.html'), 200


if __name__ == '__main__':
    app.run(debug=True)
