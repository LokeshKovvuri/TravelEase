from sqlalchemy.orm import Session

from app.models.room import Room


class RoomRepository:

    @staticmethod
    def create(
        db: Session,
        room: Room,
    ):
        db.add(room)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def get_all(
        db: Session,
    ):
        return db.query(Room).all()

    @staticmethod
    def get_by_hotel_id(
        db: Session,
        hotel_id: int,
    ):
        return (
            db.query(Room)
            .filter(Room.hotel_id == hotel_id)
            .order_by(Room.price.asc(), Room.id.asc())
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        room_id: int,
    ):
        return (
            db.query(Room)
            .filter(Room.id == room_id)
            .first()
        )

    @staticmethod
    def get_by_id_for_update(
        db: Session,
        room_id: int,
    ):
        """Lock inventory while checking and creating a hotel booking."""
        return (
            db.query(Room)
            .filter(Room.id == room_id)
            .with_for_update()
            .first()
        )

    @staticmethod
    def update(
        db: Session,
        room: Room,
    ):
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def delete(
        db: Session,
        room: Room,
    ):
        db.delete(room)
        db.commit()
