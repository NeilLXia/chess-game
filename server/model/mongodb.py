import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()


def get_database():
    try:
        CONNECTION_STRING = 'mongodb+srv://neillxia:{password}@chess-history-database.k4rbjbb.mongodb.net/'.format(
            password=os.environ.get("MONGODB_PASSWORD"))
        client = MongoClient(CONNECTION_STRING)
        return client['chess-history-database']
    except:
        print('Error connecting to database')
        return None


# This is added so that many files can reuse the function get_database()
if __name__ == '__main__':
    dbname = get_database()
