import uuid

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.repositories.payment_repository import PaymentRepository
from app.repositories.booking_repository import BookingRepository
from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
)


class PaymentService:

    # ========================================================
    # CREATE PAYMENT
    # ========================================================

    @staticmethod
    def create(
        db: Session,
        data: PaymentCreate,
        user_id: int,
    ):

        # ----------------------------------------------------
        # 1. Find booking
        # ----------------------------------------------------

        booking = BookingRepository.get_by_id(
            db,
            data.booking_id,
        )

        if booking is None:
            raise Exception(
                "Booking not found"
            )

        # ----------------------------------------------------
        # 2. Ownership check
        # ----------------------------------------------------

        if booking.user_id != user_id:
            raise Exception(
                "You are not allowed to pay for this booking"
            )

        # ----------------------------------------------------
        # 3. Check existing payment
        # ----------------------------------------------------

        existing_payment = (
            PaymentRepository.get_by_booking_id(
                db,
                data.booking_id,
            )
        )

        if existing_payment:
            raise Exception(
                "Payment already exists for this booking"
            )

        # ----------------------------------------------------
        # 4. Validate payment method
        # ----------------------------------------------------

        allowed_methods = [
            "CARD",
            "UPI",
            "NET_BANKING",
            "WALLET",
        ]

        payment_method = (
            data.payment_method
            .strip()
            .upper()
        )

        if payment_method not in allowed_methods:
            raise Exception(
                "Invalid payment method"
            )

        # ----------------------------------------------------
        # 5. Generate transaction ID
        # ----------------------------------------------------

        transaction_id = str(
            uuid.uuid4()
        )

        # ----------------------------------------------------
        # 6. Create payment
        # ----------------------------------------------------

        payment = Payment(
            booking_id=booking.id,
            amount=booking.total_price,
            payment_method=payment_method,
            transaction_id=transaction_id,
            status="SUCCESS",
        )

        # ----------------------------------------------------
        # 7. Confirm booking after successful payment
        # ----------------------------------------------------

        booking.status = "CONFIRMED"

        try:

            db.add(payment)

            db.commit()

            db.refresh(payment)

            return payment

        except Exception:

            db.rollback()

            raise Exception(
                "Unable to process payment"
            )

    # ========================================================
    # GET MY PAYMENTS
    # ========================================================

    @staticmethod
    def get_user_payments(
        db: Session,
        user_id: int,
    ):

        payments = (
            PaymentRepository.get_by_user_id(
                db,
                user_id,
            )
        )

        return payments

    # ========================================================
    # GET PAYMENT
    # ========================================================

    @staticmethod
    def get_by_id(
        db: Session,
        payment_id: int,
        user_id: int,
    ):

        payment = (
            PaymentRepository.get_by_id(
                db,
                payment_id,
            )
        )

        if payment is None:
            raise Exception(
                "Payment not found"
            )

        if payment.booking.user_id != user_id:
            raise Exception(
                "You are not allowed to access this payment"
            )

        return payment

    # ========================================================
    # UPDATE PAYMENT
    # ========================================================

    @staticmethod
    def update(
        db: Session,
        payment_id: int,
        data: PaymentUpdate,
        user_id: int,
    ):

        payment = (
            PaymentRepository.get_by_id(
                db,
                payment_id,
            )
        )

        if payment is None:
            raise Exception(
                "Payment not found"
            )

        if payment.booking.user_id != user_id:
            raise Exception(
                "You are not allowed to update this payment"
            )

        payment.status = data.status

        return PaymentRepository.update(
            db,
            payment,
        )

    # ========================================================
    # DELETE PAYMENT
    # ========================================================

    @staticmethod
    def delete(
        db: Session,
        payment_id: int,
        user_id: int,
    ):

        payment = (
            PaymentRepository.get_by_id(
                db,
                payment_id,
            )
        )

        if payment is None:
            raise Exception(
                "Payment not found"
            )

        if payment.booking.user_id != user_id:
            raise Exception(
                "You are not allowed to delete this payment"
            )

        PaymentRepository.delete(
            db,
            payment,
        )

        return {
            "message": "Payment deleted successfully"
        }