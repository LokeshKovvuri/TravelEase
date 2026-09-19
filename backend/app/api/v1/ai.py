from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.ai import TripPlanRequest, TripPlanResponse
from app.services.travel_planner_service import TravelPlannerService


router = APIRouter(prefix="/api/v1/ai", tags=["AI trip planner"])


@router.post("/trip-plan", response_model=TripPlanResponse)
def create_trip_plan(
    request: TripPlanRequest,
    _: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return TravelPlannerService.create_plan(db, request)
