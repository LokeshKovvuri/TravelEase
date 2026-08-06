from datetime import datetime
from pydantic import BaseModel


class RoomCreate(BaseModel):
    hotel_id: int
    room_type: str
    description: str
    price: float
    capacity: int
    available_rooms: int
    image_url: str | None = None


class RoomUpdate(BaseModel):
    room_type: str
    description: str
    price: float
    capacity: int
    available_rooms: int
    image_url: str | None = None


class RoomResponse(BaseModel):
    id: int
    hotel_id: int
    room_type: str
    description: str
    price: float
    capacity: int
    available_rooms: int
    image_url: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }