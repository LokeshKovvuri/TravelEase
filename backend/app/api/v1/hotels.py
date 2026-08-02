from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.hotel import HotelCreate, HotelResponse
from app.services.hotel_service import HotelService

router = APIRouter(
    prefix="/api/v1/hotels",
    tags=["Hotels"]
)


@router.post("/", response_model=HotelResponse)
def create_hotel(
    hotel: HotelCreate,
    db: Session = Depends(get_db)
):
    try:
        return HotelService.create(db, hotel)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.get("/", response_model=list[HotelResponse])
def get_hotels(
    db: Session = Depends(get_db)
):
    return HotelService.get_all(db)


@router.get("/{hotel_id}", response_model=HotelResponse)
def get_hotel(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    hotel = HotelService.get_by_id(db, hotel_id)

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return hotel

@router.put("/{hotel_id}", response_model=HotelResponse)
def update_hotel(
    hotel_id: int,
    hotel: HotelCreate,
    db: Session = Depends(get_db)
):
    updated = HotelService.update(db, hotel_id, hotel)

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return updated


@router.delete("/{hotel_id}")
def delete_hotel(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    deleted = HotelService.delete(db, hotel_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found"
        )

    return {
        "message": "Hotel deleted successfully"
    }