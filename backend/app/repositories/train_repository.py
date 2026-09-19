from sqlalchemy.orm import Session

from app.models.train import Train


class TrainRepository:

    @staticmethod
    def create(
        db: Session,
        train: Train,
    ):
        db.add(train)
        db.commit()
        db.refresh(train)

        return train

    @staticmethod
    def get_all(
        db: Session,
    ):
        return (
            db.query(Train)
            .order_by(Train.departure_time)
            .all()
        )

    @staticmethod
    def get_by_id(
        db: Session,
        train_id: int,
    ):
        return (
            db.query(Train)
            .filter(Train.id == train_id)
            .first()
        )

    @staticmethod
    def get_by_train_number(
        db: Session,
        train_number: str,
    ):
        return (
            db.query(Train)
            .filter(
                Train.train_number == train_number
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
            db.query(Train)
            .filter(
                Train.origin.ilike(f"%{origin.strip()}%"),
                Train.destination.ilike(f"%{destination.strip()}%"),
            )
            .order_by(Train.departure_time)
            .all()
        )

    @staticmethod
    def update(
        db: Session,
        train: Train,
    ):
        db.commit()
        db.refresh(train)

        return train

    @staticmethod
    def delete(
        db: Session,
        train: Train,
    ):
        db.delete(train)
        db.commit()
