from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
    )

    amount = Column(Float, nullable=False)

    payment_method = Column(String(50), nullable=False)

    transaction_id = Column(
        String(100),
        unique=True,
        nullable=False,
    )

    status = Column(
        String(30),
        default="PENDING",
        nullable=False,
    )

    provider = Column(
        String(30),
        nullable=False,
        default="mock",
    )

    provider_payment_id = Column(
        String(255),
        nullable=True,
    )

    checkout_url = Column(
        String(1000),
        nullable=True,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    booking = relationship("Booking")
