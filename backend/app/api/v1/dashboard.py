from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.database import get_db
from app.models.user import User
from app.schemas.dashboard import DashboardResponse
from app.services.dashboard import get_dashboard


router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get(
    "/",
    response_model=DashboardResponse
)
def get_user_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get dashboard data for the logged-in user.
    Includes portfolio summary, watchlist count, and recent transactions.
    """
    return get_dashboard(current_user, db)
