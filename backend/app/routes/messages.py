from fastapi import APIRouter, Depends, HTTPException
from typing import Optional, List
from app.core.dependencies import get_current_user
from app.db.mongodb import db
from app.utils.schemas.message import MessageCreate, MessageOut
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/messages", tags=["Messages"])

def message_helper(msg) -> dict:
    return {
        "id": str(msg["_id"]),
        "sender_id": msg["sender_id"],
        "receiver_id": msg["receiver_id"],
        "product_id": msg["product_id"],
        "text": msg["text"],
        "timestamp": msg["timestamp"],
        "is_read": msg.get("is_read", False)
    }

@router.post("", response_model=MessageOut)
async def send_message(data: MessageCreate, user: dict = Depends(get_current_user)):
    msg_obj = {
        "sender_id": str(user["_id"]),
        "receiver_id": data.receiver_id,
        "product_id": data.product_id,
        "text": data.text,
        "timestamp": datetime.utcnow(),
        "is_read": False
    }
    result = await db.messages.insert_one(msg_obj)
    msg_obj["_id"] = result.inserted_id
    return message_helper(msg_obj)

@router.get("/thread/{other_user_id}")
async def get_thread(other_user_id: str, product_id: Optional[str] = None, user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    
    # Query to fetch messages between these two users
    query = {
        "$or": [
            {"sender_id": user_id, "receiver_id": other_user_id},
            {"sender_id": other_user_id, "receiver_id": user_id}
        ]
    }
    
    # Optionally filter by product
    if product_id:
        query["product_id"] = product_id
        
    messages = await db.messages.find(query).sort("timestamp", 1).to_list(100)
    
    # Mark incoming messages as read
    await db.messages.update_many(
        {"sender_id": other_user_id, "receiver_id": user_id, "is_read": False},
        {"$set": {"is_read": True}}
    )
    
    return [message_helper(m) for m in messages]

@router.get("/inbox")
async def get_inbox(user: dict = Depends(get_current_user)):
    user_id = str(user["_id"])
    
    # Aggregate to find unique users I've talked to
    # This is a bit complex for a simple inbox, but we want the list of unique partners
    pipeline = [
        {"$match": {"$or": [{"sender_id": user_id}, {"receiver_id": user_id}]}},
        {"$sort": {"timestamp": -1}},
        {
            "$group": {
                "_id": {
                    "$cond": [
                        {"$eq": ["$sender_id", user_id]},
                        "$receiver_id",
                        "$sender_id"
                    ]
                },
                "last_message": {"$first": "$text"},
                "timestamp": {"$first": "$timestamp"},
                "unread_count": {
                    "$sum": {
                        "$cond": [
                            {"$and": [{"$eq": ["$receiver_id", user_id]}, {"$eq": ["$is_read", False]}]},
                            1, 0
                        ]
                    }
                }
            }
        },
        {"$sort": {"timestamp": -1}}
    ]
    
    inbox = await db.messages.aggregate(pipeline).to_list(50)
    
    # Populate user names for the inbox (optional but nice)
    results = []
    for item in inbox:
        partner = await db.users.find_one({"_id": ObjectId(item["_id"])})
        results.append({
            "user_id": item["_id"],
            "user_name": partner.get("name", "User") if partner else "Unknown",
            "last_message": item["last_message"],
            "timestamp": item["timestamp"],
            "unread_count": item["unread_count"]
        })
        
    return results
