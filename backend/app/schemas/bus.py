from datetime import datetime

from pydantic import BaseModel, Field


class BusCreate(BaseModel):

    operator_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    bus_number: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    bus_type: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    origin: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    destination: str = Field(
        ...,
        min_length=2,
        max_length=100,
    )

    departure_time: datetime

    arrival_time: datetime

    journey_duration: str | None = None

    price: float = Field(
        ...,
        gt=0,
    )

    available_seats: int = Field(
        default=0,
        ge=0,
    )

    total_seats: int = Field(
        default=0,
        ge=0,
    )

    status: str = "SCHEDULED"


class BusUpdate(BaseModel):

    operator_name: str | None = None

    bus_number: str | None = None

    bus_type: str | None = None

    origin: str | None = None

    destination: str | None = None

    departure_time: datetime | None = None

    arrival_time: datetime | None = None

    journey_duration: str | None = None

    price: float | None = Field(
        default=None,
        gt=0,
    )

    available_seats: int | None = Field(
        default=None,
        ge=0,
    )

    total_seats: int | None = Field(
        default=None,
        ge=0,
    )

    status: str | None = None


class BusResponse(BaseModel):

    id: int

    operator_name: str

    bus_number: str

    bus_type: str

    origin: str

    destination: str

    departure_time: datetime

    arrival_time: datetime

    journey_duration: str | None

    price: float

    available_seats: int

    total_seats: int

    status: str

    created_at: datetime

    model_config = {
        "from_attributes": True
    }