import os
from flask import Flask, request, jsonify, send_from_directory

# template_dir = os.path.dirname(os.path.dirname(
#     os.path.abspath(os.path.dirname(__file__))))
# template_dir = os.path.join(template_dir, 'chess-game')
# template_dir = os.path.join(template_dir, 'client/templates')
# print(template_dir)
# app = Flask(__name__, template_folder=template_dir)
app = Flask(__name__, static_folder='../client/static')
print(app.static_folder)


@app.route('/games/<game_id>')
def getGame(game_id):
    gameHistory = {
        'gameId': game_id,
        'boardState': [],
        'userState': {},
        'timer': {},
        'moveNumber': 0,
        'chessNodation': '',
        'parent': None,
        'children': list(),
    }

    return jsonify(gameHistory)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def Home(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(debug=True)
