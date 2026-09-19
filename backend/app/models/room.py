from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from app.database.base import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    hotel_id = Column(
        Integer,
        ForeignKey("hotels.id", ondelete="CASCADE"),
        nullable=False,
    )

    room_type = Column(
        String(100),
        nullable=False,
    )

    description = Column(
        String(500),
        nullable=True,
    )

    # Python/API name remains "price"
    # PostgreSQL column is "price_per_night"
    price = Column(
        "price_per_night",
        Float,
        nullable=False,
    )

    capacity = Column(
        Integer,
        nullable=False,
    )

    available_rooms = Column(
        Integer,
        default=0,
    )

    # The total inventory for this room category.  ``available_rooms`` is
    # retained for compatibility with existing clients; booking availability
    # is calculated against this immutable inventory for the requested dates.
    total_rooms = Column(
        Integer,
        nullable=False,
        default=0,
    )

    image_url = Column(
        String(500),
        nullable=True,
    )

    room_number = Column(
        String(100),
        nullable=True,
    )

    status = Column(
        String(50),
        nullable=True,
        default="available",
    )

    hotel = relationship(
        "Hotel",
        back_populates="rooms",
    )
