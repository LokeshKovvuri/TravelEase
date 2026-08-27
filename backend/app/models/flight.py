from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Flight(Base):
    __tablename__ = "flights"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    airline = Column(
        String(100),
        nullable=False,
    )

    flight_number = Column(
        String(50),
        nullable=False,
        index=True,
    )

    origin = Column(
        String(100),
        nullable=False,
        index=True,
    )

    destination = Column(
        String(100),
        nullable=False,
        index=True,
    )

    departure_time = Column(
        DateTime,
        nullable=False,
    )

    arrival_time = Column(
        DateTime,
        nullable=False,
    )

    economy_price = Column(
        Float,
        nullable=False,
    )

    business_price = Column(
        Float,
        nullable=True,
    )

    available_seats = Column(
        Integer,
        nullable=False,
        default=0,
    )

    total_seats = Column(
        Integer,
        nullable=False,
        default=0,
    )

    status = Column(
        String(30),
        nullable=False,
        default="SCHEDULED",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )