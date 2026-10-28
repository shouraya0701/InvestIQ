from datetime import date,datetime
from decimal import Decimal
from uuid import UUID
from typing import Literal


from pydantic import BaseModel, Field

class TransactionCreate(BaseModel):
    stock_id:UUID
    transaction_type:Literal["BUY","SELL"]
    quantity: Decimal=Field(gt=0)
    price: Decimal=Field(gt=0)
    transaction_date: date

class TransactionResponse(BaseModel):
    id:UUID
    stock_id:UUID
    transaction_type:Literal["BUY","SELL"]
    quantity: Decimal
    price: Decimal
    transaction_date:date
    created_at:datetime

    model_config={
        "from_attributes":True
    }
