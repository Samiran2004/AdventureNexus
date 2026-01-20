
from pymongo import MongoClient
from .config import config

class Database:
    def __init__(self):
        self.client = MongoClient(config.MONGO_URI)
        # Extract database name from URI or use default if needed (though URI usually has it)
        # pymongo gets the default database from the URI if specified
        self.db = self.client.get_database() 
    
    def get_plans_collection(self):
        return self.db["plans"]
    
    def get_users_collection(self):
        return self.db["users"]

    def get_user_by_id(self, user_id):
        from bson import ObjectId
        try:
            return self.db["users"].find_one({"_id": ObjectId(user_id)})
        except:
            return None

db = Database()
