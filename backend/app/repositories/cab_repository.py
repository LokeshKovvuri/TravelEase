from sqlalchemy.orm import Session

from app.models.cab import Cab


class CabRepository:

    @staticmethod
    def create(
        db: Session,
        cab: Cab,
    ):
        db.add(cab)

        db.commit()

        db.refresh(cab)

        return cab

    @staticmethod
    def get_all(
        db: Session,
    ):
        return (
            db.query(Cab)
            .order_by(
                Cab.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        cab_id: int,
    ):
        return (
            db.query(Cab)
            .filter(
                Cab.id == cab_id
            )
            .first()
        )

    @staticmethod
    def get_by_vehicle_number(
        db: Session,
        vehicle_number: str,
    ):
        return (
            db.query(Cab)
            .filter(
                Cab.vehicle_number
                == vehicle_number
            )
            .first()
        )

    @staticmethod
    def search(
        db: Session,
        origin: str | None = None,
        destination: str | None = None,
        vehicle_type: str | None = None,
    ):

        query = db.query(Cab)

        if origin:
            query = query.filter(
                Cab.origin.ilike(
                    f"%{origin}%"
                )
            )

        if destination:
            query = query.filter(
                Cab.destination.ilike(
                    f"%{destination}%"
                )
            )

        if vehicle_type:
            query = query.filter(
                Cab.vehicle_type.ilike(
                    f"%{vehicle_type}%"
                )
            )

        return (
            query
            .order_by(
                Cab.created_at.desc()
            )
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        cab: Cab,
    ):
        db.commit()

        db.refresh(cab)

        return cab

    @staticmethod
    def delete(
        db: Session,
        cab: Cab,
    ):
        db.delete(cab)

        db.commit()