from sqlalchemy.orm import Session

from app.models.room import Room


class RoomRepository:

    @staticmethod
    def create(db: Session, room: Room):
        db.add(room)
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def get_all(db: Session):
        return db.query(Room).all()

    @staticmethod
    def get_by_id(db: Session, room_id: int):
        return db.query(Room).filter(Room.id == room_id).first()

    @staticmethod
    def update(db: Session, room: Room):
        db.commit()
        db.refresh(room)
        return room

    @staticmethod
    def delete(db: Session, room: Room):
        db.delete(room)
        db.commit()