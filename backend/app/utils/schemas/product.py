from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2)
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    category: str
    availability_status: bool = True
    image_url: Optional[str] = None          # first image (backward compat)
    image_urls: Optional[List[str]] = []     # all images (new multi-image support)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    availability_status: Optional[bool] = None
    image_url: Optional[str] = None
    image_urls: Optional[List[str]] = None