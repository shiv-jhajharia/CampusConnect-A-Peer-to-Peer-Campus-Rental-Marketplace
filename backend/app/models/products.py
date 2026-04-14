#class ProductModel:
 #   def __init__(self, name, description, price, stock):
  #      self.name = name
   #     self.description = description
    #    self.price = price
     #   self.stock = stock

from pydantic import BaseModel

class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    category: str
