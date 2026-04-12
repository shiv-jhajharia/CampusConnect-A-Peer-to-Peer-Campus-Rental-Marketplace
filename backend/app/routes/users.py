from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.utils.schemas.user import UserResponse, UserUpdate
from app.db.mongodb import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/users", tags=["Users"])

async def compute_trust_score(user: dict):
    # 1. Rating (50%) - Average rating received
    avg_rating = 3.5  # Neutral start for new users
    if user.get("ratings_count", 0) > 0:
        avg_rating = user["ratings_sum"] / user["ratings_count"]
    
    # 2. Reviews Count (10%) - Scaling factor
    reviews_weight = min(user.get("ratings_count", 0) / 10, 1.0) * 5.0
    
    # 3. Order Success Rate (20%)
    # Success rate based on orders placed by this user
    total_orders = await db.orders.count_documents({"user_id": str(user["_id"])})
    completed_orders = await db.orders.count_documents({"user_id": str(user["_id"]), "status": "completed"})
    
    success_rate_val = 1.0 # Default if no orders
    if total_orders > 0:
        success_rate_val = completed_orders / total_orders
    
    # 4. Account Age (10%) - Reward older accounts
    created_at = user.get("created_at", datetime.utcnow())
    days_old = (datetime.utcnow() - created_at).days
    age_weight = min(days_old / 365, 1.0) * 5.0
    
    # 5. Activity Level (10%) - Based on listings + usage
    active_listings = await db.products.count_documents({"owner_id": str(user["_id"])})
    activity_count = total_orders + active_listings
    activity_weight = min(activity_count / 20, 1.0) * 5.0
    
    # 6. Fraud Penalty (Negative impact)
    penalty = user.get("fraud_reports", 0) * 0.5

    # Weighted Sum
    # 50% * avg_rating + 10% * reviews_weight + 20% * (success_rate * 5) + 10% * age_weight + 10% * activity_weight
    score = (
        (avg_rating * 0.50) +
        (reviews_weight * 0.10) +
        (success_rate_val * 5.0 * 0.20) +
        (age_weight * 0.10) +
        (activity_weight * 0.10)
    ) - penalty

    # Clamp between 0.0 and 5.0
    final_score = round(max(0.0, min(5.0, score)), 1)
    return final_score

@router.get("/me", response_model=UserResponse)
async def get_me(user: dict = Depends(get_current_user)):
    trust_score = await compute_trust_score(user)
    return {
        "id": str(user["_id"]),
        "email": user["email"],
        "name": user.get("name"),
        "picture": user.get("picture"),
        "trust_score": trust_score
    }

@router.patch("/me", response_model=UserResponse)
async def update_me(data: UserUpdate, user: dict = Depends(get_current_user)):
    update_data = data.dict(exclude_unset=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    await db.users.update_one(
        {"_id": user["_id"]},
        {"$set": update_data}
    )
    
    updated_user = await db.users.find_one({"_id": user["_id"]})
    trust_score = await compute_trust_score(updated_user)
    return {
        "id": str(updated_user["_id"]),
        "email": updated_user["email"],
        "name": updated_user.get("name"),
        "picture": updated_user.get("picture"),
        "trust_score": trust_score
    }
