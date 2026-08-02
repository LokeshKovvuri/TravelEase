from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.room import RoomCreate, RoomUpdate, RoomResponse
from app.services.room_service import RoomService

router = APIRouter(
    prefix="/api/v1/rooms",
    tags=["Rooms"]
)


@router.post("/", response_model=RoomResponse)
def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    try:
        return RoomService.create(db, room)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/", response_model=list[RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    return RoomService.get_all(db)


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
    db: Session = Depends(get_db),
):
    try:
        return RoomService.update(db, room_id, room)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{room_id}")
def delete_room(room_id: int, db: Session = Depends(get_db)):
    try:
        return RoomService.delete(db, room_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))