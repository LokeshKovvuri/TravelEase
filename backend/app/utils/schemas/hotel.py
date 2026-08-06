from pydantic import BaseModel
from datetime import datetime


class HotelCreate(BaseModel):
    name: str
    description: str
    city: str
    country: str
    address: str
    price_per_night: float
    rating: float = 0
    image_url: str | None = None
    available_rooms: int = 0


class HotelResponse(BaseModel):
    id: int
    name: str
    description: str
    city: str
    country: str
    address: str
    price_per_night: float
    rating: float
    image_url: str | None
    available_rooms: int
    created_at: datetime

    model_config = {
        "from_attributes": True
    }