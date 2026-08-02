from sqlalchemy.orm import Session

from app.models.hotel import Hotel


class HotelRepository:

    @staticmethod
    def create(db: Session, hotel: Hotel):
        db.add(hotel)
        db.commit()
        db.refresh(hotel)
        return hotel

    @staticmethod
    def get_all(db: Session):
        return db.query(Hotel).all()

    @staticmethod
    def get_by_id(db: Session, hotel_id: int):
        return db.query(Hotel).filter(Hotel.id == hotel_id).first()

    @staticmethod
    def update(db: Session, hotel):
        db.commit()
        db.refresh(hotel)
        return hotel


    @staticmethod
    def delete(db: Session, hotel):
        db.delete(hotel)
        db.commit()