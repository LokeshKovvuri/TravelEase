from datetime import date

from sqlalchemy.orm import Session

from app.models.booking import Booking
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository
from app.schemas.booking import BookingCreate, BookingUpdate


class BookingService:

    @staticmethod
    def create(db: Session, user_id: int, data: BookingCreate):

        room = RoomRepository.get_by_id(db, data.room_id)

        if room is None:
            raise Exception("Room not found")

        if data.check_out <= data.check_in:
            raise Exception("Check-out date must be after check-in date")

        if data.guests > room.capacity:
            raise Exception("Guests exceed room capacity")

        if room.available_rooms <= 0:
            raise Exception("No rooms available")

        nights = (data.check_out - data.check_in).days
        total_price = nights * room.price

        booking = Booking(
            user_id=user_id,
            room_id=data.room_id,
            check_in=data.check_in,
            check_out=data.check_out,
            guests=data.guests,
            total_price=total_price,
            status="CONFIRMED",
        )

        room.available_rooms -= 1
        RoomRepository.update(db, room)

        return BookingRepository.create(db, booking)

    @staticmethod
    def get_all(db: Session):
        return BookingRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, booking_id: int):

        booking = BookingRepository.get_by_id(db, booking_id)

        if booking is None:
            raise Exception("Booking not found")

        return booking

    @staticmethod
    def update(db: Session, booking_id: int, data: BookingUpdate):

        booking = BookingRepository.get_by_id(db, booking_id)

        if booking is None:
            raise Exception("Booking not found")

        booking.check_in = data.check_in
        booking.check_out = data.check_out
        booking.guests = data.guests
        booking.status = data.status

        return BookingRepository.update(db, booking)

    @staticmethod
    def delete(db: Session, booking_id: int):

        booking = BookingRepository.get_by_id(db, booking_id)

        if booking is None:
            raise Exception("Booking not found")

        room = RoomRepository.get_by_id(db, booking.room_id)

        if room:
            room.available_rooms += 1
            RoomRepository.update(db, room)

        BookingRepository.delete(db, booking)

        return {
            "message": "Booking cancelled successfully"
        }