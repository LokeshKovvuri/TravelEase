from sqlalchemy.orm import Session

from app.models.room import Room
from app.repositories.room_repository import RoomRepository
from app.repositories.hotel_repository import HotelRepository
from app.schemas.room import RoomCreate, RoomUpdate


class RoomService:

    @staticmethod
    def create(db: Session, room: RoomCreate):

        hotel = HotelRepository.get_by_id(db, room.hotel_id)

        if not hotel:
            raise Exception("Hotel not found")

        new_room = Room(
            hotel_id=room.hotel_id,
            room_type=room.room_type,
            description=room.description,
            price=room.price,
            capacity=room.capacity,
            available_rooms=room.available_rooms,
            image_url=room.image_url,
        )

        return RoomRepository.create(db, new_room)

    @staticmethod
    def get_all(db: Session):
        return RoomRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, room_id: int):

        room = RoomRepository.get_by_id(db, room_id)

        if not room:
            raise Exception("Room not found")

        return room

    @staticmethod
    def update(db: Session, room_id: int, data: RoomUpdate):

        room = RoomRepository.get_by_id(db, room_id)

        if not room:
            raise Exception("Room not found")

        room.room_type = data.room_type
        room.description = data.description
        room.price = data.price
        room.capacity = data.capacity
        room.available_rooms = data.available_rooms
        room.image_url = data.image_url

        return RoomRepository.update(db, room)

    @staticmethod
    def delete(db: Session, room_id: int):

        room = RoomRepository.get_by_id(db, room_id)

        if not room:
            raise Exception("Room not found")

        RoomRepository.delete(db, room)

        return {
            "message": "Room deleted successfully"
        }