from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.schemas.room import (
    RoomAvailabilityResponse,
    RoomCreate,
    RoomResponse,
    RoomUpdate,
)
from app.services.room_service import RoomService

router = APIRouter(
    prefix="/api/v1/rooms",
    tags=["Rooms"]
)


@router.post("/", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        return RoomService.create(db, room)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[RoomResponse])
def get_rooms(
    hotel_id: int | None = Query(default=None, gt=0),
    db: Session = Depends(get_db),
):
    return RoomService.get_all(db, hotel_id=hotel_id)


@router.get("/{room_id}/availability", response_model=RoomAvailabilityResponse)
def get_room_availability(
    room_id: int,
    check_in: str = Query(..., description="ISO check-in date (YYYY-MM-DD)"),
    check_out: str = Query(..., description="ISO check-out date (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
):
    from datetime import date

    try:
        return RoomService.get_availability(
            db,
            room_id,
            date.fromisoformat(check_in),
            date.fromisoformat(check_out),
        )
    except ValueError:
        raise HTTPException(
            status_code=422,
            detail="Dates must use the YYYY-MM-DD format.",
        )
    except Exception as e:
        status_code = 404 if str(e) == "Room not found" else 400
        raise HTTPException(status_code=status_code, detail=str(e))


@router.get("/{room_id}", response_model=RoomResponse)
def get_room(room_id: int, db: Session = Depends(get_db)):
    try:
        return RoomService.get_by_id(db, room_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    room: RoomUpdate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        return RoomService.update(db, room_id, room)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        return RoomService.delete(db, room_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
