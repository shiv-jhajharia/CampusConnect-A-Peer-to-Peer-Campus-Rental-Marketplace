from app.db.mongodb import db
from datetime import datetime


class OrderRepository:

    async def create_order(self, order_data: dict):
        #order_data["created_at"] = datetime.utcnow()
        result = await db.orders.insert_one(order_data)
        return result.inserted_id

    async def get_orders_by_user(self, user_id: str):
        return await db.orders.find({"user_id": user_id}).to_list(100)

    async def get_order(self, order_id):
        from bson import ObjectId
        return await db.orders.find_one({"_id": ObjectId(order_id)})
        
    async def get_sales_by_user(self, user_id: str):
        # Find all product IDs owned by this user
        products = await db.products.find({"owner_id": user_id}).to_list(None)
        if not products:
            return []
            
        product_ids = [str(p["_id"]) for p in products]
        
        # Now find all orders where product_id is in product_ids
        orders = await db.orders.find({"product_id": {"$in": product_ids}}).to_list(100)
        return orders