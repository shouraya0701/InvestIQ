from pydantic import BaseModel


# ──────────────────────────────────────
# Search Results
# ──────────────────────────────────────

class StockSearchResult(BaseModel):
    symbol: str
    name: str
    type: str
    region: str
    currency: str
    match_score: str


# ──────────────────────────────────────
# Stock Quote (Latest Price)
# ──────────────────────────────────────

class StockQuoteResponse(BaseModel):
    symbol: str
    open: str
    high: str
    low: str
    price: str
    volume: str
    latest_trading_day: str
    previous_close: str
    change: str
    change_percent: str


# ──────────────────────────────────────
# Historical Price (Single Day)
# ──────────────────────────────────────

class HistoryDataPoint(BaseModel):
    date: str
    open: str
    high: str
    low: str
    close: str
    volume: str
