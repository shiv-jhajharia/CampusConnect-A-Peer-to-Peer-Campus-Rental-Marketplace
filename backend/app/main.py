from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import db
from app.core.security import hash_password, verify_password
from app.routes import auth
from app.routes.products import router as product_router
from app.routes import orders
from app.routes import payments
from app.routes import admin


app = FastAPI(title="CampusRent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # allow frontend
    allow_credentials=True,
    allow_methods=["*"],  # allow OPTIONS, POST, GET
    allow_headers=["*"],
)

@app.options("/{full_path:path}")
async def options_handler():
    return {"message": "OK"}


app.include_router(auth.router, prefix="/auth")

app.include_router(product_router)

app.include_router(orders.router)

app.include_router(payments.router)

app.include_router(admin.router)

@app.on_event("startup")
async def create_indexes():
    print("Creating indexes...")
    
    await db.products.create_index("owner_id")
    await db.orders.create_index("user_id")

    print("Indexes created successfully")

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