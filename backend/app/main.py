from fastapi import FastAPI

from app.api.v1.auth import router as auth_router
from app.api.v1.stocks import router as stocks_router
from app.api.v1.watchlist import router as watchlist_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.portfolio import router as portfolio_router

app=FastAPI(title="InvestIQ API")

app.include_router(
    auth_router,
    prefix="/api/v1"
)

app.include_router(
    stocks_router,
    prefix="/api/v1"
)

app.include_router(
    watchlist_router,
    prefix="/api/v1"
)

app.include_router(
    transactions_router,
    prefix="/api/v1"
)
    
app.include_router(
    portfolio_router, 
    prefix="/api/v1"
)

@app.get('/')
def root():
    return{"message":"Welcome to InvestIQ API"}
