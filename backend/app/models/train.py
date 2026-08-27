from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Train(Base):
    __tablename__ = "trains"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    train_number = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
    )

    train_name = Column(
        String(150),
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

    economy_price = Column(
        Float,
        nullable=False,
    )

    ac_price = Column(
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