from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    hotel_id = Column(
        Integer,
        ForeignKey("hotels.id", ondelete="CASCADE"),
        nullable=False,
    )

    booking_id = Column(
        Integer,
        ForeignKey("bookings.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
    )

    rating = Column(Integer, nullable=False)

    comment = Column(String(1000))

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship("User")
    hotel = relationship("Hotel")
    booking = relationship("Booking")