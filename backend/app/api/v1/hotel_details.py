from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database.session import get_db
from app.models.hotel import Hotel
from app.models.room import Room
from app.models.review import Review
from app.schemas.hotel_detail import HotelDetailResponse, RelatedHotelResponse

router = APIRouter(
    prefix="/api/v1/hotels",
    tags=["hotel-details"]
)

# Define common amenities
HOTEL_AMENITIES = {
    "5-star": [
        "Free WiFi",
        "Swimming Pool",
        "Spa & Wellness",
        "Fine Dining",
        "Concierge Service",
        "Room Service",
        "Gym & Fitness",
        "Business Center",
        "Valet Parking",
        "Turn-down Service"
    ],
    "4-star": [
        "Free WiFi",
        "Swimming Pool",
        "Restaurant",
        "Bar & Lounge",
        "Gym",
        "Room Service",
        "Business Center",
        "Parking",
        "Meeting Rooms"
    ],
    "3-star": [
        "Free WiFi",
        "Restaurant",
        "Bar",
        "Gym",
        "Parking",
        "Room Service",
        "Business Facilities"
    ],
    "budget": [
        "Free WiFi",
        "24/7 Front Desk",
        "Basic Breakfast",
        "Parking",
        "Air Conditioning"
    ]
}


def get_amenities_by_rating(rating: float) -> List[str]:
    """Get amenities based on hotel rating"""
    if rating >= 4.7:
        return HOTEL_AMENITIES["5-star"]
    elif rating >= 4.3:
        return HOTEL_AMENITIES["4-star"]
    elif rating >= 3.8:
        return HOTEL_AMENITIES["3-star"]
    else:
        return HOTEL_AMENITIES["budget"]


def calculate_average_rating(reviews: List[Review]) -> float:
    """Calculate average rating from reviews"""
    if not reviews:
        return 0.0
    total = sum(review.rating for review in reviews)
    return round(total / len(reviews), 1)


@router.get("/{hotel_id}", response_model=HotelDetailResponse)
async def get_hotel_details(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed information about a specific hotel including:
    - Basic hotel info
    - All rooms
    - All reviews
    - Amenities
    - Average rating
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    # Get reviews with user info
    reviews = db.query(Review).filter(Review.hotel_id == hotel_id).all()
    
    # Calculate average rating
    avg_rating = calculate_average_rating(reviews)
    
    # Get amenities based on rating
    amenities = get_amenities_by_rating(avg_rating if avg_rating > 0 else hotel.rating)
    
    # Get rooms
    rooms = db.query(Room).filter(Room.hotel_id == hotel_id).all()
    
    # Prepare response
    review_responses = [
        {
            "id": review.id,
            "user_id": review.user_id,
            "hotel_id": review.hotel_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "user_name": f"{review.user.first_name} {review.user.last_name}" if review.user else "Anonymous"
        }
        for review in reviews
    ]
    
    return HotelDetailResponse(
        id=hotel.id,
        name=hotel.name,
        description=hotel.description,
        city=hotel.city,
        country=hotel.country,
        address=hotel.address,
        price_per_night=hotel.price_per_night,
        rating=hotel.rating,
        image_url=hotel.image_url,
        available_rooms=hotel.available_rooms,
        created_at=hotel.created_at,
        rooms=rooms,
        reviews=review_responses,
        amenities=amenities,
        average_rating=avg_rating if avg_rating > 0 else hotel.rating
    )


@router.get("/{hotel_id}/related", response_model=List[RelatedHotelResponse])
async def get_related_hotels(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    """
    Get related hotels in the same city (excluding the current hotel)
    """
    current_hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    
    if not current_hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    # Get up to 6 related hotels in the same city
    related_hotels = db.query(Hotel).filter(
        Hotel.city == current_hotel.city,
        Hotel.id != hotel_id
    ).limit(6).all()
    
    return related_hotels


@router.get("/{hotel_id}/rooms", response_model=List[dict])
async def get_hotel_rooms(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all rooms for a specific hotel
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    rooms = db.query(Room).filter(Room.hotel_id == hotel_id).all()
    
    return [
        {
            "id": room.id,
            "hotel_id": room.hotel_id,
            "room_type": room.room_type,
            "description": room.description,
            "price": room.price,
            "capacity": room.capacity,
            "available_rooms": room.available_rooms,
            "image_url": room.image_url,
            "created_at": room.created_at
        }
        for room in rooms
    ]


@router.get("/{hotel_id}/reviews", response_model=List[dict])
async def get_hotel_reviews(
    hotel_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get paginated reviews for a specific hotel
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    reviews = db.query(Review).filter(
        Review.hotel_id == hotel_id
    ).offset(skip).limit(limit).all()
    
    return [
        {
            "id": review.id,
            "user_id": review.user_id,
            "hotel_id": review.hotel_id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "user_name": f"{review.user.first_name} {review.user.last_name}" if review.user else "Anonymous"
        }
        for review in reviews
    ]


@router.get("/{hotel_id}/stats", response_model=dict)
async def get_hotel_stats(
    hotel_id: int,
    db: Session = Depends(get_db)
):
    """
    Get statistics for a hotel:
    - Total reviews
    - Average rating
    - Total bookings
    """
    hotel = db.query(Hotel).filter(Hotel.id == hotel_id).first()
    
    if not hotel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Hotel not found"
        )
    
    reviews = db.query(Review).filter(Review.hotel_id == hotel_id).all()
    avg_rating = calculate_average_rating(reviews)
    
    return {
        "hotel_id": hotel_id,
        "hotel_name": hotel.name,
        "total_reviews": len(reviews),
        "average_rating": avg_rating if avg_rating > 0 else hotel.rating,
        "total_rooms": db.query(Room).filter(Room.hotel_id == hotel_id).count(),
        "available_rooms": hotel.available_rooms
    }
