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
        # Parse ISO strings to datetime objects
        start_datetime = datetime.fromisoformat(data.start_date)
        end_datetime = datetime.fromisoformat(data.end_date)
        
        # ✅ DATE VALIDATION
        if start_datetime.date() < date.today():
            raise HTTPException(
                status_code=400,
                detail="Start date cannot be in past"
            )

        if end_datetime <= start_datetime:
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

        # ✅ Check product availability dates boundaries
        if "available_from" in product and product["available_from"]:
            
            # MongoDB may return datetime.datetime. Convert to date if needed.
            avail_from = product["available_from"]
            if hasattr(avail_from, "date"):
                avail_from = avail_from.date()
            elif isinstance(avail_from, str):
                avail_from = datetime.strptime(avail_from, "%Y-%m-%d").date()

            if start_datetime.date() < avail_from:
                raise HTTPException(status_code=400, detail="Start date is before product availability.")
                
        if "available_to" in product and product["available_to"]:
            avail_to = product["available_to"]
            if hasattr(avail_to, "date"):
                avail_to = avail_to.date()
            elif isinstance(avail_to, str):
                avail_to = datetime.strptime(avail_to, "%Y-%m-%d").date()

            if end_datetime.date() > avail_to:
                raise HTTPException(status_code=400, detail="End date is after product availability.")

        # 🚫 DOUBLE BOOKING PREVENTION
        overlapping_order = await db.orders.find_one({
            "product_id": data.product_id,
            "status": {"$in": ["active", "paid"]},
            "start_date": {"$lte": end_datetime},
            "end_date": {"$gte": start_datetime}
        })
        
        if overlapping_order:
            raise HTTPException(
                status_code=400,
                detail="Product is already booked for these dates."
            )

        # 📅 Calculate rental duration
        price_type = product.get("price_type", "daily")
        duration = 0
        duration_type = "days"
        
        if price_type == "hourly":
            diff_hours = (end_datetime - start_datetime).total_seconds() / 3600
            duration = max(1, int(diff_hours)) # round to nearest hour, min 1
            duration_type = "hours"
        else:
            diff_days = (end_datetime.date() - start_datetime.date()).days
            duration = max(1, diff_days)
            duration_type = "days"

        # 💰 Calculate price
        total_price = duration * product["price"]

        # 📦 Create order (Store as datetime for reliable querying)
        order_data = {
            "user_id": user_id,
            "product_id": data.product_id,
            "start_date": start_datetime,
            "end_date": end_datetime,
            "days": duration if duration_type == "days" else None, # for backwards compatibility
            "duration": duration,
            "duration_type": duration_type,
            "total_price": total_price,
            "status": "active",
            "created_at": datetime.utcnow()
        }

        order_id = await repo.create_order(order_data)

        # Mark product as unavailable while rented
        await db.products.update_one(
            {"_id": ObjectId(data.product_id)},
            {"$set": {"availability_status": False}}
        )

        return {
            "order_id": str(order_id),
            "total_price": total_price,
            "duration": duration,
            "duration_type": duration_type
        }
    
    async def get_user_orders(self, user_id: str):
        orders = await repo.get_orders_by_user(user_id)
        return [order_helper(o) for o in orders]

    async def get_user_sales(self, user_id: str):
        orders = await repo.get_sales_by_user(user_id)
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

        # Mark product as available again after rental completes
        await db.products.update_one(
            {"_id": ObjectId(order["product_id"])},
            {"$set": {"availability_status": True}}
        )

        payment = await db.payments.find_one({"order_id": order_id})

        if payment:
            await PaymentService.mark_success(str(payment["_id"]))

        return {"message": "Order completed & payment released"}