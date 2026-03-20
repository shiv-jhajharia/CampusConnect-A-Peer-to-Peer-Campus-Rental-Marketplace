from fastapi import APIRouter, Depends
from app.services.payment_services import PaymentService
from app.utils.schemas.payment import PaymentCreate
from app.models.payments import payment_model
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/payments", tags=["Payments"])

# CREATE PAYMENT
@router.post("/")
async def create_payment(
    data: PaymentCreate,
    current_user: dict = Depends(get_current_user)
):
    payment = await PaymentService.create_payment(data)
    return payment_model(payment)


# MARK SUCCESS
@router.put("/{payment_id}/success")
async def payment_success(payment_id: str):
    await PaymentService.mark_success(payment_id)
    return {"message": "Payment successful"}


# MARK FAILED
@router.put("/{payment_id}/failed")
async def payment_failed(payment_id: str):
    await PaymentService.mark_failed(payment_id)
    return {"message": "Payment failed"}