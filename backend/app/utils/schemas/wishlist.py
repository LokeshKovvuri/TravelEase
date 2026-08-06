from datetime import datetime

from pydantic import BaseModel


class WishlistCreate(BaseModel):
    hotel_id: int


class WishlistResponse(BaseModel):
    id: int
    user_id: int
    hotel_id: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }