from pydantic import BaseModel
from datetime import date,datetime

class OrderCreate(BaseModel):
    product_id: str
    start_date: date
    end_date: date


class OrderOut(BaseModel):
    id: str
    user_id: str
    product_id: str
    start_date: date
    end_date: date
    days: int
    total_price: float
    status: str
    created_at: datetime