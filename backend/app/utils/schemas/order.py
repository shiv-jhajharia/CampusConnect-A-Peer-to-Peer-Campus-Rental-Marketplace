from pydantic import BaseModel
from typing import List
from datetime import datetime


class OrderItem(BaseModel):
    product_id: str
    quantity: int


class OrderCreate(BaseModel):
    items: List[OrderItem]


class OrderOut(BaseModel):
    id: str
    user_id: str
    items: List[OrderItem]
    total_price: float
    created_at: datetime