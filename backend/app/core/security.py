from datetime import datetime, timedelta,timezone

from fastapi import Depends,HTTPException,status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt,JWTError
from passlib.context import CryptContext
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import(
    ACCESS_TOKEN_EXPIRE_MINUTES,
    ALGORITHM,
    SECRET_KEY
)

from app.db.database import get_db
from app.models.user import User


pwd_context=CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

def hash_password(password:str) -> str:
    return pwd_context.hash(password)

def verify_password(password : str, password_hash: str) -> bool:
    return pwd_context.verify(password,password_hash)

def create_access_token(data:dict) -> str:
    to_encode=data.copy()

    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp": expire})

    return jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

def decode_access_token(token:str) -> dict:
    return jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])

bearer_scheme = HTTPBearer()

def get_current_user(credentials:HTTPAuthorizationCredentials=Depends(bearer_scheme), db: Session=Depends(get_db)) -> User:
    token= credentials.credentials

    try:
        payload=decode_access_token(token)

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token"
        )
    
    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )
    
    user=db.execute(select(User).where(User.id==user_id)).scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user
