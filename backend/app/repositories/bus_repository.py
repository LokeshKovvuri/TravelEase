from datetime import datetime

from sqlalchemy.orm import Session

from app.models.bus import Bus


class BusRepository:

    # ============================================================
    # CREATE
    # ============================================================

    @staticmethod
    def create(
        db: Session,
        bus: Bus,
    ):

        db.add(bus)

        db.commit()

        db.refresh(bus)

        return bus

    # ============================================================
    # GET ALL
    # ============================================================

    @staticmethod
    def get_all(
        db: Session,
    ):

        return (
            db.query(Bus)
            .order_by(
                Bus.departure_time.asc()
            )
            .all()
        )

    # ============================================================
    # GET BY ID
    # ============================================================

    @staticmethod
    def get_by_id(
        db: Session,
        bus_id: int,
    ):

        return (
            db.query(Bus)
            .filter(
                Bus.id == bus_id
            )
            .first()
        )

    # ============================================================
    # GET BY BUS NUMBER
    # ============================================================

    @staticmethod
    def get_by_bus_number(
        db: Session,
        bus_number: str,
    ):

        return (
            db.query(Bus)
            .filter(
                Bus.bus_number == bus_number
            )
            .first()
        )

    # ============================================================
    # SEARCH
    # ============================================================

    @staticmethod
    def search(
        db: Session,
        origin: str | None = None,
        destination: str | None = None,
        departure_date: datetime | None = None,
    ):

        query = db.query(Bus)

        if origin:

            query = query.filter(
                Bus.origin.ilike(
                    f"%{origin}%"
                )
            )

        if destination:

            query = query.filter(
                Bus.destination.ilike(
                    f"%{destination}%"
                )
            )

        if departure_date:

            query = query.filter(
                Bus.departure_time >= departure_date
            )

        return (
            query
            .order_by(
                Bus.departure_time.asc()
            )
            .all()
        )

    # ============================================================
    # UPDATE
    # ============================================================

    @staticmethod
    def update(
        db: Session,
        bus: Bus,
    ):

        db.commit()

        db.refresh(bus)

        return bus

    # ============================================================
    # DELETE
    # ============================================================

    @staticmethod
    def delete(
        db: Session,
        bus: Bus,
    ):

        db.delete(bus)

        db.commit()