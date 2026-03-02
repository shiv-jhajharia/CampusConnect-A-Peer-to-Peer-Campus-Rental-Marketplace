from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from app.db.mongodb import db
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.models.user import UserCreate
from app.core.dependencies import get_current_user

router = APIRouter()


@router.post("/register")
async def register(user: UserCreate):
    existing_user = await db.users.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed = hash_password(user.password)

    await db.users.insert_one({
        "email": user.email,
        "hashed_password": hashed
    })

    return {"message": "User created successfully"}


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = await db.users.find_one({"email": form_data.username})

    if not user:
        raise HTTPException(status_code=400, detail="Invalid email")

    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid password")

    access_token = create_access_token({"sub": str(user["_id"])})

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "id": str(current_user["_id"]),
        "email": current_user["email"]
    }