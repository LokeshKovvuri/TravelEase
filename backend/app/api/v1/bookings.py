from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    BackgroundTasks,
)
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User

from app.schemas.booking import (
    BookingCreate,
    BookingUpdate,
    BookingResponse,
)

from app.services.booking_service import BookingService
from app.services.email_service import EmailService


router = APIRouter(
    prefix="/api/v1/bookings",
    tags=["Bookings"],
)


# ============================================================
# CREATE BOOKING
# ============================================================

@router.post(
    "/",
    response_model=BookingResponse,
)
def create_booking(
    booking: BookingCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        # Create booking for logged-in user
        new_booking = BookingService.create(
            db=db,
            user_id=current_user.id,
            data=booking,
        )

        # ----------------------------------------------------
        # Send confirmation email
        # ----------------------------------------------------
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


# ============================================================
# GET MY BOOKINGS
# ============================================================

@router.get(
    "/",
    response_model=list[BookingResponse],
)
def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Return only bookings belonging to the
    currently authenticated user.
    """

    return BookingService.get_user_bookings(
        db=db,
        user_id=current_user.id,
    )


# ============================================================
# GET SINGLE BOOKING
# ============================================================

@router.get(
    "/{booking_id}",
    response_model=BookingResponse,
)
def get_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        booking = BookingService.get_by_id(
            db=db,
            booking_id=booking_id,
        )

        # ----------------------------------------------------
        # Check ownership
        # ----------------------------------------------------

        if booking.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to access this booking",
            )

        return booking

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# UPDATE BOOKING
# ============================================================

@router.put(
    "/{booking_id}",
    response_model=BookingResponse,
)
def update_booking(
    booking_id: int,
    booking: BookingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        existing_booking = BookingService.get_by_id(
            db=db,
            booking_id=booking_id,
        )

        # ----------------------------------------------------
        # Check ownership
        # ----------------------------------------------------

        if existing_booking.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to update this booking",
            )

        return BookingService.update(
            db=db,
            booking_id=booking_id,
            data=booking,
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# CANCEL BOOKING
# ============================================================

@router.delete(
    "/{booking_id}",
)
def delete_booking(
    booking_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        existing_booking = BookingService.get_by_id(
            db=db,
            booking_id=booking_id,
        )

        # ----------------------------------------------------
        # Check ownership
        # ----------------------------------------------------

        if existing_booking.user_id != current_user.id:
            raise HTTPException(
                status_code=403,
                detail="You are not allowed to cancel this booking",
            )

        return BookingService.delete(
            db=db,
            booking_id=booking_id,
        )

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )