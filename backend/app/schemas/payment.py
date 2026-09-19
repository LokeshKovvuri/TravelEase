from datetime import datetime
from pydantic import BaseModel, Field


class PaymentCreate(BaseModel):
    booking_id: int = Field(..., gt=0)
    payment_method: str = Field(..., min_length=2, max_length=50)


class PaymentUpdate(BaseModel):
    status: str


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: float
    payment_method: str
    transaction_id: str
    status: str
    provider: str
    provider_payment_id: str | None
    checkout_url: str | None
    created_at: datetime

    model_config = {
        "from_attributes": True
    }
