from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

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


@router.post(
    "/",
    response_model=FlightResponse,
)
def create_flight(
    flight: FlightCreate,
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


@router.get(
    "/",
    response_model=list[FlightResponse],
)
def get_flights(
    db: Session = Depends(get_db),
):

    return FlightService.get_all(db)


@router.get(
    "/search",
    response_model=list[FlightResponse],
)
def search_flights(
    origin: str,
    destination: str,
    db: Session = Depends(get_db),
):

    return FlightService.search(
        db,
        origin,
        destination,
    )


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


@router.put(
    "/{flight_id}",
    response_model=FlightResponse,
)
def update_flight(
    flight_id: int,
    flight: FlightUpdate,
    db: Session = Depends(get_db),
):

    try:
        return FlightService.update(
            db,
            flight_id,
            flight,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{flight_id}",
)
def delete_flight(
    flight_id: int,
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