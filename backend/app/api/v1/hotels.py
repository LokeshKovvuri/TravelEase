from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.schemas.hotel import HotelCreate, HotelResponse
from app.services.hotel_service import HotelService

from app.schemas.hotel import (
    HotelCreate,
    HotelResponse,
    NearbyHotelResponse,
)

router = APIRouter(
    prefix="/api/v1/hotels",
    tags=["Hotels"],
)


# ============================================================
# CREATE HOTEL
# ============================================================

@router.post(
    "/",
    response_model=HotelResponse,
)
def create_hotel(
    hotel: HotelCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):
    try:
        return HotelService.create(db, hotel)

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# GET ALL HOTELS
# ============================================================

@router.get(
    "/",
    response_model=list[HotelResponse],
)
def get_hotels(
    db: Session = Depends(get_db),
):
    return HotelService.get_all(db)


# ============================================================
# SEARCH / FILTER HOTELS
# ============================================================

@router.get(
    "/search",
    response_model=list[HotelResponse],
)
def search_hotels(
    city: Optional[str] = Query(
        default=None,
        description="Filter hotels by city",
    ),
    country: Optional[str] = Query(
        default=None,
        description="Filter hotels by country",
    ),
    min_price: Optional[float] = Query(
        default=None,
        ge=0,
        description="Minimum hotel price",
    ),
    max_price: Optional[float] = Query(
        default=None,
        ge=0,
        description="Maximum hotel price",
    ),
    rating: Optional[float] = Query(
        default=None,
        ge=0,
        le=5,
        description="Minimum hotel rating",
    ),
    page: int = Query(
        default=1,
        ge=1,
        description="Page number",
    ),
    limit: int = Query(
        default=10,
        ge=1,
        le=100,
        description="Number of hotels per page",
    ),
    db: Session = Depends(get_db),
):
    return HotelService.search(
        db=db,
        city=city,
        country=country,
        min_price=min_price,
        max_price=max_price,
        rating=rating,
        page=page,
        limit=limit,
    )

# ============================================================
# GET NEARBY HOTELS
# ============================================================

@router.get(
    "/nearby",
    response_model=list[NearbyHotelResponse],
)

def get_nearby_hotels(
    latitude: float = Query(
        ...,
        description="User latitude",
        ge=-90,
        le=90,
    ),
    longitude: float = Query(
        ...,
        description="User longitude",
        ge=-180,
        le=180,
    ),
    radius_km: float = Query(
        default=25,
        gt=0,
        le=200,
        description="Search radius in kilometers",
    ),
    db: Session = Depends(get_db),
):
    return HotelService.get_nearby(
        db=db,
        latitude=latitude,
        longitude=longitude,
        radius_km=radius_km,
    )





# ============================================================
# GET HOTEL BY ID
# ============================================================

@router.get(
    "/{hotel_id}",
    response_model=HotelResponse,
)
def get_hotel(
    hotel_id: int,
    db: Session = Depends(get_db),
):
    hotel = HotelService.get_by_id(
        db,
        hotel_id,
    )

    if hotel is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found",
        )

    return hotel


# ============================================================
# UPDATE HOTEL
# ============================================================

@router.put(
    "/{hotel_id}",
    response_model=HotelResponse,
)
def update_hotel(
    hotel_id: int,
    hotel: HotelCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):
    updated = HotelService.update(
        db,
        hotel_id,
        hotel,
    )

    if updated is None:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found",
        )

    return updated


# ============================================================
# DELETE HOTEL
# ============================================================

@router.delete(
    "/{hotel_id}",
)
def delete_hotel(
    hotel_id: int,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):
    deleted = HotelService.delete(
        db,
        hotel_id,
    )

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Hotel not found",
        )

    return {
        "message": "Hotel deleted successfully",
    }
