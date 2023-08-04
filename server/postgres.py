import os
import psycopg2
# import the error handling libraries for psycopg2
from psycopg2 import OperationalError, errorcodes, errors
from dotenv import load_dotenv

load_dotenv()

# define queries


def createGame(player_id=0, color="white", time_limit=5):
    try:
        conn = psycopg2.connect(
            host="chess-web-app-database.city1b7unl1h.us-east-2.rds.amazonaws.com",
            database="chess",
            user="postgres",
            password=os.environ.get("DATABASE_PASSWORD"))
    except OperationalError as err:
        print(err)
        conn = None

    print('Postgres connection successful')
    if conn != None:
        try:
            cur = conn.cursor()
            player_color = "player_white" if color == "white" else "player_black"
            cur.execute(
                f"INSERT INTO games (time_limit, {player_color}) VALUES ({time_limit}, {player_id}) RETURNING game_id")
            game_id = cur.fetchone()[0]
            return game_id
        except Exception as err:
            print(err)
            # rollback the previous transaction before starting another
            conn.rollback()

        cur.close()
        conn.close()
        return game_id

    return None
