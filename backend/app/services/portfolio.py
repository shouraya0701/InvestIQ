from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.stock import Stock
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.portfolio import PortfolioItemResponse, PortfolioResponse

def get_portfolio(current_user:User,db:Session) -> PortfolioResponse:

    transactions = db.execute(
        select(Transaction, Stock)
        .join(Stock, Transaction.stock_id == Stock.id)
        .where(Transaction.user_id == current_user.id)
        .order_by(Transaction.transaction_date.asc())
    ).all()

    holdings = {}

    for transaction, stock in transactions:
        if stock.id not in holdings:
            holdings[stock.id] = {
                "stock_id": stock.id,
                "symbol": stock.symbol,
                "company_name": stock.company_name,
                "quantity": Decimal("0"),
                "invested_amount": Decimal("0"),
            }
        holding = holdings[stock.id]
        if transaction.transaction_type == "BUY":
            holding["quantity"] += transaction.quantity
            holding["invested_amount"] += (transaction.quantity * transaction.price)

        elif transaction.transaction_type == "SELL":
            if transaction.quantity > holding["quantity"]:
                continue
            average_cost = (holding["invested_amount"]/holding["quantity"])
            holding["quantity"] -= transaction.quantity
            holding["invested_amount"] -= (transaction.quantity * average_cost)

    portfolio_items = []

    for holding in holdings.values():
        if holding["quantity"] <= 0:
            continue
        portfolio_items.append(
            PortfolioItemResponse(
                stock_id=holding["stock_id"],
                symbol=holding["symbol"],
                company_name=holding["company_name"],
                quantity=holding["quantity"],
                invested_amount=holding["invested_amount"],
                current_price=Decimal("0"),
                current_value=Decimal("0"),
                profit_loss=Decimal("0"),
                return_percentage=Decimal("0"),
            )
        )

    total_invested = sum((item.invested_amount for item in portfolio_items),Decimal("0"))

    return PortfolioResponse(
        total_invested=total_invested,
        total_current_value=Decimal("0"),
        total_profit_loss=Decimal("0"),
        total_return_percentage=Decimal("0"),
        holdings=portfolio_items,
    )

