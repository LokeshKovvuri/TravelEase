from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
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
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.create(db, review)
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
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.update(
            db,
            review_id,
            review,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
):
    try:
        return ReviewService.delete(
            db,
            review_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )