from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.models.booking import Booking


class PaymentRepository:

    @staticmethod
    def create(
        db: Session,
        payment: Payment,
    ):
        db.add(payment)
        db.commit()
        db.refresh(payment)

        return payment


    @staticmethod
    def get_all(
        db: Session,
    ):

        return (
            db.query(Payment)
            .order_by(
                Payment.created_at.desc()
            )
            .all()
        )


    @staticmethod
    def get_by_id(
        db: Session,
        payment_id: int,
    ):

        return (
            db.query(Payment)
            .filter(
                Payment.id == payment_id
            )
            .first()
        )


    @staticmethod
    def get_by_booking_id(
        db: Session,
        booking_id: int,
    ):

        return (
            db.query(Payment)
            .filter(
                Payment.booking_id == booking_id
            )
            .first()
        )

    @staticmethod
    def get_by_id_for_update(
        db: Session,
        payment_id: int,
    ):
        return (
            db.query(Payment)
            .filter(Payment.id == payment_id)
            .with_for_update()
            .first()
        )

    @staticmethod
    def get_by_booking_id_for_update(
        db: Session,
        booking_id: int,
    ):
        return (
            db.query(Payment)
            .filter(Payment.booking_id == booking_id)
            .with_for_update()
            .first()
        )


    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: int,
    ):

        return (
            db.query(Payment)
            .join(
                Booking,
                Payment.booking_id == Booking.id
            )
            .filter(
                Booking.user_id == user_id
            )
            .order_by(
                Payment.created_at.desc()
            )
            .all()
        )


    @staticmethod
    def update(
        db: Session,
        payment: Payment,
    ):

        db.commit()
        db.refresh(payment)

        return payment


    @staticmethod
    def delete(
        db: Session,
        payment: Payment,
    ):

        db.delete(payment)
        db.commit()
