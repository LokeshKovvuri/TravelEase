from sqlalchemy.orm import Session

from app.models.hotel import Hotel
from app.repositories.hotel_repository import HotelRepository
from app.schemas.hotel import HotelCreate


class HotelService:

    @staticmethod
    def create(db: Session, hotel: HotelCreate):

        new_hotel = Hotel(
            name=hotel.name,
            description=hotel.description,
            city=hotel.city,
            country=hotel.country,
            address=hotel.address,
            price_per_night=hotel.price_per_night,
            rating=hotel.rating,
            image_url=hotel.image_url,
            available_rooms=hotel.available_rooms,
        )

        return HotelRepository.create(db, new_hotel)

    @staticmethod
    def get_all(db: Session):
        return HotelRepository.get_all(db)

    @staticmethod
    def get_by_id(db: Session, hotel_id: int):
        return HotelRepository.get_by_id(db, hotel_id)

    @staticmethod
    def update(db: Session, hotel_id: int, hotel_data: HotelCreate):

      hotel = HotelRepository.get_by_id(db, hotel_id)

      if hotel is None:
         return None

      hotel.name = hotel_data.name
      hotel.description = hotel_data.description
      hotel.city = hotel_data.city
      hotel.country = hotel_data.country
      hotel.address = hotel_data.address
      hotel.price_per_night = hotel_data.price_per_night
      hotel.rating = hotel_data.rating
      hotel.image_url = hotel_data.image_url
      hotel.available_rooms = hotel_data.available_rooms

      return HotelRepository.update(db, hotel)


    @staticmethod
    def delete(db: Session, hotel_id: int):

        hotel = HotelRepository.get_by_id(db, hotel_id)

        if hotel is None:
           return False

        HotelRepository.delete(db, hotel)

        return True

    @staticmethod
    def search(
        db,
        city=None,
        country=None,
        min_price=None,
        max_price=None,
        rating=None,
        page=1,
        limit=10,
    ):
        return HotelRepository.search(
            db,
            city,
            country,
            min_price,
            max_price,
            rating,
            page,
            limit,
    )