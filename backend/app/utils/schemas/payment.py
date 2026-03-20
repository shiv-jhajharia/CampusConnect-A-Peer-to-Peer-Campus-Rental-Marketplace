from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentCreate(BaseModel):
    order_id: str
    amount: float

class PaymentResponse(BaseModel):
    id: str
    order_id: str
    amount: float
    status: str
    created_at: datetime