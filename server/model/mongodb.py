import os
import certifi
from pymongo import MongoClient, errors
from dotenv import load_dotenv
from secrets_manager import get_secret

load_dotenv()


def get_database():
    try:
        CONNECTION_STRING = 'mongodb+srv://neillxia:{password}@chess-history-database.k4rbjbb.mongodb.net/'.format(
            password=get_secret()["MONGODB_PASSWORD"], tlsCAFile=certifi.where())
        client = MongoClient(CONNECTION_STRING)
        return client['chess-history-database']
    except errors:
        print('Error connecting to database', errors)
        return None


# This is added so that many files can reuse the function get_database()
if __name__ == '__main__':
    dbname = get_database()
