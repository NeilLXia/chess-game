from pymongo import MongoClient


def get_database():
    CONNECTION_STRING = "mongodb+srv://neillxia:<password>@chess-history-database.k4rbjbb.mongodb.net/"
    client = MongoClient(CONNECTION_STRING)
    return client['chess-history-database']


# This is added so that many files can reuse the function get_database()
if __name__ == "__main__":
    dbname = get_database()
