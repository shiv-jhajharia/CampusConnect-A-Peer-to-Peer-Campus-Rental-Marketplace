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

#Getting single user view
@router.get("/user/{user_id}")
async def get_single_user(user_id: str, admin: dict = Depends(get_current_admin)):
    user = await db.users.find_one({"_id": ObjectId(user_id)})

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user["_id"] = str(user["_id"])

    products = await db.products.find({"owner_id": user_id}).to_list(50)
    orders = await db.orders.find({"user_id": user_id}).to_list(50)

    return {
        "user": user,
        "products": products,
        "orders": orders
    }


#Getting users-full
@router.get("/users-full")
async def get_users_full(admin: dict = Depends(get_current_admin)):
    result = []

    async for user in db.users.find():
        user_id = str(user["_id"])

        # Convert user id
        user["_id"] = user_id

        # 🔍 Get related data
        products = await db.products.find({"owner_id": user_id}).to_list(50)
        orders = await db.orders.find({"user_id": user_id}).to_list(50)

        # Convert IDs
        for p in products:
            p["_id"] = str(p["_id"])

        for o in orders:
            o["_id"] = str(o["_id"])

        result.append({
            "user": user,
            "products": products,
            "orders": orders
        })

    return result

#Getting Admin DashBoard Stats
@router.get("/stats")
async def get_stats(admin: dict = Depends(get_current_admin)):
    return {
        "total_users": await db.users.count_documents({}),
        "total_products": await db.products.count_documents({}),
        "total_orders": await db.orders.count_documents({}),
        "total_payments": await db.payments.count_documents({})
    }


#Deleting User
from bson import ObjectId
from fastapi import HTTPException

@router.delete("/user/{user_id}")
async def delete_user(user_id: str, admin: dict = Depends(get_current_admin)):
    user_obj_id = ObjectId(user_id)

    # Delete user
    result = await db.users.delete_one({"_id": user_obj_id})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    # 🔥 Delete related data
    await db.products.delete_many({"owner_id": user_id})
    await db.orders.delete_many({"user_id": user_id})

    # Optional: delete payments linked to orders
    await db.payments.delete_many({"user_id": user_id})
    return {"message": "User and related data deleted"}

#Deleting Product directly as Admin
@router.delete("/product/{product_id}")
async def admin_delete_product(product_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Optionally, delete associated orders
    await db.orders.delete_many({"product_id": product_id})
    return {"message": "Product and related orders deleted"}

#Deleting Order directly as Admin
@router.delete("/order/{order_id}")
async def admin_delete_order(order_id: str, admin: dict = Depends(get_current_admin)):
    result = await db.orders.delete_one({"_id": ObjectId(order_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Optionally, clear associated payments
    await db.payments.delete_many({"order_id": order_id})
    return {"message": "Order and related payments deleted"}
