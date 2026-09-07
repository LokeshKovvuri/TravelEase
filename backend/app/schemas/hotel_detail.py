from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class RoomResponse(BaseModel):
    """Room response model"""
    id: int
    room_type: str
    description: Optional[str] = None
    price: float
    capacity: int
    available_rooms: int
    image_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ReviewResponse(BaseModel):
    """Review response model with user info"""
    id: int
    user_id: int
    hotel_id: int
    rating: int
    comment: Optional[str] = None
    created_at: datetime
    user_name: Optional[str] = None

    class Config:
        from_attributes = True


class HotelDetailResponse(BaseModel):
    """Detailed hotel information response"""
    id: int
    name: str
    description: Optional[str] = None
    city: str
    country: str
    address: str
    price_per_night: float
    rating: float
    image_url: Optional[str] = None
    available_rooms: int
    created_at: datetime
    rooms: List[RoomResponse] = []
    reviews: List[ReviewResponse] = []
    amenities: List[str] = []
    average_rating: float = 0.0

    class Config:
        from_attributes = True


class RelatedHotelResponse(BaseModel):
    """Related hotel response model"""
    id: int
    name: str
    city: str
    country: str
    price_per_night: float
    rating: float
    image_url: Optional[str] = None
    available_rooms: int

    class Config:
        from_attributes = True
