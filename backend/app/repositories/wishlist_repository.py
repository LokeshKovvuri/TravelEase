from sqlalchemy.orm import Session, joinedload

from app.models.wishlist import Wishlist


class WishlistRepository:

    @staticmethod
    def get_by_user_and_hotel(
        db: Session,
        user_id: int,
        hotel_id: int,
    ):
        return (
            db.query(Wishlist)
            .filter(
                Wishlist.user_id == user_id,
                Wishlist.hotel_id == hotel_id,
            )
            .first()
        )

    @staticmethod
    def create(
        db: Session,
        wishlist: Wishlist,
    ):
        db.add(wishlist)
        db.commit()
        db.refresh(wishlist)
        return wishlist

    @staticmethod
    def get_all(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Wishlist)
            .options(joinedload(Wishlist.hotel))
            .filter(Wishlist.user_id == user_id)
            .order_by(Wishlist.created_at.desc())
            .all()
        )

    @staticmethod
    def delete(
        db: Session,
        wishlist: Wishlist,
    ):
        db.delete(wishlist)
        db.commit()
