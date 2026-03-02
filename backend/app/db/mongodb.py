from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

# Create MongoDB client
client = AsyncIOMotorClient(settings.MONGODB_URL)

# Select database
db = client[settings.DATABASE_NAME]