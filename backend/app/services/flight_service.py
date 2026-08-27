from sqlalchemy.orm import Session

from app.models.flight import Flight
from app.repositories.flight_repository import FlightRepository
from app.schemas.flight import (
    FlightCreate,
    FlightUpdate,
)


class FlightService:

    @staticmethod
    def create(
        db: Session,
        data: FlightCreate,
    ):

        existing = FlightRepository.get_by_flight_number(
            db,
            data.flight_number,
        )

        if existing:
            raise Exception(
                "Flight number already exists"
            )

        if data.arrival_time <= data.departure_time:
            raise Exception(
                "Arrival time must be after departure time"
            )

        if data.available_seats > data.total_seats:
            raise Exception(
                "Available seats cannot exceed total seats"
            )

        flight = Flight(
            airline=data.airline,
            flight_number=data.flight_number,
            origin=data.origin,
            destination=data.destination,
            departure_time=data.departure_time,
            arrival_time=data.arrival_time,
            economy_price=data.economy_price,
            business_price=data.business_price,
            available_seats=data.available_seats,
            total_seats=data.total_seats,
            status=data.status,
        )

        return FlightRepository.create(
            db,
            flight,
        )

    @staticmethod
    def get_all(
        db: Session,
    ):
        return FlightRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        flight_id: int,
    ):

        flight = FlightRepository.get_by_id(
            db,
            flight_id,
        )

        if flight is None:
            raise Exception(
                "Flight not found"
            )

        return flight

    @staticmethod
    def search(
        db: Session,
        origin: str,
        destination: str,
    ):
        return FlightRepository.search(
            db,
            origin,
            destination,
        )

    @staticmethod
    def update(
        db: Session,
        flight_id: int,
        data: FlightUpdate,
    ):

        flight = FlightRepository.get_by_id(
            db,
            flight_id,
        )

        if flight is None:
            raise Exception(
                "Flight not found"
            )

        update_data = data.model_dump(
            exclude_unset=True
        )

        for field, value in update_data.items():
            setattr(flight, field, value)

        if flight.arrival_time <= flight.departure_time:
            raise Exception(
                "Arrival time must be after departure time"
            )

        if flight.available_seats > flight.total_seats:
            raise Exception(
                "Available seats cannot exceed total seats"
            )

        return FlightRepository.update(
            db,
            flight,
        )

    @staticmethod
    def delete(
        db: Session,
        flight_id: int,
    ):

        flight = FlightRepository.get_by_id(
            db,
            flight_id,
        )

        if flight is None:
            raise Exception(
                "Flight not found"
            )

        FlightRepository.delete(
            db,
            flight,
        )

        return {
            "message": "Flight deleted successfully"
        }