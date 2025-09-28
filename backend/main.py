from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Header, HTTPException, Depends
from pymongo import MongoClient
import certifi
from dotenv import load_dotenv
import os
import json
from google import genai
import re
from interface import MealIn, MealOut, IngredientsEmissions, MealTableIn, IngredientList
import client # import the MongoDB client
import auth
from auth_token import get_current_user

load_dotenv()
MONGODB_URI = os.getenv("MONGO_DB_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")
gemini_client = genai.Client(api_key=GEMINI_API_KEY)

# MongoDB client setup (sensible defaults)
mongo_client = client.mongo_client
db = mongo_client["carbon_calories"]
meals_collection  = db["carbon-calories"]["meals"]

try:
    mongo_client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router) # add the router for auth 

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

 # POST /emissions: Get carbon emission range based on ingredients and quantity
@app.post("/emissions")
async def get_emissions(ingredients: IngredientList):
    print("getting emissions")
    """Get carbon emission range [low, high] using Gemini based on ingredients and quantity."""
    # Local variable: ingredient list
    ingredients_data = ingredients.model_dump()

    results = []

     # Loop through each ingredient to get its emissions
    for ingredient in ingredients_data["ingredients"]:
        # Prepare the prompt for Gemini
        prompt = f"""
        You are given a single food ingredient with quantity:

        {json.dumps(ingredient, indent=2)}

        Please estimate the carbon emissions in kilograms of CO₂ equivalent (kg CO2e) for this ingredient.
        Give me a low estimate and a high estimate, considering production, transportation, processing, etc.

        Return ONLY in this JSON format:

        {{
            "emissions": {{
                "low": <lowest reasonable estimate as a float>,
                "high": <highest reasonable estimate as a float>
            }}
        }}
        """

        # Send the prompt to Gemini API
        response = gemini_client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        # Extract and clean the response text
        raw_text = response.candidates[0].content.parts[0].text.strip()
        raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
        raw_text = re.sub(r"\s*```$", "", raw_text)

        # Parse the JSON response safely
        try:
            parsed = json.loads(raw_text)
            emissions = parsed.get("emissions", {})
        except Exception:
            emissions = {"low": None, "high": None}

        # Append emissions info to the ingredient
        ingredient_result = {
            "name": ingredient["name"],
            "quantity": ingredient["quantity"],
            "emissions": emissions
        }
        results.append(ingredient_result)
    # Return list of ingredients with emissions
    return results


# POST /session: Create anonymous user session
@app.post("/session")
async def create_session():
    """Create anonymous user session."""
    # TODO: Implement logic
    return {"user_id": ""}

# POST /meal: Log a meal for a user
@app.post("/users/{user_id}/meals", response_model=MealOut, status_code=201)
def log_meal_for_user(user_id: str, meal: MealTableIn):
    meal_data = meal.model_dump()
    meal_document = {
        "user_id": user_id,
        ** meal_data
    }

    try:
        result = meals_collection.insert_one(meal_document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to insert meal: {e}")
    
    new_meal_id = str(result.inserted_id)

    return MealOut(
        user_id=user_id,
        meal_id=new_meal_id,
        **meal_data
    )

@app.post('/suggestion', response_model=str)
def get_meal_suggestion(meal: MealIn): 
    print("getting suggestion")
    meal_data = meal.model_dump()

    meal_data = {"ingredients": meal_data["ingredients"]}

    prompt = f"""
        You are given a meal with ingredients and quantity:

        {json.dumps(meal_data, indent=2)}

        Please provide suggestions on how to make this meal more environmentally friendly.
        Focus on ingredient substitutions, portion sizes, and cooking methods.
        Provide 2-3 specific suggestions in concise bullet points.
        """
    
    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    # Extract and clean the response text
    raw_text = response.candidates[0].content.parts[0].text.strip()
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)

    return raw_text


    




