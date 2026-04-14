from app.db.mongodb import db
from datetime import datetime
from bson import ObjectId

class PaymentRepository:

    @staticmethod
    async def create_payment(data):
        payment = {
            "order_id": data.order_id,
            "amount": data.amount,
            "status": "held",  #escrow
            "created_at": datetime.utcnow()
        }
        result = await db.payments.insert_one(payment)
        payment["_id"] = result.inserted_id
        return payment

    @staticmethod
    async def update_status(payment_id, status):
        await db.payments.update_one(
            {"_id": ObjectId(payment_id)},
            {"$set": {"status": status}}
        )