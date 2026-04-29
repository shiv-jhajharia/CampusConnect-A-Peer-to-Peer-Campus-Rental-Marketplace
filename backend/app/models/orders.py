from datetime import datetime


def order_helper(order) -> dict:
    return {
        "id": str(order["_id"]),
        "user_id": order.get("user_id"),
        "product_id": order.get("product_id"),
        "start_date": order.get("start_date").isoformat() if isinstance(order.get("start_date"), datetime) else str(order.get("start_date")),
        "end_date": order.get("end_date").isoformat() if isinstance(order.get("end_date"), datetime) else str(order.get("end_date")),
        "days": order.get("days"),
        "duration": order.get("duration", order.get("days")),
        "duration_type": order.get("duration_type", "days"),
        "total_price": order.get("total_price"),
        "status": order.get("status", "pending"),
        "product_name": order.get("product_name", "Unknown Product"),
        "renter_name": order.get("renter_name"),
        "created_at": order.get("created_at").isoformat() if isinstance(order.get("created_at"), datetime) else str(order.get("created_at")) if order.get("created_at") else None
    }