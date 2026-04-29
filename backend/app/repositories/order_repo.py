from app.db.mongodb import db
from datetime import datetime


class OrderRepository:

    async def create_order(self, order_data: dict):
        #order_data["created_at"] = datetime.utcnow()
        result = await db.orders.insert_one(order_data)
        return result.inserted_id

    async def get_orders_by_user(self, user_id: str):
        pipeline = [
            {"$match": {"user_id": user_id}},
            {"$addFields": {"product_object_id": {"$convert": {"input": "$product_id", "to": "objectId", "onError": None, "onNull": None}}}},
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_object_id",
                    "foreignField": "_id",
                    "as": "product_data"
                }
            },
            {
                "$unwind": {
                    "path": "$product_data",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$addFields": {
                    "product_name": "$product_data.name"
                }
            },
            {"$project": {"product_data": 0, "product_object_id": 0}}
        ]
        return await db.orders.aggregate(pipeline).to_list(100)

    async def get_order(self, order_id):
        from bson import ObjectId
        return await db.orders.find_one({"_id": ObjectId(order_id)})
        
    async def get_sales_by_user(self, user_id: str):
        from bson import ObjectId
        # Find all product IDs owned by this user
        products = await db.products.find({"owner_id": user_id}).to_list(None)
        if not products:
            return []

        product_ids = [str(p["_id"]) for p in products]

        pipeline = [
            {"$match": {"product_id": {"$in": product_ids}}},
            {
                "$addFields": {
                    "product_object_id": {
                        "$convert": {"input": "$product_id", "to": "objectId", "onError": None, "onNull": None}
                    },
                    "renter_object_id": {
                        "$convert": {"input": "$user_id", "to": "objectId", "onError": None, "onNull": None}
                    }
                }
            },
            {
                "$lookup": {
                    "from": "products",
                    "localField": "product_object_id",
                    "foreignField": "_id",
                    "as": "product_data"
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "renter_object_id",
                    "foreignField": "_id",
                    "as": "renter_data"
                }
            },
            {
                "$unwind": {
                    "path": "$product_data",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$unwind": {
                    "path": "$renter_data",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$addFields": {
                    "product_name": "$product_data.name",
                    "renter_name": {"$ifNull": ["$renter_data.name", "$renter_data.email"]}
                }
            },
            {"$project": {"product_data": 0, "renter_data": 0, "product_object_id": 0, "renter_object_id": 0}}
        ]
        return await db.orders.aggregate(pipeline).to_list(100)