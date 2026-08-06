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

    @staticmethod
    def search(
        db: Session,
        city=None,
        country=None,
        min_price=None,
        max_price=None,
        rating=None,
        page=1,
        limit=10,
    ):
        query = db.query(Hotel)

        if city:
            query = query.filter(Hotel.city.ilike(f"%{city}%"))

        if country:
            query = query.filter(Hotel.country.ilike(f"%{country}%"))

        if min_price is not None:
            query = query.filter(Hotel.price_per_night >= min_price)

        if max_price is not None:
            query = query.filter(Hotel.price_per_night <= max_price)

        if rating is not None:
            query = query.filter(Hotel.rating >= rating)

        return (
            query.offset((page - 1) * limit)
                 .limit(limit)
                 .all()
        ) 