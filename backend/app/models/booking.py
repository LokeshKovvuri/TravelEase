from sqlalchemy import (
    Column,
    Integer,
    Float,
    Date,
    String,
    ForeignKey,
    DateTime,
)
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    # Hotel booking
    room_id = Column(
        Integer,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        nullable=True,
    )

    # Flight booking
    flight_id = Column(
        Integer,
        ForeignKey("flights.id", ondelete="CASCADE"),
        nullable=True,
    )

    # Hotel dates
    check_in = Column(
        Date,
        nullable=True,
    )

    check_out = Column(
        Date,
        nullable=True,
    )

    # Number of passengers/guests
    guests = Column(
        Integer,
        nullable=False,
    )

    total_price = Column(
        Float,
        nullable=False,
    )

    status = Column(
        String(30),
        default="PENDING_PAYMENT",
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    # Relationships
    user = relationship(
        "User",
    )

    room = relationship(
        "Room",
    )

    flight = relationship(
        "Flight",
    )