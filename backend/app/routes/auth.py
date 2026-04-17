from fastapi import APIRouter, HTTPException
from app.db.mongodb import db
from app.core.security import create_access_token
from google.oauth2 import id_token
from google.auth.transport import requests
from google.auth.exceptions import GoogleAuthError
from pydantic import BaseModel

router = APIRouter()

GOOGLE_CLIENT_ID = "925682492325-kqgprm0nem7kgo03vrhke8gk70m50de7.apps.googleusercontent.com"
ADMIN_EMAILS = ["pholkar.btech2023@iujaipur.edu.in","sjhajharia.btech2023@iujaipur.edu.in"]

class GoogleToken(BaseModel):
    token: str
    role: str = "user"


@router.post("/google-login")
async def google_login(data: GoogleToken):
    try:
        # ✅ Verify token from Google
        idinfo = id_token.verify_oauth2_token(
            data.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        # ✅ Security check
        if idinfo["aud"] != GOOGLE_CLIENT_ID:
            raise HTTPException(status_code=400, detail="Invalid audience")

        email = idinfo.get("email")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found")

        # ✅ Restrict to college email
        if not email.endswith("@iujaipur.edu.in"):
            raise HTTPException(status_code=403, detail="Only college email allowed")

        # 🔥 ADMIN VALIDATION
        role = "user"
        if data.role == "admin":
            if email not in ADMIN_EMAILS:
                raise HTTPException(status_code=403, detail="Not an admin")
            role = "admin"

        # ✅ Check if user exists
        user = await db.users.find_one({"email": email})

        if not user:
            # ✅ Create new user with full info
            result = await db.users.insert_one({
                "email": email,
                "name": idinfo.get("name"),
                "picture": idinfo.get("picture"),
                "auth_type": "google",
                "role": role,
                "created_at": datetime.utcnow(),
                "ratings_sum": 0.0,
                "ratings_count": 0,
                "fraud_reports": 0
            })
            user = await db.users.find_one({"_id": result.inserted_id})
            
        else:
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"role":role}}
            )
            user["role"] = role


        # ✅ Create JWT
        access_token = create_access_token({
            "sub": str(user["_id"]),
            "email": email,
            "role": role
        })

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "email": email,
            "role": role   # 👈 IMPORTANT
        }

    # ✅ Handle Google-specific error
    except GoogleAuthError:
        raise HTTPException(status_code=400, detail="Invalid Google token")

    # ✅ Preserve custom errors
    except HTTPException as e:
        raise e

    # ✅ Catch unknown errors
    except Exception as e:
        print("ERROR:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
