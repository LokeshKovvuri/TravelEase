from datetime import date

from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.room import Room
from app.repositories.booking_repository import BookingRepository
from app.repositories.room_repository import RoomRepository
from app.repositories.hotel_repository import HotelRepository
from app.schemas.room import RoomCreate, RoomUpdate


class RoomService:

    @staticmethod
    def create(db: Session, room: RoomCreate):

        hotel = HotelRepository.get_by_id(
            db,
            room.hotel_id,
        )

        if not hotel:
            raise Exception("Hotel not found")

        new_room = Room(
            hotel_id=room.hotel_id,
            room_type=room.room_type,
            description=room.description,
            price=room.price,
            capacity=room.capacity,
            available_rooms=room.available_rooms,
            total_rooms=room.total_rooms or room.available_rooms,
            image_url=room.image_url,
            room_number=room.room_number,
            status=room.status,
        )

        return RoomRepository.create(
            db,
            new_room,
        )

    @staticmethod
    def get_all(db: Session, hotel_id: int | None = None):
        if hotel_id is not None:
            return RoomRepository.get_by_hotel_id(db, hotel_id)
        return RoomRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        room_id: int,
    ):

        room = RoomRepository.get_by_id(
            db,
            room_id,
        )

        if not room:
            raise Exception("Room not found")

        return room

    @staticmethod
    def get_availability(
        db: Session,
        room_id: int,
        check_in: date,
        check_out: date,
    ):
        """Return date-specific room inventory, including active payment holds."""
        if check_out <= check_in:
            raise Exception("Check-out date must be after check-in date")

        room = RoomService.get_by_id(db, room_id)
        total_rooms = room.total_rooms or room.available_rooms
        reserved_rooms = BookingRepository.count_active_overlapping_bookings(
            db,
            room_id,
            check_in,
            check_out,
            payment_hold_minutes=settings.payment_hold_minutes,
        )

        return {
            "room_id": room.id,
            "check_in": check_in,
            "check_out": check_out,
            "total_rooms": total_rooms,
            "reserved_rooms": reserved_rooms,
            "available_rooms": max(0, total_rooms - reserved_rooms),
        }

    @staticmethod
    def update(
        db: Session,
        room_id: int,
        data: RoomUpdate,
    ):

        room = RoomRepository.get_by_id(
            db,
            room_id,
        )

        if not room:
            raise Exception("Room not found")

        room.room_type = data.room_type
        room.description = data.description
        room.price = data.price
        room.capacity = data.capacity
        room.available_rooms = data.available_rooms
        room.total_rooms = data.total_rooms or data.available_rooms
        room.image_url = data.image_url
        room.room_number = data.room_number
        room.status = data.status

        return RoomRepository.update(
            db,
            room,
        )

    @staticmethod
    def delete(
        db: Session,
        room_id: int,
    ):

        room = RoomRepository.get_by_id(
            db,
            room_id,
        )

        if not room:
            raise Exception("Room not found")

        RoomRepository.delete(
            db,
            room,
        )

        return {
            "message": "Room deleted successfully"
        }
