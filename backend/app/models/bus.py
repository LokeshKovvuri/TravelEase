from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Bus(Base):
    __tablename__ = "buses"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    operator_name = Column(
        String(150),
        nullable=False,
    )

    bus_number = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
    )

    bus_type = Column(
        String(50),
        nullable=False,
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

    journey_duration = Column(
        String(50),
        nullable=True,
    )

    price = Column(
        Float,
        nullable=False,
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