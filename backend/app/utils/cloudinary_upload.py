import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name = settings.CLOUD_NAME,
    api_key = settings.API_KEY,
    api_secret = settings.API_SECRET
)

async def upload_image(file):
    result = cloudinary.uploader.upload(file.file)
    return result["secure_url"]