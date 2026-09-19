from datetime import date

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository
from app.repositories.flight_repository import FlightRepository
from app.core.config import settings
from app.schemas.booking import BookingCreate, BookingUpdate


class BookingService:

    # =========================================================
    # CREATE BOOKING
    # =========================================================

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        data: BookingCreate,
    ):
        # -----------------------------------------------------
        # 1. Validate booking type
        # -----------------------------------------------------

        has_room = data.room_id is not None
        has_flight = data.flight_id is not None

        if has_room and has_flight:
            raise Exception(
                "Booking cannot contain both room_id and flight_id"
            )

        if not has_room and not has_flight:
            raise Exception(
                "Either room_id or flight_id is required"
            )

        # -----------------------------------------------------
        # 2. Validate guests
        # -----------------------------------------------------

        if data.guests < 1:
            raise Exception(
                "At least one guest is required"
            )

        # =====================================================
        # HOTEL BOOKING
        # =====================================================

        if has_room:

            # -------------------------------------------------
            # Validate dates
            # -------------------------------------------------

            if data.check_in is None or data.check_out is None:
                raise Exception(
                    "Check-in and check-out dates are required "
                    "for hotel bookings"
                )

            if data.check_out <= data.check_in:
                raise Exception(
                    "Check-out date must be after check-in date"
                )

            if data.check_in < date.today():
                raise Exception("Check-in date cannot be in the past")

            # -------------------------------------------------
            # Find room
            # -------------------------------------------------

            room = RoomRepository.get_by_id_for_update(
                db,
                data.room_id,
            )

            if room is None:
                raise Exception("Room not found")

            # -------------------------------------------------
            # Validate room capacity
            # -------------------------------------------------

            if data.guests > room.capacity:
                raise Exception(
                    f"This room can accommodate a maximum "
                    f"of {room.capacity} guests"
                )

            # -------------------------------------------------
            # Check dated room availability. The room row is locked above,
            # so concurrent requests cannot overbook the same inventory.
            # -------------------------------------------------

            inventory = room.total_rooms or room.available_rooms
            reserved_rooms = (
                BookingRepository.count_active_overlapping_bookings(
                    db=db,
                    room_id=data.room_id,
                    check_in=data.check_in,
                    check_out=data.check_out,
                    payment_hold_minutes=settings.payment_hold_minutes,
                )
            )

            if reserved_rooms >= inventory:
                raise Exception(
                    "No rooms are available for the selected dates"
                )

            # -------------------------------------------------
            # Calculate nights
            # -------------------------------------------------

            nights = (
                data.check_out - data.check_in
            ).days

            # -------------------------------------------------
            # Calculate hotel price
            # -------------------------------------------------

            total_price = nights * room.price

            # -------------------------------------------------
            # Create hotel booking
            # -------------------------------------------------

            booking = Booking(
                user_id=user_id,
                room_id=data.room_id,
                flight_id=None,
                check_in=data.check_in,
                check_out=data.check_out,
                guests=data.guests,
                total_price=total_price,
                status="PENDING_PAYMENT",
            )

        # =====================================================
        # FLIGHT BOOKING
        # =====================================================

        else:

            # -------------------------------------------------
            # Flight booking does not require hotel dates
            # -------------------------------------------------

            flight = FlightRepository.get_by_id_for_update(
                db,
                data.flight_id,
            )

            if flight is None:
                raise Exception("Flight not found")

            # Release seats held by abandoned checkouts before evaluating
            # availability. The flight is locked, so a concurrent request
            # cannot double-release the same reservations.
            expired_holds = (
                BookingRepository.get_expired_flight_payment_holds_for_update(
                    db=db,
                    flight_id=flight.id,
                    payment_hold_minutes=settings.payment_hold_minutes,
                )
            )
            for expired_booking in expired_holds:
                flight.available_seats = min(
                    flight.total_seats,
                    flight.available_seats + expired_booking.guests,
                )
                expired_booking.status = "EXPIRED"

            # -------------------------------------------------
            # Validate flight status
            # -------------------------------------------------

            if flight.status != "SCHEDULED":
                raise Exception(
                    "This flight is not available for booking"
                )

            # -------------------------------------------------
            # Validate available seats
            # -------------------------------------------------

            if flight.available_seats <= 0:
                raise Exception(
                    "No seats are currently available "
                    "on this flight"
                )

            if data.guests > flight.available_seats:
                raise Exception(
                    f"Only {flight.available_seats} seats "
                    f"are available on this flight"
                )

            # -------------------------------------------------
            # Calculate flight price
            #
            # Current BookingCreate schema does not contain
            # cabin class, so Economy is used by default.
            # -------------------------------------------------

            total_price = (
                data.guests * flight.economy_price
            )

            # -------------------------------------------------
            # Create flight booking
            # -------------------------------------------------

            booking = Booking(
                user_id=user_id,
                room_id=None,
                flight_id=data.flight_id,
                check_in=None,
                check_out=None,
                guests=data.guests,
                total_price=total_price,
                status="PENDING_PAYMENT",
            )

            # -------------------------------------------------
            # Reduce available flight seats
            # -------------------------------------------------

            flight.available_seats -= data.guests

        # =====================================================
        # SAVE BOOKING
        # =====================================================

        db.add(booking)

        try:
            db.commit()
            db.refresh(booking)

            return booking

        except Exception:
            db.rollback()

            raise Exception(
                "Unable to create booking"
            )

    # =========================================================
    # GET ALL BOOKINGS
    # =========================================================

    @staticmethod
    def get_all(
        db: Session,
    ):

        return BookingRepository.get_all(db)

    # =========================================================
    # GET USER BOOKINGS
    # =========================================================

    @staticmethod
    def get_user_bookings(
        db: Session,
        user_id: int,
    ):

        return BookingRepository.get_by_user_id(
            db,
            user_id,
        )

    # =========================================================
    # GET BOOKING
    # =========================================================

    @staticmethod
    def get_by_id(
        db: Session,
        booking_id: int,
    ):

        booking = BookingRepository.get_by_id(
            db,
            booking_id,
        )

        if booking is None:
            raise Exception(
                "Booking not found"
            )

        return booking

    # =========================================================
    # UPDATE BOOKING
    # =========================================================

    @staticmethod
    def update(
        db: Session,
        booking_id: int,
        data: BookingUpdate,
    ):

        booking = BookingRepository.get_by_id_for_update(
            db,
            booking_id,
        )

        if booking is None:
            raise Exception(
                "Booking not found"
            )

        if booking.status != "PENDING_PAYMENT":
            raise Exception(
                "Only bookings awaiting payment can be changed"
            )

        # =====================================================
        # HOTEL BOOKING UPDATE
        # =====================================================

        if booking.room_id is not None:

            # -------------------------------------------------
            # Validate dates
            # -------------------------------------------------

            if data.check_in is None or data.check_out is None:
                raise Exception(
                    "Check-in and check-out dates are required "
                    "for hotel bookings"
                )

            if data.check_out <= data.check_in:
                raise Exception(
                    "Check-out date must be after check-in date"
                )

            if data.check_in < date.today():
                raise Exception("Check-in date cannot be in the past")

            if data.guests < 1:
                raise Exception(
                    "At least one guest is required"
                )

            # -------------------------------------------------
            # Find room
            # -------------------------------------------------

            room = RoomRepository.get_by_id_for_update(
                db,
                booking.room_id,
            )

            if room is None:
                raise Exception(
                    "Room not found"
                )

            # -------------------------------------------------
            # Validate capacity
            # -------------------------------------------------

            if data.guests > room.capacity:
                raise Exception(
                    f"This room can accommodate a maximum "
                    f"of {room.capacity} guests"
                )

            inventory = room.total_rooms or room.available_rooms
            reserved_rooms = (
                BookingRepository.count_active_overlapping_bookings(
                    db=db,
                    room_id=booking.room_id,
                    check_in=data.check_in,
                    check_out=data.check_out,
                    exclude_booking_id=booking.id,
                    payment_hold_minutes=settings.payment_hold_minutes,
                )
            )
            if reserved_rooms >= inventory:
                raise Exception(
                    "No rooms are available for the selected dates"
                )

            # -------------------------------------------------
            # Calculate price
            # -------------------------------------------------

            nights = (
                data.check_out - data.check_in
            ).days

            booking.check_in = data.check_in
            booking.check_out = data.check_out
            booking.guests = data.guests
            booking.total_price = nights * room.price

        # =====================================================
        # FLIGHT BOOKING UPDATE
        # =====================================================

        elif booking.flight_id is not None:

            if data.guests < 1:
                raise Exception(
                    "At least one guest is required"
                )

            # -------------------------------------------------
            # Lock flight row
            # -------------------------------------------------

            flight = FlightRepository.get_by_id_for_update(
                db,
                booking.flight_id,
            )

            if flight is None:
                raise Exception(
                    "Flight not found"
                )

            # -------------------------------------------------
            # Calculate seat difference
            # -------------------------------------------------

            old_guests = booking.guests
            new_guests = data.guests

            seat_difference = new_guests - old_guests

            # -------------------------------------------------
            # Increasing passengers
            # -------------------------------------------------

            if seat_difference > 0:

                if flight.available_seats < seat_difference:
                    raise Exception(
                        f"Only {flight.available_seats} additional "
                        f"seats are available"
                    )

                flight.available_seats -= seat_difference

            # -------------------------------------------------
            # Decreasing passengers
            # -------------------------------------------------

            elif seat_difference < 0:

                flight.available_seats += abs(
                    seat_difference
                )

            # -------------------------------------------------
            # Update flight booking
            # -------------------------------------------------

            booking.guests = new_guests

            booking.total_price = (
                new_guests * flight.economy_price
            )

            # Flight bookings do not use hotel dates.
            booking.check_in = None
            booking.check_out = None

        else:

            raise Exception(
                "Invalid booking type"
            )

        # =====================================================
        # SAVE UPDATE
        # =====================================================

        try:
            db.commit()
            db.refresh(booking)

            return booking

        except Exception:
            db.rollback()

            raise Exception(
                "Unable to update booking"
            )

    # =========================================================
    # DELETE / CANCEL BOOKING
    # =========================================================

    @staticmethod
    def delete(
        db: Session,
        booking_id: int,
    ):

        booking = BookingRepository.get_by_id_for_update(
            db,
            booking_id,
        )

        if booking is None:
            raise Exception(
                "Booking not found"
            )

        if booking.status == "CANCELLED":
            raise Exception("Booking is already cancelled")

        if booking.status == "CONFIRMED":
            raise Exception(
                "Confirmed bookings require a refund before cancellation"
            )

        # =====================================================
        # FLIGHT BOOKING
        # =====================================================

        if booking.flight_id is not None:

            flight = FlightRepository.get_by_id_for_update(
                db,
                booking.flight_id,
            )

            if flight:
                flight.available_seats += booking.guests

                # Prevent seats from exceeding aircraft capacity.
                if flight.available_seats > flight.total_seats:
                    flight.available_seats = flight.total_seats

        # =====================================================
        # Cancel in place rather than deleting the booking. This retains the
        # payment audit trail and makes invoice history dependable.
        # =====================================================

        try:

            booking.status = "CANCELLED"

            db.commit()

            return {
                "message": "Booking cancelled successfully"
            }

        except Exception:

            db.rollback()

            raise Exception(
                "Unable to cancel booking"
            )
