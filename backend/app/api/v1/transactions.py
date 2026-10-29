from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.stock import Stock
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.transaction import TransactionCreate, TransactionResponse


router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.post(
    "/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED
)
def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    stock = db.execute(
        select(Stock).where(
            Stock.id == transaction_data.stock_id
        )
    ).scalar_one_or_none()

    if not stock:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Stock not found"
        )

    # SELL validation: check if user holds enough shares
    if transaction_data.transaction_type == "SELL":
        previous_transactions = db.execute(
            select(Transaction).where(
                Transaction.user_id == current_user.id,
                Transaction.stock_id == transaction_data.stock_id
            )
        ).scalars().all()

        current_quantity = Decimal("0")

        for txn in previous_transactions:
            if txn.transaction_type == "BUY":
                current_quantity += txn.quantity
            elif txn.transaction_type == "SELL":
                current_quantity -= txn.quantity

        if transaction_data.quantity > current_quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot sell {transaction_data.quantity} shares. You only hold {current_quantity}."
            )

    new_transaction = Transaction(
        user_id=current_user.id,
        stock_id=transaction_data.stock_id,
        transaction_type=transaction_data.transaction_type,
        quantity=transaction_data.quantity,
        price=transaction_data.price,
        transaction_date=transaction_data.transaction_date
    )

    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)

    return new_transaction

@router.get(
    "/",
    response_model=list[TransactionResponse]
)
def get_transactions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    transactions = db.execute(
        select(Transaction)
        .where(
            Transaction.user_id == current_user.id
        )
        .order_by(
            Transaction.transaction_date.desc()
        )
    ).scalars().all()

    return transactions

