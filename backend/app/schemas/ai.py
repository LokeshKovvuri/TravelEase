from pydantic import BaseModel, Field


class TripPlanRequest(BaseModel):
    destination: str | None = Field(default=None, max_length=100)
    budget_per_night: float | None = Field(default=None, gt=0, le=1_000_000)
    nights: int = Field(default=2, ge=1, le=30)
    interests: str | None = Field(default=None, max_length=300)
    question: str = Field(
        default="Help me choose a stay.",
        min_length=3,
        max_length=1_000,
    )


class TripPlanHotel(BaseModel):
    id: int
    name: str
    city: str
    country: str
    price_per_night: float
    rating: float
    image_url: str | None = None


class TripPlanResponse(BaseModel):
    advice: str
    recommendations: list[TripPlanHotel]
    provider: str
    notice: str | None = None
