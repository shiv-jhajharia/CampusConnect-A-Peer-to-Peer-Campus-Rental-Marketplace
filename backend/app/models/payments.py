from datetime import datetime

def payment_model(payment) -> dict:
    return {
        "id": str(payment["_id"]),
        "order_id": payment["order_id"],
        "amount": payment["amount"],
        "status": payment["status"],
        "created_at": payment["created_at"]
    }