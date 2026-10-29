from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.auth import router as auth_router
from app.api.v1.stocks import router as stocks_router
from app.api.v1.watchlist import router as watchlist_router
from app.api.v1.transactions import router as transactions_router
from app.api.v1.portfolio import router as portfolio_router
from app.api.v1.market import router as market_router
from app.api.v1.sip import router as sip_router
from app.api.v1.dashboard import router as dashboard_router

app = FastAPI(title="InvestIQ API")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

app.include_router(
    market_router,
    prefix="/api/v1"
)

app.include_router(
    sip_router,
    prefix="/api/v1"
)

app.include_router(
    dashboard_router,
    prefix="/api/v1"
)

@app.get('/')
def root():
    return {"message": "Welcome to InvestIQ API"}

