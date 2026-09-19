from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.api.dependencies import get_current_user
from app.models.user import User
from app.schemas.review import (
    ReviewCreate,
    ReviewUpdate,
    ReviewResponse,
)
from app.services.review_service import ReviewService

router = APIRouter(
    prefix="/api/v1/reviews",
    tags=["Reviews"],
)


@router.post("/", response_model=ReviewResponse)
def create_review(
    review: ReviewCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.create(db, review, current_user.id)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("/", response_model=list[ReviewResponse])
def get_reviews(
    db: Session = Depends(get_db),
):
    return ReviewService.get_all(db)


@router.get("/{review_id}", response_model=ReviewResponse)
def get_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.get_by_id(db, review_id)
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put("/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review: ReviewUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.update(
            db,
            review_id,
            review,
            current_user.id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.delete(
            db,
            review_id,
            current_user.id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )
