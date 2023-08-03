import os
import psycopg2
# import the error handling libraries for psycopg2
from psycopg2 import OperationalError, errorcodes, errors
from dotenv import load_dotenv

load_dotenv()

# define queries


def createGameTree(player_id=0, color="white", time_limit=5):
    try:
        conn = psycopg2.connect(
            host="chess-web-app-database.city1b7unl1h.us-east-2.rds.amazonaws.com",
            database="chess",
            user="postgres",
            password=os.environ.get("DATABASE_PASSWORD"))
    except OperationalError as err:
        conn = None

    if conn != None:
        try:
            cur = conn.cursor()

            player_color = "player_white" if color == "white" else "player_black"
            initial_board = "1513141611141315" + "12" * 8 + \
                "00" * 32 + "02" * 8 + "0503040601040305"
            cur.execute(
                "INSERT INTO nodes (board_state, timer_white, timer_black, castle_white_king, castle_white_queen, castle_black_king, castle_black_queen) VALUES ({initial_board}, {time_limit}, {time_limit}, 1, 1, 1, 1) RETURNING node_id")
            root_id = cur.fetchone()[0]
            cur.execute(
                f"INSERT INTO games (time_limit, {player_color},root_id) VALUES ({time_limit}, {player_id}, {root_id}) RETURNING game_id")
            game_id = cur.fetchone()[0]
            return game_id
        except Exception as err:
            # rollback the previous transaction before starting another
            conn.rollback()


def getGameTree(game_id):
    try:
        conn = psycopg2.connect(
            host="chess-web-app-database.city1b7unl1h.us-east-2.rds.amazonaws.com",
            database="chess",
            user="postgres",
            password=os.environ.get("DATABASE_PASSWORD"))
    except OperationalError as err:
        conn = None

    if conn != None:
        try:
            cur = conn.cursor()
            cur.execute(
                f"SELECT * FROM games WHERE game_id = {game_id}")
        except Exception as err:
            # rollback the previous transaction before starting another
            conn.rollback()


def getGameNode():
    cur.execute("SELECT * FROM nodes")


def postGameNode():
    cur.execute("SELECT * FROM nodes")


# Retrieve query results
records = cur.fetchall()
