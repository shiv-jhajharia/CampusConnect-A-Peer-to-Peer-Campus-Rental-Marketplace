from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class MessageCreate(BaseModel):
    receiver_id: str
    product_id: str
    text: str

class MessageOut(BaseModel):
    id: str
    sender_id: str
    receiver_id: str
    product_id: str
    text: str
    timestamp: datetime
    is_read: bool
