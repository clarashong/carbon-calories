from pydantic import BaseModel, Field
from typing import List
import datetime

# ingredients in meal
class Ingredient(BaseModel):
    name: str # name of ingredient
    quantity: str # quantity "ex. 1 cup, 2, 300g"

# meal input to post 
class MealIn(BaseModel):
    """Schema for creating a new meal (the request body)."""
    name: str 
    ingredients: List[Ingredient] 
    date: str # string of datetime

# meal output for post
class MealOut(MealIn):
    """Schema for a meal after it has been saved (includes IDs)."""
    meal_id: str
    user_id: str

