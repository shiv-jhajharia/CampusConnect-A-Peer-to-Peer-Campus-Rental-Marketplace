from fastapi import FastAPI
from app.db.mongodb import db
from app.core.security import hash_password, verify_password
from app.routes import auth
from app.routes.products import router as product_router
from app.routes import orders
from app.routes import payments
from app.routes import admin


app = FastAPI()

app.include_router(auth.router)

app.include_router(product_router)

app.include_router(orders.router)

app.include_router(payments.router)

app.include_router(admin.router)

@app.get("/")
async def test_db():
    collections = await db.list_collection_names()
    return {"collections": collections}

@app.get("/test-hash")
async def test_hash():
    hashed = hash_password("123456")
    return {
        "hashed": hashed,
        "verify": verify_password("123456", hashed)
    }