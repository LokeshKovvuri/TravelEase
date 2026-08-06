import uuid

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.repositories.payment_repository import PaymentRepository
from app.repositories.booking_repository import BookingRepository
from app.schemas.payment import PaymentCreate, PaymentUpdate


class PaymentService:

    @staticmethod
    def create(db: Session, data: PaymentCreate):

        # Check booking exists
        booking = BookingRepository.get_by_id(
            db,
            data.booking_id
        )

        if booking is None:
            raise Exception("Booking not found")

        # Prevent duplicate payment
        existing_payment = PaymentRepository.get_by_booking_id(
            db,
            data.booking_id
        )

        if existing_payment:
            raise Exception("Payment already exists for this booking")

        # Generate transaction ID
        transaction_id = str(uuid.uuid4())

        payment = Payment(
            booking_id=data.booking_id,
            amount=booking.total_price,
            payment_method=data.payment_method,
            transaction_id=transaction_id,
            status="SUCCESS",
        )

        # Update booking status
        booking.status = "CONFIRMED"
        db.commit()

        return PaymentRepository.create(db, payment)

    @staticmethod
    def get_all(db: Session):
        return PaymentRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, payment_id: int):

        payment = PaymentRepository.get_by_id(
            db,
            payment_id
        )

        if payment is None:
            raise Exception("Payment not found")

        return payment

    @staticmethod
    def update(
        db: Session,
        payment_id: int,
        data: PaymentUpdate,
    ):

        payment = PaymentRepository.get_by_id(
            db,
            payment_id
        )

        if payment is None:
            raise Exception("Payment not found")

        payment.status = data.status

        return PaymentRepository.update(
            db,
            payment
        )

    @staticmethod
    def delete(
        db: Session,
        payment_id: int,
    ):

        payment = PaymentRepository.get_by_id(
            db,
            payment_id
        )

        if payment is None:
            raise Exception("Payment not found")

        PaymentRepository.delete(
            db,
            payment
        )

        return {
            "message": "Payment deleted successfully"
        }