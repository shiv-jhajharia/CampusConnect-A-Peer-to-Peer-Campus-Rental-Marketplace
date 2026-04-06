from datetime import datetime

def payment_model(payment) -> dict:
    return {
        "id": str(payment["_id"]),
        "order_id": payment.get("order_id"),
        "amount": payment.get("amount"),
        "status": payment.get("status"),
        "created_at": payment.get("created_at")
    }