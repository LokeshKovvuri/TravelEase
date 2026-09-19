from datetime import date, datetime

from pydantic import BaseModel, Field


class BookingCreate(BaseModel):
    # Hotel booking
    room_id: int | None = None

    # Flight booking
    flight_id: int | None = None

    # Hotel dates
    check_in: date | None = None
    check_out: date | None = None

    # Number of guests/passengers
    guests: int = Field(
        ...,
        ge=1,
    )


class BookingUpdate(BaseModel):
    check_in: date | None = None
    check_out: date | None = None
    guests: int = Field(
        ...,
        ge=1,
    )


class BookingResponse(BaseModel):
    id: int
    user_id: int

    room_id: int | None
    flight_id: int | None

    check_in: date | None
    check_out: date | None

    guests: int
    total_price: float
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
