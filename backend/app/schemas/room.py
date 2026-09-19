from datetime import date
from pydantic import BaseModel, Field


class RoomCreate(BaseModel):
    hotel_id: int
    room_type: str
    description: str | None = None
    price: float = Field(..., gt=0)
    capacity: int = Field(..., ge=1)
    available_rooms: int = Field(..., ge=0)
    total_rooms: int | None = Field(default=None, ge=1)
    image_url: str | None = None
    room_number: str | None = None
    status: str = "available"


class RoomUpdate(BaseModel):
    room_type: str
    description: str | None = None
    price: float = Field(..., gt=0)
    capacity: int = Field(..., ge=1)
    available_rooms: int = Field(..., ge=0)
    total_rooms: int | None = Field(default=None, ge=1)
    image_url: str | None = None
    room_number: str | None = None
    status: str = "available"


class RoomResponse(BaseModel):
    id: int
    hotel_id: int
    room_type: str
    description: str | None
    price: float
    capacity: int
    available_rooms: int
    total_rooms: int
    image_url: str | None
    room_number: str | None
    status: str | None

    model_config = {
        "from_attributes": True
    }


class RoomAvailabilityResponse(BaseModel):
    """Availability for one room category across a requested stay."""

    room_id: int
    check_in: date
    check_out: date
    total_rooms: int
    reserved_rooms: int
    available_rooms: int
