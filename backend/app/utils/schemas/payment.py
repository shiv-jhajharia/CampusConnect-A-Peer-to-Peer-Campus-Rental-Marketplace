from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: str
    amount: float
    payment_method: str = "upi"

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    amount: float
    status: str
    created_at: datetime