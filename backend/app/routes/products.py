from fastapi import APIRouter, Depends, HTTPException
from app.services.product_service import ProductService
from app.utils.schemas.product import ProductCreate, ProductUpdate
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

service = ProductService()


# CREATE PRODUCT
@router.post("/")
async def create_product(
    product: ProductCreate,
    user=Depends(get_current_user)
):
    # 🔒 optional admin check
    # if user["role"] != "admin":
    #     raise HTTPException(status_code=403, detail="Not allowed")

    return await service.create_product(product)


# GET ALL PRODUCTS
@router.get("/")
async def get_products():
    return await service.get_products()


# GET SINGLE PRODUCT
@router.get("/{product_id}")
async def get_product(product_id: str):
    product = await service.get_product(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# UPDATE PRODUCT
@router.put("/{product_id}")
async def update_product(
    product_id: str,
    product: ProductUpdate,
    user=Depends(get_current_user)
):
    return await service.update_product(product_id, product)


# DELETE PRODUCT
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    user=Depends(get_current_user)
):
    return await service.delete_product(product_id)