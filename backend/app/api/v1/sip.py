from fastapi import APIRouter

from app.schemas.sip import SIPCalculateRequest, SIPCalculateResponse
from app.services.sip import calculate_sip


router = APIRouter(
    prefix="/sip",
    tags=["SIP Calculator"]
)


@router.post(
    "/calculate",
    response_model=SIPCalculateResponse
)
def sip_calculate(data: SIPCalculateRequest):
    """
    Calculate SIP (Systematic Investment Plan) returns.
    No authentication required.
    """
    return calculate_sip(data)
