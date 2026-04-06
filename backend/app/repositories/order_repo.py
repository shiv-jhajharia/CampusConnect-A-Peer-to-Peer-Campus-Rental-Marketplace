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