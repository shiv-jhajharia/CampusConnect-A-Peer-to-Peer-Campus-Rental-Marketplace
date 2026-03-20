from fastapi import APIRouter, Depends
from app.core.dependencies import get_current_admin
from app.db.mongodb import db

router = APIRouter(prefix="/admin", tags=["Admin"])

#Getting all users
@router.get("/users")
async def get_all_users(admin: dict = Depends(get_current_admin)):
    users = []
    async for user in db.users.find():
        user["_id"] = str(user["_id"])
        users.append(user)
    return users

#Getting all products
@router.get("/products")
async def get_all_products(admin: dict = Depends(get_current_admin)):
    products = []
    async for product in db.products.find():
        product["_id"] = str(product["_id"])
        products.append(product)
    return products

#Getting all orders
@router.get("/orders")
async def get_all_orders(admin: dict = Depends(get_current_admin)):
    orders = []
    async for order in db.orders.find():
        order["_id"] = str(order["_id"])
        orders.append(order)
    return orders

#Getting all payments
@router.get("/payments")
async def get_all_payments(admin: dict = Depends(get_current_admin)):
    payments = []
    async for payment in db.payments.find():
        payment["_id"] = str(payment["_id"])
        payments.append(payment)
    return payments

#Deleting User
from bson import ObjectId
from fastapi import HTTPException

@router.delete("/user/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.users.delete_one({"_id": ObjectId(user_id)})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted"}