from datetime import date

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