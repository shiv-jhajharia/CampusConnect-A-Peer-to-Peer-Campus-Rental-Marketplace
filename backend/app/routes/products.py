from fastapi import APIRouter, Depends, HTTPException
from fastapi import File, UploadFile, Form #making for upload image
from app.utils.cloudinary_upload import upload_image
from app.services.product_service import ProductService
from app.utils.schemas.product import ProductCreate, ProductUpdate
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/products", tags=["Products"])

service = ProductService()


# UPLOAD IMAGE SECURELY
@router.post("/upload-image")
async def upload_product_image(
    file: UploadFile = File(...), 
    user=Depends(get_current_user)
):
    try:
        url = await upload_image(file)
        return {"secure_url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# CREATE PRODUCT
@router.post("")
async def create_product(
    product: ProductCreate,
    user=Depends(get_current_user)
):
    product_data = product.dict()
    return await service.create_product(product_data, user)


from typing import Optional

@router.get("")
async def get_products(
    search: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
):
    return await service.get_products(search, category, min_price, max_price)

# GET MY PRODUCTS
@router.get("/my/all")
async def get_my_products(user=Depends(get_current_user)):
    return await service.get_my_products(user)


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
    return await service.update_product(product_id, product, user)


# DELETE PRODUCT
@router.delete("/{product_id}")
async def delete_product(
    product_id: str,
    user=Depends(get_current_user)
):
    return await service.delete_product(product_id,user)