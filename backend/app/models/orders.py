from datetime import datetime


def order_helper(order) -> dict:
    return {
        "id": str(order["_id"]),
        "user_id": order["user_id"],
        "items": order["items"],
        "total_price": order["total_price"],
        "created_at": order["created_at"]
    }