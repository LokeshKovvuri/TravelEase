from datetime import datetime

from pydantic import BaseModel, Field


class ReviewCreate(BaseModel):
    booking_id: int
    rating: int = Field(..., ge=1, le=5)
    comment: str


class ReviewUpdate(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: str


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    hotel_id: int
    booking_id: int
    rating: int
    comment: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }