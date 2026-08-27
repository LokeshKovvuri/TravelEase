from sqlalchemy.orm import Session

from app.models.bus import Bus

from app.repositories.bus_repository import (
    BusRepository,
)

from app.schemas.bus import (
    BusCreate,
    BusUpdate,
)


class BusService:

    # ============================================================
    # CREATE BUS
    # ============================================================

    @staticmethod
    def create(
        db: Session,
        data: BusCreate,
    ):

        # --------------------------------------------------------
        # Validate route
        # --------------------------------------------------------

        if (
            data.origin.strip().lower()
            == data.destination.strip().lower()
        ):

            raise Exception(
                "Origin and destination cannot be the same"
            )

        # --------------------------------------------------------
        # Validate time
        # --------------------------------------------------------

        if data.arrival_time <= data.departure_time:

            raise Exception(
                "Arrival time must be after departure time"
            )

        # --------------------------------------------------------
        # Validate seats
        # --------------------------------------------------------

        if (
            data.available_seats
            > data.total_seats
        ):

            raise Exception(
                "Available seats cannot exceed total seats"
            )

        # --------------------------------------------------------
        # Check duplicate bus number
        # --------------------------------------------------------

        bus_number = (
            data.bus_number
            .strip()
            .upper()
        )

        existing = (
            BusRepository.get_by_bus_number(
                db,
                bus_number,
            )
        )

        if existing:

            raise Exception(
                "Bus number already exists"
            )

        # --------------------------------------------------------
        # Create bus
        # --------------------------------------------------------

        bus = Bus(
            operator_name=(
                data.operator_name.strip()
            ),
            bus_number=bus_number,
            bus_type=(
                data.bus_type.strip()
            ),
            origin=data.origin.strip(),
            destination=data.destination.strip(),
            departure_time=data.departure_time,
            arrival_time=data.arrival_time,
            journey_duration=data.journey_duration,
            price=data.price,
            available_seats=data.available_seats,
            total_seats=data.total_seats,
            status=(
                data.status
                .strip()
                .upper()
            ),
        )

        return BusRepository.create(
            db,
            bus,
        )

    # ============================================================
    # GET ALL
    # ============================================================

    @staticmethod
    def get_all(
        db: Session,
    ):

        return BusRepository.get_all(
            db
        )

    # ============================================================
    # GET BY ID
    # ============================================================

    @staticmethod
    def get_by_id(
        db: Session,
        bus_id: int,
    ):

        bus = BusRepository.get_by_id(
            db,
            bus_id,
        )

        if bus is None:

            raise Exception(
                "Bus not found"
            )

        return bus

    # ============================================================
    # SEARCH
    # ============================================================

    @staticmethod
    def search(
        db: Session,
        origin: str | None = None,
        destination: str | None = None,
        departure_date=None,
    ):

        return BusRepository.search(
            db=db,
            origin=origin,
            destination=destination,
            departure_date=departure_date,
        )

    # ============================================================
    # UPDATE
    # ============================================================

    @staticmethod
    def update(
        db: Session,
        bus_id: int,
        data: BusUpdate,
    ):

        bus = BusRepository.get_by_id(
            db,
            bus_id,
        )

        if bus is None:

            raise Exception(
                "Bus not found"
            )

        # --------------------------------------------------------
        # Update fields
        # --------------------------------------------------------

        if data.operator_name is not None:

            bus.operator_name = (
                data.operator_name.strip()
            )

        if data.bus_number is not None:

            new_number = (
                data.bus_number
                .strip()
                .upper()
            )

            existing = (
                BusRepository
                .get_by_bus_number(
                    db,
                    new_number,
                )
            )

            if (
                existing
                and existing.id != bus.id
            ):

                raise Exception(
                    "Bus number already exists"
                )

            bus.bus_number = new_number

        if data.bus_type is not None:

            bus.bus_type = (
                data.bus_type.strip()
            )

        if data.origin is not None:

            bus.origin = (
                data.origin.strip()
            )

        if data.destination is not None:

            bus.destination = (
                data.destination.strip()
            )

        if data.departure_time is not None:

            bus.departure_time = (
                data.departure_time
            )

        if data.arrival_time is not None:

            bus.arrival_time = (
                data.arrival_time
            )

        if data.journey_duration is not None:

            bus.journey_duration = (
                data.journey_duration
            )

        if data.price is not None:

            bus.price = data.price

        if data.available_seats is not None:

            bus.available_seats = (
                data.available_seats
            )

        if data.total_seats is not None:

            bus.total_seats = (
                data.total_seats
            )

        if data.status is not None:

            bus.status = (
                data.status
                .strip()
                .upper()
            )

        # --------------------------------------------------------
        # Validate route
        # --------------------------------------------------------

        if (
            bus.origin.lower()
            == bus.destination.lower()
        ):

            raise Exception(
                "Origin and destination cannot be the same"
            )

        # --------------------------------------------------------
        # Validate time
        # --------------------------------------------------------

        if (
            bus.arrival_time
            <= bus.departure_time
        ):

            raise Exception(
                "Arrival time must be after departure time"
            )

        # --------------------------------------------------------
        # Validate seats
        # --------------------------------------------------------

        if (
            bus.available_seats
            > bus.total_seats
        ):

            raise Exception(
                "Available seats cannot exceed total seats"
            )

        return BusRepository.update(
            db,
            bus,
        )

    # ============================================================
    # DELETE
    # ============================================================

    @staticmethod
    def delete(
        db: Session,
        bus_id: int,
    ):

        bus = BusRepository.get_by_id(
            db,
            bus_id,
        )

        if bus is None:

            raise Exception(
                "Bus not found"
            )

        BusRepository.delete(
            db,
            bus,
        )

        return {
            "message":
                "Bus deleted successfully"
        }