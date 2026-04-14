import asyncio
import cloudinary
import cloudinary.uploader
from app.core.config import settings

cloudinary.config(
    cloud_name = settings.CLOUD_NAME,
    api_key    = settings.API_KEY,
    api_secret = settings.API_SECRET
)

async def upload_image(file):
    """
    Upload a file to Cloudinary with an automatic retry mechanism
    for transient network or DNS resolution errors.
    """
    file_bytes = await file.read()
    max_retries = 3
    retry_delay = 1 # second

    for attempt in range(max_retries):
        try:
            # cloudinary.uploader.upload() is synchronous — run it in a thread pool
            result = await asyncio.to_thread(
                cloudinary.uploader.upload,
                file_bytes
            )
            return result["secure_url"]
        except Exception as e:
            if attempt == max_retries - 1:
                # Last attempt failed, propagate the error
                raise e
            # Log failure and wait before retrying
            print(f"Cloudinary upload attempt {attempt + 1} failed (Retrying...): {str(e)}")
            await asyncio.sleep(retry_delay)