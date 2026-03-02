from pydantic import BaseModel, EmailStr
from typing import Optional
from bson import ObjectId

class UserBase(BaseModel):
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: Optional[str]
    hashed_password: str