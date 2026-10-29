from fastapi import APIRouter,Depends,HTTPException,status
from sqlalchemy import select
from sqlalchemy.orm import Session
from uuid import UUID

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.stock import Stock
from app.models.user import User
from app.models.watchlist import Watchlist
from app.schemas.watchlist import WatchListCreate,WatchlistResponse,WatchlistItemResponse

router=APIRouter(
    prefix="/watchlist",
    tags=["Watchlist"]
)

@router.post(
    "/", 
    response_model=WatchlistResponse,
    status_code=status.HTTP_201_CREATED
)
def add_to_watchlist(watchlist_data: WatchListCreate,current_user: User=Depends(get_current_user),db : Session=Depends(get_db)):
    stock=db.execute(select(Stock).where(Stock.id==watchlist_data.stock_id)).scalar_one_or_none()

    if not stock:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Stock not found")
    
    existing_watchlist=db.execute(select(Watchlist).where(Watchlist.user_id==current_user.id,Watchlist.stock_id==watchlist_data.stock_id)).scalar_one_or_none()

    if existing_watchlist:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT,detail="Stock already in watchlist")
    
    new_watchlist= Watchlist(user_id=current_user.id,stock_id=watchlist_data.stock_id)

    db.add(new_watchlist)
    db.commit()
    db.refresh(new_watchlist)

    return new_watchlist

    
@router.get(
    "/",
    response_model=list[WatchlistItemResponse]
)
def get_watchlist(current_user: User=Depends(get_current_user),db: Session=Depends(get_db)):
    watchlist_items = db.execute(select(Watchlist, Stock).join(Stock, Watchlist.stock_id == Stock.id).where(Watchlist.user_id == current_user.id).order_by(Watchlist.added_at.desc())).all()
    
    return [
        {
            "id": watchlist.id,
            "stock_id": stock.id,
            "symbol": stock.symbol,
            "company_name": stock.company_name,
            "exchange": stock.exchange,
            "currency": stock.currency,
            "added_at": watchlist.added_at
        }
        for watchlist, stock in watchlist_items
    ]

@router.delete(
    "/{stock_id}",
    status_code=status.HTTP_204_NO_CONTENT
)
def remove_from_watchlist(
    stock_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    watchlist_item = db.execute(
        select(Watchlist).where(
            Watchlist.user_id == current_user.id,
            Watchlist.stock_id == stock_id
        )
    ).scalar_one_or_none()

    if not watchlist_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found in watchlist"
        )

    db.delete(watchlist_item)
    db.commit()
