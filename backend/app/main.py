from fastapi import FastAPI
from app.db.mongodb import db
from app.core.security import hash_password, verify_password
from app.routes import auth


app = FastAPI()

app.include_router(auth.router)

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