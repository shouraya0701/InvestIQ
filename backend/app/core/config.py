import os

from dotenv import load_dotenv

load_dotenv()

SECRET_KEY: str=os.getenv("SECRET_KEY","")

if not SECRET_KEY:
    raise ValueError("SECRET_KEY is not set in .env")

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES =30

ALPHA_VANTAGE_API_KEY: str = os.getenv("ALPHA_VANTAGE_API_KEY", "")

if not ALPHA_VANTAGE_API_KEY:
    raise ValueError("ALPHA_VANTAGE_API_KEY is not set in .env")

ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query"