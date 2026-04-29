from pydantic import BaseModel
from datetime import date,datetime
from typing import Optional

class OrderCreate(BaseModel):
    product_id: str
    start_date: str
    end_date: str
    duration: Optional[int] = None
    duration_type: Optional[str] = "days"


class OrderOut(BaseModel):
    id: str
    user_id: str
    product_id: str
    start_date: str
    end_date: str
    days: Optional[int] = None
    duration: Optional[int] = None
    duration_type: str = "days"
    total_price: float
    status: str
    created_at: datetime