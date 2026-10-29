from decimal import Decimal
from datetime import date, datetime
from uuid import UUID
from typing import Literal

from pydantic import BaseModel


class RecentTransactionItem(BaseModel):
    id: UUID
    stock_id: UUID
    symbol: str
    company_name: str
    transaction_type: Literal["BUY", "SELL"]
    quantity: Decimal
    price: Decimal
    transaction_date: date
    created_at: datetime


class DashboardResponse(BaseModel):
    total_invested: Decimal
    current_portfolio_value: Decimal
    total_profit_loss: Decimal
    total_return_percentage: Decimal
    number_of_holdings: int
    number_of_watchlist_stocks: int
    recent_transactions: list[RecentTransactionItem]
