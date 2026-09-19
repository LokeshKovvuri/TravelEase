import uuid
from datetime import datetime, timedelta, UTC

from sqlalchemy.orm import Session

from app.models.payment import Payment
from app.repositories.booking_repository import BookingRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.flight_repository import FlightRepository
from app.core.config import settings
from app.schemas.payment import PaymentCreate
from app.services.payment_gateway import (
    PaymentGatewayError,
    get_payment_gateway,
)


class PaymentService:
    """Create payment attempts and confirm them only through a gateway."""

    allowed_methods = {"CARD", "UPI", "NET_BANKING", "WALLET"}

    @staticmethod
    def _expire_payment_hold_if_needed(db: Session, booking) -> bool:
        """Expire an abandoned hold and restore a held flight seat once."""
        if booking.created_at is None:
            return False

        created_at = booking.created_at
        if created_at.tzinfo is None:
            created_at = created_at.replace(tzinfo=UTC)
        hold_cutoff = datetime.now(UTC) - timedelta(
            minutes=settings.payment_hold_minutes
        )
        if created_at >= hold_cutoff:
            return False

        if booking.flight_id is not None:
            flight = FlightRepository.get_by_id_for_update(db, booking.flight_id)
            if flight is not None:
                flight.available_seats = min(
                    flight.total_seats,
                    flight.available_seats + booking.guests,
                )
        booking.status = "EXPIRED"
        db.commit()
        return True

    @staticmethod
    def create(
        db: Session,
        data: PaymentCreate,
        user_id: int,
    ):
        # Lock the booking before creating a payment attempt. This makes a
        # double-click or two browser tabs safe.
        booking = BookingRepository.get_by_id_for_update(db, data.booking_id)
        if booking is None:
            raise Exception("Booking not found")
        if booking.user_id != user_id:
            raise Exception("You are not allowed to pay for this booking")
        if booking.status != "PENDING_PAYMENT":
            raise Exception("This booking is no longer awaiting payment")
        if PaymentService._expire_payment_hold_if_needed(db, booking):
            raise Exception(
                "This payment hold has expired. Please create a new booking."
            )

        payment_method = data.payment_method.strip().upper()
        if payment_method not in PaymentService.allowed_methods:
            raise Exception("Invalid payment method")

        existing_payment = PaymentRepository.get_by_booking_id_for_update(
            db,
            booking.id,
        )
        if existing_payment and existing_payment.status == "SUCCESS":
            raise Exception("Payment already exists for this booking")

        payment = existing_payment or Payment(
            booking_id=booking.id,
            # A temporary unique ID lets us flush and obtain the local payment
            # ID before creating the external checkout session.
            transaction_id=f"pending_{uuid.uuid4().hex}",
        )
        payment.amount = booking.total_price
        payment.payment_method = payment_method
        payment.status = "PENDING"
        payment.checkout_url = None
        payment.provider_payment_id = None

        db.add(payment)
        try:
            db.flush()
            checkout = get_payment_gateway().create_checkout(
                payment_id=payment.id,
                booking_id=booking.id,
                amount=booking.total_price,
                description=(
                    f"TravelEase flight booking #{booking.id}"
                    if booking.flight_id is not None
                    else f"TravelEase hotel booking #{booking.id}"
                ),
            )
            payment.provider = checkout.provider
            payment.transaction_id = checkout.transaction_id
            payment.provider_payment_id = checkout.provider_payment_id
            payment.checkout_url = checkout.checkout_url
            payment.status = checkout.status

            # The mock gateway is intentionally the only gateway that can
            # complete synchronously. Stripe is completed by its webhook.
            if checkout.status == "SUCCESS":
                booking.status = "CONFIRMED"

            db.commit()
            db.refresh(payment)
            return payment
        except PaymentGatewayError:
            db.rollback()
            raise
        except Exception:
            db.rollback()
            raise Exception("Unable to create the payment checkout session")

    @staticmethod
    def confirm_stripe_checkout(
        db: Session,
        payment_id: int,
        session: dict,
    ):
        """Apply a verified Stripe completion event idempotently."""
        payment = PaymentRepository.get_by_id_for_update(db, payment_id)
        if payment is None:
            raise Exception("Payment not found")
        if payment.provider != "stripe":
            raise Exception("Payment provider does not match the webhook")
        if payment.status == "SUCCESS":
            return payment, False
        if session.get("payment_status") != "paid":
            raise Exception("Stripe checkout has not been paid")

        booking = BookingRepository.get_by_id_for_update(db, payment.booking_id)
        if booking is None:
            raise Exception("Booking not found")
        if booking.status != "PENDING_PAYMENT":
            raise Exception("This booking is no longer awaiting payment")

        amount_total = session.get("amount_total")
        if amount_total is not None:
            expected_minor = round(payment.amount * 100)
            if amount_total != expected_minor:
                raise Exception("Payment amount does not match the booking")

        payment.status = "SUCCESS"
        payment.provider_payment_id = (
            session.get("payment_intent") or session.get("id")
        )
        payment.transaction_id = session.get("id") or payment.transaction_id
        booking.status = "CONFIRMED"

        try:
            db.commit()
            db.refresh(payment)
            return payment, True
        except Exception:
            db.rollback()
            raise Exception("Unable to confirm payment")

    @staticmethod
    def get_user_payments(db: Session, user_id: int):
        return PaymentRepository.get_by_user_id(db, user_id)

    @staticmethod
    def get_by_id(db: Session, payment_id: int, user_id: int):
        payment = PaymentRepository.get_by_id(db, payment_id)
        if payment is None:
            raise Exception("Payment not found")
        if payment.booking.user_id != user_id:
            raise Exception("You are not allowed to access this payment")
        return payment
