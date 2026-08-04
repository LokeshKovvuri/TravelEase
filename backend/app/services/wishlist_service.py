from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models.user import User
from app.models.wishlist import Wishlist
from app.repositories.hotel_repository import HotelRepository
from app.repositories.wishlist_repository import WishlistRepository
from app.schemas.wishlist import WishlistCreate


class WishlistService:

    @staticmethod
    def add_to_wishlist(
        db: Session,
        current_user: User,
        data: WishlistCreate,
    ):

        hotel = HotelRepository.get_by_id(
            db,
            data.hotel_id,
        )

        if hotel is None:
            raise HTTPException(
                status_code=404,
                detail="Hotel not found",
            )

        existing = WishlistRepository.get_by_user_and_hotel(
            db,
            current_user.id,
            data.hotel_id,
        )

        if existing:
            raise HTTPException(
                status_code=400,
                detail="Hotel already exists in wishlist",
            )

        wishlist = Wishlist(
            user_id=current_user.id,
            hotel_id=data.hotel_id,
        )

        return WishlistRepository.create(
            db,
            wishlist,
        )

    @staticmethod
    def get_wishlist(
        db: Session,
        current_user: User,
    ):
        return WishlistRepository.get_all(
            db,
            current_user.id,
        )

    @staticmethod
    def remove_from_wishlist(
        db: Session,
        current_user: User,
        hotel_id: int,
    ):

        wishlist = WishlistRepository.get_by_user_and_hotel(
            db,
            current_user.id,
            hotel_id,
        )

        if wishlist is None:
            raise HTTPException(
                status_code=404,
                detail="Hotel not found in wishlist",
            )

        WishlistRepository.delete(
            db,
            wishlist,
        )

        return {
            "message": "Hotel removed from wishlist"
        }