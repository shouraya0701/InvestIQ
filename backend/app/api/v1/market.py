from fastapi import APIRouter, Query

from app.schemas.market import StockSearchResult, StockQuoteResponse, HistoryDataPoint
from app.services.market import search_stocks, get_stock_quote, get_stock_history


router = APIRouter(
    prefix="/market",
    tags=["Market Data"]
)


@router.get(
    "/search",
    response_model=list[StockSearchResult]
)
def search(keywords: str = Query(min_length=1)):
    """
    Search stocks by symbol or company name.
    Example: /api/v1/market/search?keywords=AAPL
    """
    return search_stocks(keywords)


@router.get(
    "/{symbol}/quote",
    response_model=StockQuoteResponse
)
def quote(symbol: str):
    """
    Get the latest/current price for a stock.
    Example: /api/v1/market/AAPL/quote
    """
    return get_stock_quote(symbol.upper())


@router.get(
    "/{symbol}/history",
    response_model=list[HistoryDataPoint]
)
def history(symbol: str):
    """
    Get historical daily price data for a stock (last 100 days).
    Example: /api/v1/market/AAPL/history
    """
    return get_stock_history(symbol.upper())
