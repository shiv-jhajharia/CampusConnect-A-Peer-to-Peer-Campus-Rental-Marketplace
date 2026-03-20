from fastapi import APIRouter, Depends, HTTPException
from app.services.order_service import OrderService
from app.utils.schemas.order import OrderCreate
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/orders", tags=["Orders"])

service = OrderService()


@router.post("/")
async def create_order(order: OrderCreate, current_user=Depends(get_current_user)):
    try:
        result = await service.create_order(
            user_id=str(current_user["_id"]),
            items=[item.dict() for item in order.items]
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/")
async def get_my_orders(current_user=Depends(get_current_user)):
    return await service.get_user_orders(str(current_user["_id"]))


@router.get("/{order_id}")
async def get_order(order_id: str, current_user=Depends(get_current_user)):
    try:
        return await service.get_single_order(order_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))