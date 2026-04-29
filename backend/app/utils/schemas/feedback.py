from pydantic import BaseModel
from typing import Optional

class FeedbackCreate(BaseModel):
    rating: int
    comment: str

class FeedbackOut(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_email: str
    rating: int
    comment: str
    timestamp: str
