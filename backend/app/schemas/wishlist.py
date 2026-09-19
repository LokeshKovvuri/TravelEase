from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.hotel import HotelResponse


class WishlistCreate(BaseModel):
    hotel_id: int = Field(..., gt=0)


class WishlistResponse(BaseModel):
    id: int
    user_id: int
    hotel_id: int
    created_at: datetime
    hotel: HotelResponse

    model_config = {
        "from_attributes": True
    }
