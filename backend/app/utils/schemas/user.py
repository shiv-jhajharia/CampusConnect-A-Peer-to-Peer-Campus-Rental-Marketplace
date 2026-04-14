from pydantic import BaseModel, EmailStr
from typing import Optional

class UserResponse(BaseModel):
    id: str
    email: EmailStr
    name: Optional[str] = None
    picture: Optional[str] = None
    trust_score: float = 4.8  # Mock for now

class UserUpdate(BaseModel):
    name: Optional[str] = None
    picture: Optional[str] = None