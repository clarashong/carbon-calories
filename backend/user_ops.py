def truncate_password(password: str) -> str:
    password_bytes = password.encode('utf-8')[:72]
    return password_bytes.decode('utf-8', errors='ignore')

from passlib.context import CryptContext
from bson.objectid import ObjectId
import client

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

db = client.mongo_client["carbon_calories"]
user_collection  = db["carbon-calories"]["users"]

def get_user_by_username(username: str):
    user = user_collection.find_one({"username": username})
    return user

def create_user(username: str, password: str):
    password = truncate_password(password)
    # hashed_password = pwd_context.hash(password)
    user = {"username": username, "hashed_password": password}
    result = user_collection.insert_one(user)
    return str(result.inserted_id)

def update_user(username: str, new_password: str):
    hashed_password = pwd_context.hash(new_password)
    result = user_collection.update_one({"username": username}, {"$set": {"hashed_password": hashed_password}})
    return result.modified_count > 0

def verify_user(username: str, password: str):
    user = get_user_by_username(username)
    if not user:
        return False
    password = truncate_password(password)
    return password == user["hashed_password"]
    return pwd_context.verify(password, user["hashed_password"])
