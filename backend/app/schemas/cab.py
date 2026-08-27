from datetime import datetime

from pydantic import BaseModel, Field


class CabCreate(BaseModel):

    provider_name: str = Field(
        ...,
        min_length=2,
        max_length=150,
    )

    vehicle_number: str = Field(
        ...,
        min_length=2,
        max_length=50,
    )

    vehicle_type: str = Field(
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

    price_per_km: float = Field(
        ...,
        gt=0,
    )

    base_fare: float = Field(
        ...,
        ge=0,
    )

    available: int = Field(
        default=1,
        ge=0,
    )

    status: str = "AVAILABLE"


class CabUpdate(BaseModel):

    provider_name: str | None = None

    vehicle_number: str | None = None

    vehicle_type: str | None = None

    origin: str | None = None

    destination: str | None = None

    price_per_km: float | None = Field(
        default=None,
        gt=0,
    )

    base_fare: float | None = Field(
        default=None,
        ge=0,
    )

    available: int | None = Field(
        default=None,
        ge=0,
    )

    status: str | None = None


class CabResponse(BaseModel):

    id: int

    provider_name: str

    vehicle_number: str

    vehicle_type: str

    origin: str

    destination: str

    price_per_km: float

    base_fare: float

    available: int

    status: str

    created_at: datetime

    model_config = {
        "from_attributes": True
    }