from decimal import Decimal

from pydantic import BaseModel,Field

class SIPCalculateRequest(BaseModel):
    monthly_investment:Decimal=Field(gt=0)
    annual_return_rate: Decimal = Field(gt=0)
    duration_years:int=Field(gt=0)

class SIPCalculateResponse(BaseModel):
    total_invested:Decimal
    estimated_return:Decimal
    maturity_value:Decimal