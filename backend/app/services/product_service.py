from app.repositories.product_repo import ProductRepository

repo = ProductRepository()


class ProductService:

    async def create_product(self, product):
        return await repo.create_product(product.dict())

    async def get_products(self):
        return await repo.get_all_products()

    async def get_product(self, product_id: str):
        return await repo.get_product_by_id(product_id)

    async def update_product(self, product_id: str, product):
        return await repo.update_product(
            product_id,
            product.dict(exclude_unset=True)
        )

    async def delete_product(self, product_id: str):
        return await repo.delete_product(product_id)