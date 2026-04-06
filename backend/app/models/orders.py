from datetime import datetime


def order_helper(order) -> dict:
    return {
        "id": str(order["_id"]),
        "user_id": order.get("user_id"),
        "product_id": order.get("product_id"),
        "start_date": order.get("start_date"),
        "end_date": order.get("end_date"),
        "days": order.get("days"),
        "total_price": order.get("total_price"),
        "status": order.get("status", "pending"),
        "created_at": order.get("created_at")
    }