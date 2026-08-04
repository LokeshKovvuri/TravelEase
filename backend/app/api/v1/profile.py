from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.profile import (
    ProfileResponse,
    ProfileUpdate,
)
from app.services.profile_service import ProfileService

router = APIRouter(
    prefix="/api/v1/profile",
    tags=["Profile"],
)


@router.get(
    "/",
    response_model=ProfileResponse,
)
def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ProfileService.get_profile(
        db,
        current_user,
    )


@router.put(
    "/",
    response_model=ProfileResponse,
)
def update_profile(
    profile: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ProfileService.update_profile(
        db,
        current_user,
        profile,
    )

@router.get("/bookings")
def my_bookings(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ProfileService.get_bookings(
        db,
        current_user,
    )


@router.get("/payments")
def my_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ProfileService.get_payments(
        db,
        current_user,
    )


@router.get("/reviews")
def my_reviews(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return ProfileService.get_reviews(
        db,
        current_user,
    )