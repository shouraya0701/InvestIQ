from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class WatchListCreate(BaseModel):
    stock_id:UUID

 
class WatchlistResponse(BaseModel):
    id:UUID
    stock_id:UUID
    added_at: datetime
    
    model_config={
        "from_attributes":True
    }

class WatchlistItemResponse(BaseModel):
    id:UUID
    stock_id:UUID
    symbol:str
    company_name: str
    exchange: str
    currency: str
    added_at:datetime
