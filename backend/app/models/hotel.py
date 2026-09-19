from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database.base import Base


class Hotel(Base):
    __tablename__ = "hotels"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(200), nullable=False)

    description = Column(String(1000))

    city = Column(String(100), nullable=False)

    country = Column(String(100), nullable=False)

    address = Column(String(255), nullable=False)

    price_per_night = Column(Float, nullable=False)

    rating = Column(Float, default=0)

    image_url = Column(String(500))

    available_rooms = Column(Integer, default=0)

    # ========================================================
    # GPS LOCATION
    # ========================================================

    latitude = Column(Float, nullable=True)

    longitude = Column(Float, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    rooms = relationship(
        "Room",
        back_populates="hotel",
        cascade="all, delete"
    )