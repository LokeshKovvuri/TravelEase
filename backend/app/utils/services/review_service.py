from sqlalchemy.orm import Session

from app.models.review import Review
from app.repositories.review_repository import ReviewRepository
from app.repositories.booking_repository import BookingRepository
from app.repositories.hotel_repository import HotelRepository
from app.schemas.review import ReviewCreate, ReviewUpdate


class ReviewService:

    @staticmethod
    def create(db: Session, data: ReviewCreate):

        # Check booking exists
        booking = BookingRepository.get_by_id(db, data.booking_id)

        if booking is None:
            raise Exception("Booking not found")

        # Booking must be confirmed
        if booking.status != "CONFIRMED":
            raise Exception("Only confirmed bookings can be reviewed")

        # One review per booking
        existing_review = ReviewRepository.get_by_booking(
            db,
            data.booking_id,
        )

        if existing_review:
            raise Exception("Review already exists for this booking")

        review = Review(
            user_id=booking.user_id,
            hotel_id=booking.room.hotel_id,
            booking_id=booking.id,
            rating=data.rating,
            comment=data.comment,
        )

        review = ReviewRepository.create(db, review)

        # Update hotel rating
        ReviewService.update_hotel_rating(
            db,
            booking.room.hotel_id,
        )

        return review

    @staticmethod
    def get_all(db: Session):
        return ReviewRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, review_id: int):

        review = ReviewRepository.get_by_id(db, review_id)

        if review is None:
            raise Exception("Review not found")

        return review

    @staticmethod
    def update(
        db: Session,
        review_id: int,
        data: ReviewUpdate,
    ):

        review = ReviewRepository.get_by_id(db, review_id)

        if review is None:
            raise Exception("Review not found")

        review.rating = data.rating
        review.comment = data.comment

        review = ReviewRepository.update(db, review)

        ReviewService.update_hotel_rating(
            db,
            review.hotel_id,
        )

        return review

    @staticmethod
    def delete(db: Session, review_id: int):

        review = ReviewRepository.get_by_id(db, review_id)

        if review is None:
            raise Exception("Review not found")

        hotel_id = review.hotel_id

        ReviewRepository.delete(db, review)

        ReviewService.update_hotel_rating(
            db,
            hotel_id,
        )

        return {
            "message": "Review deleted successfully"
        }

    @staticmethod
    def update_hotel_rating(
        db: Session,
        hotel_id: int,
    ):

        reviews = (
            db.query(Review)
            .filter(Review.hotel_id == hotel_id)
            .all()
        )

        hotel = HotelRepository.get_by_id(db, hotel_id)

        if not reviews:
            hotel.rating = 0
        else:
            hotel.rating = round(
                sum(r.rating for r in reviews) / len(reviews),
                1,
            )

        db.commit()