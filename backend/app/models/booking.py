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

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )

    room_id = Column(
        Integer,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        nullable=False,
    )

    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)

    guests = Column(Integer, nullable=False)

    total_price = Column(Float, nullable=False)

    status = Column(
        String(30),
        default="CONFIRMED",
        nullable=False,
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user = relationship("User")
    room = relationship("Room")