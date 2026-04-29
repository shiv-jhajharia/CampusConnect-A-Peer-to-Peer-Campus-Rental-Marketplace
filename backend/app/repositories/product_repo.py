from app.db.mongodb import db
from bson import ObjectId

products_collection = db["products"]


class ProductRepository:

    async def create_product(self, data: dict):
        result = await products_collection.insert_one(data)
        return str(result.inserted_id)

    async def get_all_products(self, query: dict = None):
        products = []
        filter_q = query if query else {}

        pipeline = [
            {"$match": filter_q},
            {
                "$addFields": {
                    "owner_object_id": {
                        "$convert": {
                            "input": "$owner_id",
                            "to": "objectId",
                            "onError": None,
                            "onNull": None
                        }
                    }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner_object_id",
                    "foreignField": "_id",
                    "as": "owner_data"
                }
            },
            {
                "$unwind": {
                    "path": "$owner_data",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$addFields": {
                    "owner_name": {"$ifNull": ["$owner_name", "$owner_data.name"]}
                }
            },
            {"$project": {"owner_data": 0, "owner_object_id": 0}}
        ]

        async for product in products_collection.aggregate(pipeline):
            product["id"] = str(product["_id"])
            del product["_id"]
            products.append(product)
            
        return products

    async def get_product_by_id(self, product_id: str):
        from bson import ObjectId

        pipeline = [
            {"$match": {"_id": ObjectId(product_id)}},
            {
                "$addFields": {
                    "owner_object_id": {
                        "$convert": {
                            "input": "$owner_id",
                            "to": "objectId",
                            "onError": None,
                            "onNull": None
                        }
                    }
                }
            },
            {
                "$lookup": {
                    "from": "users",
                    "localField": "owner_object_id",
                    "foreignField": "_id",
                    "as": "owner_data"
                }
            },
            {
                "$unwind": {
                    "path": "$owner_data",
                    "preserveNullAndEmptyArrays": True
                }
            },
            {
                "$addFields": {
                    "owner_name": {"$ifNull": ["$owner_name", "$owner_data.name"]}
                }
            },
            {"$project": {"owner_data": 0, "owner_object_id": 0}}
        ]

        cursor = products_collection.aggregate(pipeline)
        products = await cursor.to_list(length=1)
        product = products[0] if products else None
        
        if product:
            product["id"] = str(product["_id"])
            del product["_id"]

        return product

    async def update_product(self, product_id: str, data: dict):
        await products_collection.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": data}
        )
        return True

    async def delete_product(self, product_id: str):
        await products_collection.delete_one(
            {"_id": ObjectId(product_id)}
        )
        return True