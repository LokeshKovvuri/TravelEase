from sqlalchemy.orm import Session

from app.models.flight import Flight


class FlightRepository:

    @staticmethod
    def create(
        db: Session,
        flight: Flight,
    ):
        db.add(flight)
        db.commit()
        db.refresh(flight)

        return flight

    @staticmethod
    def get_all(
        db: Session,
    ):
        return (
            db.query(Flight)
            .order_by(Flight.departure_time)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        flight_id: int,
    ):
        return (
            db.query(Flight)
            .filter(Flight.id == flight_id)
            .first()
        )

    @staticmethod
    def get_by_flight_number(
        db: Session,
        flight_number: str,
    ):
        return (
            db.query(Flight)
            .filter(
                Flight.flight_number == flight_number
            )
            .first()
        )

    @staticmethod
    def search(
        db: Session,
        origin: str,
        destination: str,
    ):
        return (
            db.query(Flight)
            .filter(
                Flight.origin == origin,
                Flight.destination == destination,
            )
            .order_by(Flight.departure_time)
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        flight: Flight,
    ):
        db.commit()
        db.refresh(flight)

        return flight

    @staticmethod
    def delete(
        db: Session,
        flight: Flight,
    ):
        db.delete(flight)
        db.commit()