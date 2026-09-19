from datetime import date, datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.database.session import get_db

from app.schemas.flight import (
    FlightCreate,
    FlightUpdate,
    FlightResponse,
)

from app.services.flight_service import FlightService


router = APIRouter(
    prefix="/api/v1/flights",
    tags=["Flights"],
)


# ============================================================
# CREATE FLIGHT
# ============================================================

@router.post(
    "/",
    response_model=FlightResponse,
)
def create_flight(
    flight: FlightCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return FlightService.create(
            db,
            flight,
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# SEARCH FLIGHTS
# IMPORTANT: keep this BEFORE /{flight_id}
# ============================================================

@router.get(
    "/search",
    response_model=list[FlightResponse],
)
def search_flights(
    origin: str | None = Query(
        default=None,
        description="Departure city",
    ),

    destination: str | None = Query(
        default=None,
        description="Arrival city",
    ),

    departure_date: date | None = Query(
        default=None,
        description="Departure date in YYYY-MM-DD format",
    ),

    db: Session = Depends(get_db),
):

    try:

        return FlightService.search(
            db=db,
            origin=origin,
            destination=destination,
            departure_date=departure_date,
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e),
        )


# ============================================================
# GET ALL FLIGHTS
# ============================================================

@router.get(
    "/",
    response_model=list[FlightResponse],
)
def get_flights(
    db: Session = Depends(get_db),
):

    return FlightService.get_all(db)


# ============================================================
# GET FLIGHT BY ID
# ============================================================

@router.get(
    "/{flight_id}",
    response_model=FlightResponse,
)
def get_flight(
    flight_id: int,
    db: Session = Depends(get_db),
):

    try:

        return FlightService.get_by_id(
            db,
            flight_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# UPDATE FLIGHT
# ============================================================

@router.put(
    "/{flight_id}",
    response_model=FlightResponse,
)
def update_flight(
    flight_id: int,
    flight: FlightUpdate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return FlightService.update(
            db=db,
            flight_id=flight_id,
            data=flight,
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# DELETE FLIGHT
# ============================================================

@router.delete(
    "/{flight_id}",
)
def delete_flight(
    flight_id: int,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return FlightService.delete(
            db,
            flight_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )
