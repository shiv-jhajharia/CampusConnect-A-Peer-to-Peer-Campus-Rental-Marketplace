from app.repositories.product_repo import ProductRepository

repo = ProductRepository()


class ProductService:

    async def create_product(self,data: dict, user):
        #data = product.dict()
        data["owner_id"] = str(user["_id"])
        data["owner_email"] = user["email"]
        #data["owner_name"] = user.get("name")

        return await repo.create_product(data)

    async def get_products(self):
        return await repo.get_all_products()

    async def get_product(self, product_id: str):
        return await repo.get_product_by_id(product_id)

    async def update_product(self, product_id: str, product, user):
        existing = await repo.get_product_by_id(product_id)

        if not existing:
            raise Exception("Product not found")

        # 🔒 check ownership
        if existing["owner_id"] != str(user["_id"]):
            raise Exception("Not authorized")

        return await repo.update_product(
            product_id,
            product.dict(exclude_unset=True)
        )

    async def delete_product(self, product_id: str, user):
        existing = await repo.get_product_by_id(product_id)

        if not existing:
            raise Exception("Product not found")

        if existing["owner_id"] != str(user["_id"]):
            raise Exception("Not authorized")

        await repo.delete_product(product_id)
        return {"message": "Product deleted successfully"}