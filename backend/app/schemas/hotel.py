from pydantic import BaseModel, Field
from datetime import datetime


class HotelCreate(BaseModel):
    name: str
    description: str
    city: str
    country: str
    address: str

    price_per_night: float

    rating: float = Field(
        default=0,
        ge=0,
        le=5
    )

    image_url: str | None = None

    available_rooms: int = 0

    # ========================================================
    # GPS LOCATION
    # ========================================================

    latitude: float | None = Field(
        default=None,
        ge=-90,
        le=90
    )

    longitude: float | None = Field(
        default=None,
        ge=-180,
        le=180
    )


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

    latitude: float | None

    longitude: float | None

    created_at: datetime

    model_config = {
        "from_attributes": True
    }


class NearbyHotelResponse(HotelResponse):

    distance_km: float