from fastapi import FastAPI, Header, HTTPException
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import certifi
from dotenv import load_dotenv
import os
from interface import MealIn, MealOut


load_dotenv()
MONGODB_URI = os.getenv("MONGO_DB_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")


# MongoDB client setup (sensible defaults)
mongo_client = MongoClient(MONGODB_URI, tlsCAFile=certifi.where())
db = mongo_client["carbon_calories"]
meals_collection  = db["carbon-calories"]["meals"]

try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World", "mongodb_connected": bool(mongo_client), "gemini_key_set": bool(GEMINI_API_KEY)}


# GET /history: Get the user’s historical meals
@app.get("/users/{user_id}/history")
async def get_history(user_id: str):
    """Retrieve historical meals for a user."""
    # TODO: Implement logic
    if mongo_client is None:
         raise HTTPException(status_code=503, detail="Database service unavailable.")

    query_filter = {
        "user_id": user_id 
    }

    try:
        # PyMongo's find() returns a Cursor object
        meal_cursor = meals_collection.find(query_filter)
        
        # Convert the cursor results into a list of dictionaries
        meals_list = list(meal_cursor)
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Database query failed: {e}"
        )
    
    formatted_meals = []
    for meal_doc in meals_list:
        # convert objectID to meal_id
        meal_id_str = str(meal_doc.pop("_id"))
        
        formatted_meals.append(
            MealOut(
                meal_id=meal_id_str,
                **meal_doc
            )
        )
    
    return {"meals": formatted_meals}

# GET /emissions: Get carbon emission range based on ingredients and quantity
@app.get("/emissions")
async def get_emissions():
    """Get carbon emission range [low, high] using Gemini based on ingredients and quantity."""
    # TODO: Implement logic using Gemini
    return {"emissions": {"low": None, "high": None}}

# POST /session: Create anonymous user session
@app.post("/session")
async def create_session():
    """Create anonymous user session."""
    # TODO: Implement logic
    return {"user_id": ""}

# POST /meal: Log a meal for a user
@app.post("/users/{user_id}/meals", response_model=MealOut, status_code=201)
def log_meal_for_user(user_id: str, meal: MealIn):
    meal_data = meal.model_dump()
    meal_document = {
        "user_id": user_id,
        **meal_data 
    }

    try:
        result = meals_collection.insert_one(meal_document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert meal: {e}")
    
    new_meal_id = str(result.inserted_id)

    return MealOut(
        meal_id=new_meal_id,
        user_id=user_id,
        **meal_data 
    )