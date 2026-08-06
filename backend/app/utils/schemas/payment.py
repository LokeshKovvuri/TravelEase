from datetime import datetime
from pydantic import BaseModel


class PaymentCreate(BaseModel):
    booking_id: int
    payment_method: str


class PaymentUpdate(BaseModel):
    status: str


class PaymentResponse(BaseModel):
    id: int
    booking_id: int
    amount: float
    payment_method: str
    transaction_id: str
    status: str
    created_at: datetime

    model_config = {
        "from_attributes": True
    }