import os
import psycopg2
# import the error handling libraries for psycopg2
from psycopg2 import OperationalError, errorcodes, errors
from dotenv import load_dotenv

load_dotenv()


def get_database():
    try:
        conn = psycopg2.connect(
            host="chess-web-app-database.city1b7unl1h.us-east-2.rds.amazonaws.com",
            database="chess",
            user="postgres",
            password=os.environ.get("POSTGRESQL_PASSWORD"))
        print('Postgres connection successful')
        return conn
    except OperationalError as err:
        print(err)
        return None
