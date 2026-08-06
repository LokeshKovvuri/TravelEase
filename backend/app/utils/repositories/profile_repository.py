from sqlalchemy.orm import Session

from app.models.user import User
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.review import Review


class ProfileRepository:

    @staticmethod
    def get_by_id(db: Session, user_id: int):
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def update(db: Session, user: User):
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def get_bookings(db: Session, user_id: int):
        return (
            db.query(Booking)
            .filter(Booking.user_id == user_id)
            .all()
        )

    @staticmethod
    def get_payments(db: Session, user_id: int):
        return (
            db.query(Payment)
            .join(Booking, Booking.id == Payment.booking_id)
            .filter(Booking.user_id == user_id)
            .all()
        )

    @staticmethod
    def get_reviews(db: Session, user_id: int):
        return (
            db.query(Review)
            .filter(Review.user_id == user_id)
            .all()
        )