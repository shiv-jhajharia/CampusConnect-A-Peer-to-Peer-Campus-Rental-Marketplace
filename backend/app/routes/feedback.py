from fastapi import APIRouter, Depends, HTTPException
from typing import List
from app.core.dependencies import get_current_user, get_current_admin
from app.db.mongodb import db
from app.utils.schemas.feedback import FeedbackCreate, FeedbackOut
from datetime import datetime

router = APIRouter(prefix="/feedbacks", tags=["Feedback"])

def feedback_helper(f) -> dict:
    return {
        "id": str(f["_id"]),
        "user_id": f["user_id"],
        "user_name": f.get("user_name", "Unknown"),
        "user_email": f.get("user_email", "Unknown"),
        "rating": f["rating"],
        "comment": f["comment"],
        "timestamp": f["timestamp"].isoformat() if isinstance(f["timestamp"], datetime) else str(f["timestamp"])
    }

@router.post("/submit", response_model=FeedbackOut)
async def submit_feedback(data: FeedbackCreate, user: dict = Depends(get_current_user)):
    feedback_obj = {
        "user_id": str(user["_id"]),
        "user_name": user.get("name", "Unknown"),
        "user_email": user.get("email", "Unknown"),
        "rating": data.rating,
        "comment": data.comment,
        "timestamp": datetime.utcnow()
    }
    result = await db.feedbacks.insert_one(feedback_obj)
    feedback_obj["_id"] = result.inserted_id
    return feedback_helper(feedback_obj)

@router.get("/all", response_model=List[FeedbackOut])
async def get_all_feedback(admin: dict = Depends(get_current_admin)):
    feedbacks = await db.feedbacks.find().sort("timestamp", -1).to_list(1000)
    return [feedback_helper(f) for f in feedbacks]
