from datetime import date, datetime, time, timedelta

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
    def get_by_id_for_update(
        db: Session,
        flight_id: int,
    ):
        """
        Lock the flight row during a booking transaction.

        This prevents concurrent bookings from consuming
        the same available seats.
        """
        return (
            db.query(Flight)
            .filter(Flight.id == flight_id)
            .with_for_update()
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
        origin: str | None = None,
        destination: str | None = None,
        departure_date: date | None = None,
    ):
        query = db.query(Flight)

        # --------------------------------------------
        # ORIGIN
        # --------------------------------------------

        if origin:
            query = query.filter(
                Flight.origin.ilike(origin.strip())
            )

        # --------------------------------------------
        # DESTINATION
        # --------------------------------------------

        if destination:
            query = query.filter(
                Flight.destination.ilike(
                    destination.strip()
                )
            )

        # --------------------------------------------
        # DEPARTURE DATE
        # --------------------------------------------

        if departure_date:
            start_datetime = datetime.combine(
                departure_date,
                time.min,
            )

            end_datetime = start_datetime + timedelta(days=1)

            query = query.filter(
                Flight.departure_time >= start_datetime,
                Flight.departure_time < end_datetime,
            )

        # --------------------------------------------
        # ONLY SCHEDULED FLIGHTS
        # --------------------------------------------

        query = query.filter(
            Flight.status == "SCHEDULED"
        )

        return (
            query
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