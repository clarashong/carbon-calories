from auth_token import create_access_token, get_current_user, ACCESS_TOKEN_EXPIRE_MINUTES
from interface import User
from fastapi import FastAPI, Header, HTTPException, APIRouter
from user_ops import get_user_by_username, create_user, verify_user
from interface import User, User
from datetime import timedelta

router = APIRouter()

@router.post("/signup")
async def signup(user: User):
    user_data = user.model_dump()
    existing = get_user_by_username(user_data.get("username"))
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    create_user(user_data.get("username"), user_data.get("password"))
    return {"msg": "User created successfully"}

@router.post("/login")
async def login(user: User):
    valid = verify_user(user.username, user.password)
    if not valid:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": user.username},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}