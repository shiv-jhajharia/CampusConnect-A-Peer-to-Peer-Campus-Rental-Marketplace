from fastapi import APIRouter, Depends, HTTPException
from app.services.payment_services import PaymentService
from app.utils.schemas.payment import PaymentCreate
from app.models.payments import payment_model
from app.core.dependencies import get_current_user
from app.db.mongodb import db
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/payments", tags=["Payments"])


# CREATE PAYMENT
@router.post("/")
async def create_payment(
    data: PaymentCreate,
    current_user: dict = Depends(get_current_user)
):
    payment = await PaymentService.create_payment(data)

    # Send Notifications and Update Order Status
    order = await db.orders.find_one({"_id": ObjectId(data.order_id)})
    if order:
        product = await db.products.find_one({"_id": ObjectId(order["product_id"])})
        if product:
            duration = order.get("duration", order.get("days", 1))
            duration_type = order.get("duration_type", "days")
            product_name = product.get("name", "Unknown Product")
            payment_method = getattr(data, "payment_method", "upi").upper()
            
            buyer_msg = {
                "sender_id": "system",
                "receiver_id": str(current_user["_id"]),
                "product_id": str(product["_id"]),
                "text": f"SYSTEM: Order Placed! You have rented {product_name} for {duration} {duration_type}. Payment Method: {payment_method}.",
                "timestamp": datetime.utcnow(),
                "is_read": False
            }
            
            owner_msg = {
                "sender_id": "system",
                "receiver_id": product["owner_id"],
                "product_id": str(product["_id"]),
                "text": f"SYSTEM: Your item {product_name} has been rented for {duration} {duration_type} by {current_user.get('name', current_user.get('email', 'User'))}. Payment Method: {payment_method}.",
                "timestamp": datetime.utcnow(),
                "is_read": False
            }
            
            await db.messages.insert_many([buyer_msg, owner_msg])
            
            new_status = "paid" if payment_method == "UPI" else "cod"
            await db.orders.update_one(
                {"_id": ObjectId(data.order_id)},
                {"$set": {"status": new_status}}
            )

    return payment_model(payment)


# ✅ MARK SUCCESS (SECURE)
@router.put("/{payment_id}/success")
async def payment_success(
    payment_id: str,
    current_user: dict = Depends(get_current_user)
):
    # 🔍 Find payment
    payment = await db.payments.find_one({"_id": ObjectId(payment_id)})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    # 🔍 Find order
    order = await db.orders.find_one({"_id": ObjectId(payment["order_id"])})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # 🔒 Authorization check
    if order["buyer_id"] != str(current_user["_id"]) and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    # ✅ Update status
    await PaymentService.mark_success(payment_id)

    return {"message": "Payment released securely"}


# ✅ MARK FAILED (SECURE)
@router.put("/{payment_id}/failed")
async def payment_failed(
    payment_id: str,
    current_user: dict = Depends(get_current_user)
):
    payment = await db.payments.find_one({"_id": ObjectId(payment_id)})
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    order = await db.orders.find_one({"_id": ObjectId(payment["order_id"])})
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    if order["user_id"] != str(current_user["_id"]) and not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Not authorized")

    await PaymentService.mark_failed(payment_id)

    return {"message": "Payment marked as failed"}