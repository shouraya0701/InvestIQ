from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db.database import get_db  
from app.models.stock import Stock
from app.schemas.stock import StockCreate, StockResponse


router= APIRouter(
    prefix="/stocks",
    tags=["Stocks"]
)

@router.post(
    "/",
    response_model=StockResponse,
    status_code=status.HTTP_201_CREATED
)

def create_stock(stock_data: StockCreate,db : Session= Depends(get_db)):
    existing_stock=db.execute(select(Stock).where(Stock.symbol==stock_data.symbol)).scalar_one_or_none()

    if existing_stock:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Stock symbol already exists"
        )
    
    new_stock=Stock(
        symbol=stock_data.symbol.upper(),
        company_name=stock_data.company_name,
        exchange=stock_data.exchange,
        currency=stock_data.currency
    )

    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)

    return new_stock

@router.get(
    "/",
    response_model=list[StockResponse]
)

def get_stocks(db : Session = Depends(get_db)):
    stocks=db.execute(select(Stock).order_by(Stock.symbol)).scalars().all()

    return stocks

@router.get(
    "/{stock_id}",
    response_model=StockResponse
)
def get_stock(stock_id:UUID , db:Session=Depends(get_db)):
    stock=db.execute(select(Stock).where(Stock.id==stock_id)).scalar_one_or_none()

    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found!"
        )

    return stock




    
