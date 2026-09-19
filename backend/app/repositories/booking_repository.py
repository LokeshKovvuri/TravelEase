from datetime import date

from datetime import datetime, timedelta, UTC

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.models.booking import Booking


class BookingRepository:

    # ============================================================
    # CREATE BOOKING
    # ============================================================

    @staticmethod
    def create(
        db: Session,
        booking: Booking,
    ):
        db.add(booking)

        db.commit()

        db.refresh(booking)

        return booking

    # ============================================================
    # GET ALL BOOKINGS
    # ============================================================

    @staticmethod
    def get_all(
        db: Session,
    ):
        return (
            db.query(Booking)
            .order_by(
                Booking.created_at.desc()
            )
            .all()
        )

    # ============================================================
    # GET BOOKINGS BY USER
    # ============================================================

    @staticmethod
    def get_by_user_id(
        db: Session,
        user_id: int,
    ):
        return (
            db.query(Booking)
            .filter(
                Booking.user_id == user_id
            )
            .order_by(
                Booking.created_at.desc()
            )
            .all()
        )

    # ============================================================
    # GET BOOKING BY ID
    # ============================================================

    @staticmethod
    def get_by_id(
        db: Session,
        booking_id: int,
    ):
        return (
            db.query(Booking)
            .filter(
                Booking.id == booking_id
            )
            .first()
        )

    @staticmethod
    def get_by_id_for_update(
        db: Session,
        booking_id: int,
    ):
        return (
            db.query(Booking)
            .filter(Booking.id == booking_id)
            .with_for_update()
            .first()
        )

    # ============================================================
    # CHECK OVERLAPPING BOOKING
    # ============================================================

    @staticmethod
    def get_overlapping_booking(
        db: Session,
        room_id: int,
        check_in: date,
        check_out: date,
    ):
        return (
            db.query(Booking)
            .filter(
                Booking.room_id == room_id,

                Booking.status == "CONFIRMED",

                Booking.check_in < check_out,

                Booking.check_out > check_in,
            )
            .first()
        )

    @staticmethod
    def count_active_overlapping_bookings(
        db: Session,
        room_id: int,
        check_in: date,
        check_out: date,
        exclude_booking_id: int | None = None,
        payment_hold_minutes: int = 15,
    ) -> int:
        """Count confirmed rooms plus short-lived payment holds for a stay."""
        hold_cutoff = datetime.now(UTC) - timedelta(
            minutes=payment_hold_minutes
        )
        query = db.query(Booking).filter(
            Booking.room_id == room_id,
            Booking.check_in < check_out,
            Booking.check_out > check_in,
            or_(
                Booking.status == "CONFIRMED",
                and_(
                    Booking.status == "PENDING_PAYMENT",
                    Booking.created_at >= hold_cutoff,
                ),
            ),
        )
        if exclude_booking_id is not None:
            query = query.filter(Booking.id != exclude_booking_id)
        return query.count()

    @staticmethod
    def get_expired_flight_payment_holds_for_update(
        db: Session,
        flight_id: int,
        payment_hold_minutes: int,
    ) -> list[Booking]:
        hold_cutoff = datetime.now(UTC) - timedelta(
            minutes=payment_hold_minutes
        )
        return (
            db.query(Booking)
            .filter(
                Booking.flight_id == flight_id,
                Booking.status == "PENDING_PAYMENT",
                Booking.created_at < hold_cutoff,
            )
            .with_for_update()
            .all()
        )

    # ============================================================
    # UPDATE BOOKING
    # ============================================================

    @staticmethod
    def update(
        db: Session,
        booking: Booking,
    ):
        db.commit()

        db.refresh(booking)

        return booking

    # ============================================================
    # DELETE BOOKING
    # ============================================================

    @staticmethod
    def delete(
        db: Session,
        booking: Booking,
    ):
        db.delete(booking)

        db.commit()
