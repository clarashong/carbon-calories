from dotenv import load_dotenv
from pymongo import MongoClient
import certifi
import os

load_dotenv()
MONGODB_URI = os.getenv("MONGO_DB_URI")

# MongoDB client setup
mongo_client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())



