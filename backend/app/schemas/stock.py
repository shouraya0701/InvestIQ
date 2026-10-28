from uuid import UUID

from pydantic import BaseModel


class StockCreate(BaseModel):
    symbol: str
    company_name:str 
    exchange: str
    currency: str


class StockResponse(BaseModel):
    id:UUID
    symbol:str
    company_name:str
    exchange:str
    currency:str

    model_config = {
        "from_attributes":True
    }