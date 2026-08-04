from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.booking import BookingCreate, BookingUpdate, BookingResponse
from app.services.booking_service import BookingService
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks

from app.services.email_service import EmailService

router = APIRouter(
    prefix="/api/v1/bookings",
    tags=["Bookings"]
)


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:

        new_booking = BookingService.create(
            db,
            current_user.id,
            booking,
        )

        background_tasks.add_task(
            EmailService.send_booking_confirmation,
            current_user.email,
            current_user.first_name,
            new_booking,
        )

        return new_booking

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

@router.get("/", response_model=list[BookingResponse])
def get_bookings(db: Session = Depends(get_db)):
    return BookingService.get_all(db)


@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking(booking_id: int, db: Session = Depends(get_db)):
    try:
        return BookingService.get_by_id(db, booking_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/{booking_id}", response_model=BookingResponse)
def update_booking(
    booking_id: int,
    booking: BookingUpdate,
    db: Session = Depends(get_db),
):
    try:
        return BookingService.update(db, booking_id, booking)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.delete("/{booking_id}")
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
):
    try:
        return BookingService.delete(db, booking_id)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))