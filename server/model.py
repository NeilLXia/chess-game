from flask import jsonify
from mongodb import get_database

treeDB = get_database()


def getTree(root_id):
    document = treeDB['trees'].find_one({'root_id': root_id})
    return jsonify(document['nodes'])


def createTree(root_id):
    treeDB['trees'].insert_one({
        'root_id': root_id,
        'nodes': {{
            'board_state': '1513141611141315' + '12' * 8 + '00' * 32 + '02' * 8 + '05030406010405',
            'user_state': {'selection_1': None,
                           'selection_2': None,
                           'can_castle': {
                               'black': {0: True, 7: True},
                               'white': {56: True, 63: True},
                           },
                           'player_turn': 'white'},
            'timer': {'white': {'minutes': 5, 'seconds': 0},
                      'black': {'minutes': 5, 'seconds': 0}}
        }}
    })
