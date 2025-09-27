
from fastapi import FastAPI, Header, HTTPException
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import json
from google import genai
import re


load_dotenv()
MONGODB_URI = os.getenv("MONGO_DB_URI", "mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_gemini_api_key_here")


# MongoDB client setup (sensible defaults)
# mongo_client = MongoClient(MONGODB_URI)
# db = mongo_client["carbon_calories"]
# meals_collection = db["meals"]
# sessions_collection = db["sessions"]


app = FastAPI()



@app.get("/")
async def root():
    return {"message": "Hello World", "gemini_key_set": bool(GEMINI_API_KEY)}


# GET /history: Get the user’s historical meals
@app.get("/history")
async def get_history(user_id: str = Header(...)):
    """Retrieve historical meals for a user."""
    # TODO: Implement logic
    return {"meals": []}

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
        {"name": "apple", "quantity": "1"},
        {"name": "rice", "quantity": "200g"},
        {"name": "beef", "quantity": "100g"}  
    ]

    results = []

     # Loop through each ingredient to get its emissions
    for ingredient in ingredients:
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
        response = client.models.generate_content(
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
@app.post("/meal")
async def post_meal(user_id: str = Header(...)):
    """Log a meal for a user."""
    # TODO: Implement logic
    return {"status": "meal logged"}