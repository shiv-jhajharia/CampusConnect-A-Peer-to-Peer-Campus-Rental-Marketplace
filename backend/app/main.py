from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.mongodb import db
from app.core.security import hash_password, verify_password
from app.routes import auth
from app.routes.products import router as product_router
from app.routes import orders
from app.routes import payments
from app.routes import admin
from app.routes import users
from app.routes import messages
from app.routes import feedback


app = FastAPI(title="CampusRent API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # allow frontend
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

app.include_router(users.router)

app.include_router(messages.router)

app.include_router(feedback.router)

@app.on_event("startup")
async def startup_event():
    print("Creating indexes...")
    await db.products.create_index("owner_id")
    await db.orders.create_index("user_id")
    print("Indexes created successfully")

    print("Healing stuck products...")
    try:
        unavailable_products = await db.products.find({"availability_status": False}).to_list(1000)
        for prod in unavailable_products:
            prod_id_str = str(prod["_id"])
            active_order = await db.orders.find_one({
                "$or": [
                    {"product_id": prod_id_str, "status": {"$in": ["active", "paid", "cod", "pending"]}},
                    {"product_id": prod["_id"], "status": {"$in": ["active", "paid", "cod", "pending"]}}
                ]
            })
            if not active_order:
                print(f"Fixing stuck availability for product {prod_id_str}")
                await db.products.update_one(
                    {"_id": prod["_id"]},
                    {"$set": {"availability_status": True}}
                )
        print("Healing complete.")
    except Exception as e:
        print("Error during healing:", e)

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
