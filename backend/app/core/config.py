import os

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY: str=os.getenv("SECRET_KEY","")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES =30