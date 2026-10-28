from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel


class PortfolioItemResponse(BaseModel):
    stock_id: UUID
    symbol: str
    company_name: str

    quantity: Decimal
    invested_amount: Decimal
    current_price: Decimal
    current_value: Decimal
    profit_loss: Decimal
    return_percentage: Decimal


class PortfolioResponse(BaseModel):
    total_invested: Decimal
    total_current_value: Decimal
    total_profit_loss: Decimal
    total_return_percentage: Decimal
    holdings: list[PortfolioItemResponse]