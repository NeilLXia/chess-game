from flask import jsonify
from pymongo.errors import ConnectionFailure, ConfigurationError, CollectionInvalid, InvalidOperation, PyMongoError
import model.mongodb as mongodb
import model.postgres as postgres

treeDB = mongodb.get_database()
metadataDB = postgres.get_database()


async def getTree(root_id):
    if treeDB != None:
        try:
            document = await treeDB['trees'].find_one({'root_id': root_id})
            return jsonify(document['nodes'])
        except PyMongoError as e:
            print('Error retrieving history tree ', e)
    return None


async def createTree(root_id):
    print('treeDB: ', treeDB)
    if treeDB != None:
        try:
            treeDB['trees'].insert_one({
                'root_id': 1,
                'nodes': [{
                    'board_state': '1513141611141315' + '12' * 8 + '00' * 32 + '02' * 8 + '05030406010405',
                    'user_state': {'selection_1': None,
                                   'selection_2': None,
                                   'can_castle': {
                                       'black': {'0': True, '7': True},
                                       'white': {'56': True, '63': True},
                                   },
                                   'player_turn': 'white'},
                    'timer': {'white': {'minutes': 5, 'seconds': 0},
                              'black': {'minutes': 5, 'seconds': 0}}
                }]
            })
            return 201
        except PyMongoError as e:
            print('Error retrieving history tree ', e)
    return None


async def createGame(player_id=1, color="white", time_limit=5):
    print('Postgres: ', metadataDB)
    if metadataDB != None:
        try:
            cur = metadataDB.cursor()
            player_color = "player_white" if color == "white" else "player_black"
            cur.execute(
                f'INSERT INTO games (time_limit, {player_color}) VALUES ({time_limit}, {player_id}) RETURNING game_id;')
            game_id = cur.fetchone()[0]
            metadataDB.commit()
            return game_id
        except Exception as err:
            print(err)
            # rollback the previous transaction before starting another
            metadataDB.rollback()
        finally:
            cur.close()
    return None
