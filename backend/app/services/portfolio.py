from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.stock import Stock
from app.models.transaction import Transaction
from app.models.user import User
from app.schemas.portfolio import PortfolioItemResponse, PortfolioResponse
from app.services.market import get_stock_quote


def get_portfolio(current_user: User, db: Session) -> PortfolioResponse:

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
            average_cost = (holding["invested_amount"] / holding["quantity"])
            holding["quantity"] -= transaction.quantity
            holding["invested_amount"] -= (transaction.quantity * average_cost)

    portfolio_items = []

    for holding in holdings.values():
        if holding["quantity"] <= 0:
            continue

        # Fetch live price from market data
        try:
            quote = get_stock_quote(holding["symbol"])
            current_price = Decimal(quote["price"])
        except Exception:
            current_price = Decimal("0")

        current_value = holding["quantity"] * current_price
        profit_loss = current_value - holding["invested_amount"]

        if holding["invested_amount"] > 0:
            return_percentage = (profit_loss / holding["invested_amount"]) * 100
        else:
            return_percentage = Decimal("0")

        portfolio_items.append(
            PortfolioItemResponse(
                stock_id=holding["stock_id"],
                symbol=holding["symbol"],
                company_name=holding["company_name"],
                quantity=holding["quantity"],
                invested_amount=holding["invested_amount"],
                current_price=current_price,
                current_value=current_value,
                profit_loss=profit_loss,
                return_percentage=return_percentage.quantize(Decimal("0.01")),
            )
        )

    total_invested = sum((item.invested_amount for item in portfolio_items), Decimal("0"))
    total_current_value = sum((item.current_value for item in portfolio_items), Decimal("0"))
    total_profit_loss = total_current_value - total_invested

    if total_invested > 0:
        total_return_percentage = (total_profit_loss / total_invested) * 100
    else:
        total_return_percentage = Decimal("0")

    return PortfolioResponse(
        total_invested=total_invested,
        total_current_value=total_current_value,
        total_profit_loss=total_profit_loss,
        total_return_percentage=total_return_percentage.quantize(Decimal("0.01")),
        holdings=portfolio_items,
    )
