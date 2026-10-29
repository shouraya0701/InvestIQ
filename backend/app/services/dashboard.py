from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.stock import Stock
from app.models.transaction import Transaction
from app.models.user import User
from app.models.watchlist import Watchlist
from app.schemas.dashboard import DashboardResponse, RecentTransactionItem
from app.services.portfolio import get_portfolio


def get_dashboard(current_user: User, db: Session) -> DashboardResponse:

    # Reuse existing portfolio logic
    portfolio = get_portfolio(current_user, db)

    # Count watchlist stocks
    watchlist_count = db.execute(
        select(func.count()).where(
            Watchlist.user_id == current_user.id
        )
    ).scalar() or 0

    # Recent transactions (last 5) with stock info
    recent_txns = db.execute(
        select(Transaction, Stock)
        .join(Stock, Transaction.stock_id == Stock.id)
        .where(Transaction.user_id == current_user.id)
        .order_by(Transaction.created_at.desc())
        .limit(5)
    ).all()

    recent_transactions = [
        RecentTransactionItem(
            id=txn.id,
            stock_id=stock.id,
            symbol=stock.symbol,
            company_name=stock.company_name,
            transaction_type=txn.transaction_type,
            quantity=txn.quantity,
            price=txn.price,
            transaction_date=txn.transaction_date,
            created_at=txn.created_at,
        )
        for txn, stock in recent_txns
    ]

    return DashboardResponse(
        total_invested=portfolio.total_invested,
        current_portfolio_value=portfolio.total_current_value,
        total_profit_loss=portfolio.total_profit_loss,
        total_return_percentage=portfolio.total_return_percentage,
        number_of_holdings=len(portfolio.holdings),
        number_of_watchlist_stocks=watchlist_count,
        recent_transactions=recent_transactions,
    )
