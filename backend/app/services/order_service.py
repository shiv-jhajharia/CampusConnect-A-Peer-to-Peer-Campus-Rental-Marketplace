from app.repositories.order_repo import OrderRepository
from app.models.orders import order_helper
from app.db.mongodb import db
from bson import ObjectId
from app.services.payment_services import PaymentService
from fastapi import HTTPException
from datetime import datetime,date
repo = OrderRepository()


class OrderService:

    async def create_order(self, user_id: str, data):
            # ✅ DATE VALIDATION (ADD HERE)
        if data.start_date < date.today():
            raise HTTPException(
                status_code=400,
                detail="Start date cannot be in past"
            )

        if data.end_date <= data.start_date:
            raise HTTPException(
                status_code=400,
                detail="Invalid date range"
            )
        
        # 🔍 Find product
        product = await db.products.find_one(
            {"_id": ObjectId(data.product_id)}
        )

        if not product:
            raise HTTPException(status_code=404, detail="Product not found")

        # 📅 Calculate rental days
        days = (data.end_date - data.start_date).days

        if days <= 0:
            raise HTTPException(status_code=400, detail="Invalid date range")

        # 💰 Calculate price
        total_price = days * product["price"]

        # 📦 Create order
        order_data = {
            "user_id": user_id,
            "product_id": data.product_id,
            "start_date": data.start_date,
            "end_date": data.end_date,
            "days": days,
            "total_price": total_price,
            "status": "active",
            "created_at": datetime.utcnow()
        }

        order_id = await repo.create_order(order_data)

        return {
            "order_id": str(order_id),
            "total_price": total_price,
            "days": days
        }
    
    async def get_user_orders(self, user_id: str):
        orders = await repo.get_orders_by_user(user_id)
        return [order_helper(o) for o in orders]

    async def get_single_order(self, order_id: str, user_id: str):
        order = await repo.get_order(order_id)

        if not order:
            raise HTTPException(status_code=404, detail="Order not found")

        # 🔒 Only owner can view
        if order["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        return order_helper(order)
    
    async def complete_order(self, order_id: str, user_id: str):
        order = await db.orders.find_one({"_id": ObjectId(order_id)})

        if not order:
            raise Exception("Order not found")

        # 🔒 Only owner can complete
        if order["user_id"] != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")

        await db.orders.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": {"status": "completed"}}
        )

        payment = await db.payments.find_one({"order_id": order_id})

        if payment:
            await PaymentService.mark_success(str(payment["_id"]))

        return {"message": "Order completed & payment released"}