from app.db.mongodb import db
from bson import ObjectId

products_collection = db["products"]


class ProductRepository:

    async def create_product(self, data: dict):
        result = await products_collection.insert_one(data)
        return str(result.inserted_id)

    async def get_all_products(self):
        products = []

        async for product in products_collection.find():
            product["id"] = str(product["_id"])
            del product["_id"]
            products.append(product)
            
        return products

    async def get_product_by_id(self, product_id: str):
        from bson import ObjectId

        product = await products_collection.find_one(
            {"_id": ObjectId(product_id)}
        )
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