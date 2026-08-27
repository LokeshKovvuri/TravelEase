from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    DateTime,
)
from sqlalchemy.sql import func

from app.database.base import Base


class Cab(Base):
    __tablename__ = "cabs"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    provider_name = Column(
        String(150),
        nullable=False,
    )

    vehicle_number = Column(
        String(50),
        nullable=False,
        unique=True,
        index=True,
    )

    vehicle_type = Column(
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

    price_per_km = Column(
        Float,
        nullable=False,
    )

    base_fare = Column(
        Float,
        nullable=False,
    )

    available = Column(
        Integer,
        nullable=False,
        default=1,
    )

    status = Column(
        String(30),
        nullable=False,
        default="AVAILABLE",
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
    )