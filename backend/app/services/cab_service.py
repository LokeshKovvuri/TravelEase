from sqlalchemy.orm import Session

from app.models.cab import Cab

from app.repositories.cab_repository import (
    CabRepository,
)

from app.schemas.cab import (
    CabCreate,
    CabUpdate,
)


class CabService:

    @staticmethod
    def create(
        db: Session,
        data: CabCreate,
    ):

        # Validate route

        if (
            data.origin.strip().lower()
            == data.destination.strip().lower()
        ):
            raise Exception(
                "Origin and destination cannot be the same"
            )

        # Validate vehicle number

        vehicle_number = (
            data.vehicle_number
            .strip()
            .upper()
        )

        existing = (
            CabRepository.get_by_vehicle_number(
                db,
                vehicle_number,
            )
        )

        if existing:
            raise Exception(
                "Vehicle number already exists"
            )

        # Create cab

        cab = Cab(
            provider_name=data.provider_name.strip(),
            vehicle_number=vehicle_number,
            vehicle_type=data.vehicle_type.strip(),
            origin=data.origin.strip(),
            destination=data.destination.strip(),
            price_per_km=data.price_per_km,
            base_fare=data.base_fare,
            available=data.available,
            status=data.status.strip().upper(),
        )

        return CabRepository.create(
            db,
            cab,
        )

    # ============================================================
    # GET ALL
    # ============================================================

    @staticmethod
    def get_all(
        db: Session,
    ):

        return CabRepository.get_all(
            db
        )

    # ============================================================
    # GET BY ID
    # ============================================================

    @staticmethod
    def get_by_id(
        db: Session,
        cab_id: int,
    ):

        cab = CabRepository.get_by_id(
            db,
            cab_id,
        )

        if cab is None:
            raise Exception(
                "Cab not found"
            )

        return cab

    # ============================================================
    # SEARCH
    # ============================================================

    @staticmethod
    def search(
        db: Session,
        origin: str | None = None,
        destination: str | None = None,
        vehicle_type: str | None = None,
    ):

        return CabRepository.search(
            db=db,
            origin=origin,
            destination=destination,
            vehicle_type=vehicle_type,
        )

    # ============================================================
    # UPDATE
    # ============================================================

    @staticmethod
    def update(
        db: Session,
        cab_id: int,
        data: CabUpdate,
    ):

        cab = CabRepository.get_by_id(
            db,
            cab_id,
        )

        if cab is None:
            raise Exception(
                "Cab not found"
            )

        if data.provider_name is not None:
            cab.provider_name = (
                data.provider_name.strip()
            )

        if data.vehicle_number is not None:

            new_number = (
                data.vehicle_number
                .strip()
                .upper()
            )

            existing = (
                CabRepository
                .get_by_vehicle_number(
                    db,
                    new_number,
                )
            )

            if (
                existing
                and existing.id != cab.id
            ):
                raise Exception(
                    "Vehicle number already exists"
                )

            cab.vehicle_number = new_number

        if data.vehicle_type is not None:
            cab.vehicle_type = (
                data.vehicle_type.strip()
            )

        if data.origin is not None:
            cab.origin = (
                data.origin.strip()
            )

        if data.destination is not None:
            cab.destination = (
                data.destination.strip()
            )

        if data.price_per_km is not None:
            cab.price_per_km = (
                data.price_per_km
            )

        if data.base_fare is not None:
            cab.base_fare = (
                data.base_fare
            )

        if data.available is not None:
            cab.available = data.available

        if data.status is not None:
            cab.status = (
                data.status
                .strip()
                .upper()
            )

        # Validate route after update

        if (
            cab.origin.lower()
            == cab.destination.lower()
        ):
            raise Exception(
                "Origin and destination cannot be the same"
            )

        return CabRepository.update(
            db,
            cab,
        )

    # ============================================================
    # DELETE
    # ============================================================

    @staticmethod
    def delete(
        db: Session,
        cab_id: int,
    ):

        cab = CabRepository.get_by_id(
            db,
            cab_id,
        )

        if cab is None:
            raise Exception(
                "Cab not found"
            )

        CabRepository.delete(
            db,
            cab,
        )

        return {
            "message":
                "Cab deleted successfully"
        }