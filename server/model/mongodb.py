import os
import certifi
from pymongo import MongoClient, errors
from secrets_manager import get_secret


def get_database():
    try:
        CONNECTION_STRING = 'mongodb+srv://chessadmin:{password}@chess-history-database.k4rbjbb.mongodb.net/'.format(
            password=get_secret()["MONGODB_PASSWORD"], tlsCAFile=certifi.where())
        client = MongoClient(CONNECTION_STRING)
        return client['chess-history-database']
    except errors:
        print('Error connecting to database', errors)
        return None


# This is added so that many files can reuse the function get_database()
if __name__ == '__main__':
    dbname = get_database()
