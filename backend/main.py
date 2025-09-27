from fastapi import FastAPI, Header, HTTPException
from pymongo import MongoClient
from pymongo.server_api import ServerApi
import certifi
from dotenv import load_dotenv
import os
<<<<<<< HEAD
from interface import MealIn, MealOut


load_dotenv()
MONGODB_URI = os.getenv("MONGO_DB_URI")
=======
import json
from google import genai
import re


load_dotenv()
MONGODB_URI = os.getenv("MONGO_DB_URI", "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority")
>>>>>>> 409ec14e6a45792b1178bdecf9f574ce45c715e6
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")


# MongoDB client setup (sensible defaults)
<<<<<<< HEAD
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
    print("getting emissions")
    """Get carbon emission range [low, high] using Gemini based on ingredients and quantity."""
    # TODO: Implement logic using Gemini

    # Configure your Gemini API key
    # Either set the environment variable GEMINI_API_KEY, or substitute directly (not recommended for production)
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("Please set the GEMINI_API_KEY environment variable")

    client = genai.Client(api_key=api_key)

    # Local variable: ingredient list
    ingredients = [
        {"name": "apple", "quantity": 1},
        {"name": "rice", "quantity": 200},   
        {"name": "beef", "quantity": 100}    
    ]

    # Build the prompt
    prompt = f"""
    You are given a list of food ingredients with quantities:

    {json.dumps(ingredients, indent=2)}

    Please estimate the carbon emissions in kilograms of CO₂ equivalent (kg CO2e) for this ingredient list.
    Give me a low estimate and a high estimate, considering production, transportation, processing, etc.

    Return **ONLY** in this JSON format:

    {{
    "emissions": {{
        "low": <lowest reasonable estimate as a float>,
        "high": <highest reasonable estimate as a float>
    }}
    }}
    """
    # Send to Gemini API
    model_name = "gemini-2.5-flash"   # or another model you have access to 
    response = client.models.generate_content(
        model=model_name,
        contents=prompt
    )
    print(response)

    # Extract text from Gemini response
    raw_text = response.candidates[0].content.parts[0].text.strip()

    # Remove markdown code fences if present
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    # Parse JSON safely
    try:
        parsed = json.loads(raw_text)
        emissions = parsed.get("emissions", {})
        low = emissions.get("low")
        high = emissions.get("high")
    except Exception:
        low, high = None, None

    # Return clean JSON
    return {"emissions": {"low": low, "high": high}}


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