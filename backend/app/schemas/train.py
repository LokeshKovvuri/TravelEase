from datetime import datetime

from pydantic import BaseModel, Field


class TrainCreate(BaseModel):
    train_number: str
    train_name: str
    origin: str
    destination: str

    departure_time: datetime
    arrival_time: datetime

    journey_duration: str | None = None

    economy_price: float = Field(..., gt=0)
    ac_price: float | None = Field(default=None, gt=0)

    available_seats: int = Field(default=0, ge=0)
    total_seats: int = Field(..., gt=0)

    status: str = "SCHEDULED"


class TrainUpdate(BaseModel):
    train_number: str | None = None
    train_name: str | None = None
    origin: str | None = None
    destination: str | None = None

    departure_time: datetime | None = None
    arrival_time: datetime | None = None

    journey_duration: str | None = None

    economy_price: float | None = Field(default=None, gt=0)
    ac_price: float | None = Field(default=None, gt=0)

    available_seats: int | None = Field(default=None, ge=0)
    total_seats: int | None = Field(default=None, gt=0)

    status: str | None = None


class TrainResponse(BaseModel):
    id: int
    train_number: str
    train_name: str
    origin: str
    destination: str

    departure_time: datetime
    arrival_time: datetime

    journey_duration: str | None

    economy_price: float
    ac_price: float | None

    available_seats: int
    total_seats: int

    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }