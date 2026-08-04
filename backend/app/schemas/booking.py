from datetime import date, datetime
from pydantic import BaseModel


class BookingCreate(BaseModel):
    room_id: int
    check_in: date
    check_out: date
    guests: int


class BookingUpdate(BaseModel):
    check_in: date
    check_out: date
    guests: int
    status: str


class BookingResponse(BaseModel):
    id: int
    user_id: int
    room_id: int
    check_in: date
    check_out: date
    guests: int
    total_price: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }