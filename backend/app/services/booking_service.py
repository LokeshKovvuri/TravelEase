from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository
from app.schemas.booking import BookingCreate, BookingUpdate


class BookingService:

    @staticmethod
    def create(
        db: Session,
        user_id: int,
        data: BookingCreate,
    ):
        # -----------------------------------------
        # 1. Validate dates
        # -----------------------------------------

        if data.check_out <= data.check_in:
            raise Exception(
                "Check-out date must be after check-in date"
            )

        # -----------------------------------------
        # 2. Validate guests
        # -----------------------------------------

        if data.guests < 1:
            raise Exception(
                "At least one guest is required"
            )

        # -----------------------------------------
        # 3. Find room
        # -----------------------------------------

        room = RoomRepository.get_by_id(
            db,
            data.room_id,
        )

        if room is None:
            raise Exception("Room not found")

        # -----------------------------------------
        # 4. Validate room capacity
        # -----------------------------------------

        if data.guests > room.capacity:
            raise Exception(
                f"This room can accommodate a maximum "
                f"of {room.capacity} guests"
            )

        # -----------------------------------------
        # 5. Check room availability
        # -----------------------------------------

        if room.available_rooms <= 0:
            raise Exception(
                "No rooms currently available"
            )

        # -----------------------------------------
        # 6. Check overlapping bookings
        # -----------------------------------------

        overlapping_booking = (
            BookingRepository.get_overlapping_booking(
                db=db,
                room_id=data.room_id,
                check_in=data.check_in,
                check_out=data.check_out,
            )
        )

        if overlapping_booking:
            raise Exception(
                "This room is already booked for "
                "the selected dates"
            )

        # -----------------------------------------
        # 7. Calculate number of nights
        # -----------------------------------------

        nights = (
            data.check_out - data.check_in
        ).days

        # -----------------------------------------
        # 8. Calculate total price
        # -----------------------------------------

        total_price = nights * room.price

        # -----------------------------------------
        # 9. Create booking
        # -----------------------------------------

        booking = Booking(
            user_id=user_id,
            room_id=data.room_id,
            check_in=data.check_in,
            check_out=data.check_out,
            guests=data.guests,
            total_price=total_price,
            status="PENDING_PAYMENT",
        )

        # -----------------------------------------
        # 10. Reduce available rooms
        # -----------------------------------------

        room.available_rooms -= 1

        db.add(booking)

        # -----------------------------------------
        # 11. Single database transaction
        # -----------------------------------------

        try:
            db.commit()

            db.refresh(booking)

            return booking

        except Exception:
            db.rollback()
            raise Exception(
                "Unable to create booking"
            )

    # ---------------------------------------------
    # GET ALL BOOKINGS
    # ---------------------------------------------

    @staticmethod
    def get_all(db: Session):

        return BookingRepository.get_all(db)

    # ---------------------------------------------
    # GET USER BOOKINGS
    # ---------------------------------------------

    @staticmethod
    def get_user_bookings(
        db: Session,
        user_id: int,
    ):

        return BookingRepository.get_by_user_id(
            db,
            user_id,
        )

    # ---------------------------------------------
    # GET BOOKING
    # ---------------------------------------------

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

    # ---------------------------------------------
    # UPDATE BOOKING
    # ---------------------------------------------

    @staticmethod
    def update(
        db: Session,
        booking_id: int,
        data: BookingUpdate,
    ):

        booking = BookingRepository.get_by_id(
            db,
            booking_id,
        )

        if booking is None:
            raise Exception(
                "Booking not found"
            )

        if data.check_out <= data.check_in:
            raise Exception(
                "Check-out date must be after check-in date"
            )

        if data.guests < 1:
            raise Exception(
                "At least one guest is required"
            )

        room = RoomRepository.get_by_id(
            db,
            booking.room_id,
        )

        if room is None:
            raise Exception(
                "Room not found"
            )

        if data.guests > room.capacity:
            raise Exception(
                f"This room can accommodate a maximum "
                f"of {room.capacity} guests"
            )

        nights = (
            data.check_out - data.check_in
        ).days

        booking.check_in = data.check_in
        booking.check_out = data.check_out
        booking.guests = data.guests
        booking.total_price = nights * room.price
        booking.status = data.status

        try:
            db.commit()
            db.refresh(booking)

            return booking

        except Exception:
            db.rollback()
            raise Exception(
                "Unable to update booking"
            )

    # ---------------------------------------------
    # DELETE / CANCEL BOOKING
    # ---------------------------------------------

    @staticmethod
    def delete(
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

        room = RoomRepository.get_by_id(
            db,
            booking.room_id,
        )

        if room:
            room.available_rooms += 1

        try:
            db.delete(booking)

            db.commit()

            return {
                "message":
                    "Booking cancelled successfully"
            }

        except Exception:
            db.rollback()

            raise Exception(
                "Unable to cancel booking"
            )