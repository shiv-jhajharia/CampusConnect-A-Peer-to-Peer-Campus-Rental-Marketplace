from app.repositories.order_repo import OrderRepository
from app.models.orders import order_helper
from app.db.mongodb import db
from bson import ObjectId

repo = OrderRepository()


class OrderService:

    async def create_order(self, user_id: str, items: list):
        total_price = 0

        # 🔥 Calculate total price from products collection
        for item in items:
            product = await db.products.find_one({"_id": ObjectId(item["product_id"])})
            if not product:
                raise Exception("Product not found")

            total_price += product["price"] * item["quantity"]

        order_data = {
            "user_id": user_id,
            "items": items,
            "total_price": total_price
        }

        order_id = await repo.create_order(order_data)

        return {
            "order_id": str(order_id),
            "total_price": total_price
        }

    async def get_user_orders(self, user_id: str):
        orders = await repo.get_orders_by_user(user_id)
        return [order_helper(o) for o in orders]

    async def get_single_order(self, order_id: str):
        order = await repo.get_order(order_id)
        if not order:
            raise Exception("Order not found")

        return order_helper(order)