from decimal import Decimal

from app.schemas.sip import SIPCalculateRequest, SIPCalculateResponse


def calculate_sip(data: SIPCalculateRequest) -> SIPCalculateResponse:
    """
    SIP formula:
    FV = P × [((1 + r)^n - 1) / r] × (1 + r)

    Where:
    P = Monthly investment
    r = Monthly rate of return (annual_rate / 12 / 100)
    n = Total number of months (years × 12)
    """
    P = data.monthly_investment
    annual_rate = data.annual_return_rate
    years = data.duration_years

    monthly_rate = annual_rate / Decimal("1200")  # annual / 12 / 100
    total_months = years * 12

    # SIP future value formula
    if monthly_rate > 0:
        maturity_value = P * (((1 + monthly_rate) ** total_months - 1) / monthly_rate) * (1 + monthly_rate)
    else:
        maturity_value = P * total_months

    total_invested = P * total_months
    estimated_return = maturity_value - total_invested

    return SIPCalculateResponse(
        total_invested=total_invested.quantize(Decimal("0.01")),
        estimated_return=estimated_return.quantize(Decimal("0.01")),
        maturity_value=maturity_value.quantize(Decimal("0.01")),
    )
