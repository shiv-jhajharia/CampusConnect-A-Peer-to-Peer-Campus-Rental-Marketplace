from fastapi import APIRouter, Depends, HTTPException
from app.services.payment_services import PaymentService
from app.utils.schemas.payment import PaymentCreate
from app.models.payments import payment_model
from app.core.dependencies import get_current_user
from app.db.mongodb import db
from bson import ObjectId

router = APIRouter(prefix="/payments", tags=["Payments"])


# CREATE PAYMENT
@router.post("/")
async def create_payment(
    data: PaymentCreate,
    current_user: dict = Depends(get_current_user)
):
    payment = await PaymentService.create_payment(data)
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