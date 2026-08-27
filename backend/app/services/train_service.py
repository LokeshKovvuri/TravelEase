from sqlalchemy.orm import Session

from app.models.train import Train
from app.repositories.train_repository import TrainRepository
from app.schemas.train import (
    TrainCreate,
    TrainUpdate,
)


class TrainService:

    @staticmethod
    def create(
        db: Session,
        data: TrainCreate,
    ):

        existing = TrainRepository.get_by_train_number(
            db,
            data.train_number,
        )

        if existing:
            raise Exception(
                "Train number already exists"
            )

        if data.arrival_time <= data.departure_time:
            raise Exception(
                "Arrival time must be after departure time"
            )

        if data.available_seats > data.total_seats:
            raise Exception(
                "Available seats cannot exceed total seats"
            )

        train = Train(
            train_number=data.train_number,
            train_name=data.train_name,
            origin=data.origin,
            destination=data.destination,
            departure_time=data.departure_time,
            arrival_time=data.arrival_time,
            journey_duration=data.journey_duration,
            economy_price=data.economy_price,
            ac_price=data.ac_price,
            available_seats=data.available_seats,
            total_seats=data.total_seats,
            status=data.status,
        )

        return TrainRepository.create(
            db,
            train,
        )

    @staticmethod
    def get_all(
        db: Session,
    ):
        return TrainRepository.get_all(db)

    @staticmethod
    def get_by_id(
        db: Session,
        train_id: int,
    ):

        train = TrainRepository.get_by_id(
            db,
            train_id,
        )

        if train is None:
            raise Exception(
                "Train not found"
            )

        return train

    @staticmethod
    def search(
        db: Session,
        origin: str,
        destination: str,
    ):
        return TrainRepository.search(
            db,
            origin,
            destination,
        )

    @staticmethod
    def update(
        db: Session,
        train_id: int,
        data: TrainUpdate,
    ):

        train = TrainRepository.get_by_id(
            db,
            train_id,
        )

        if train is None:
            raise Exception(
                "Train not found"
            )

        update_data = data.model_dump(
            exclude_unset=True
        )

        if "train_number" in update_data:
            existing = (
                TrainRepository.get_by_train_number(
                    db,
                    update_data["train_number"],
                )
            )

            if (
                existing
                and existing.id != train.id
            ):
                raise Exception(
                    "Train number already exists"
                )

        for field, value in update_data.items():
            setattr(train, field, value)

        if train.arrival_time <= train.departure_time:
            raise Exception(
                "Arrival time must be after departure time"
            )

        if train.available_seats > train.total_seats:
            raise Exception(
                "Available seats cannot exceed total seats"
            )

        return TrainRepository.update(
            db,
            train,
        )

    @staticmethod
    def delete(
        db: Session,
        train_id: int,
    ):

        train = TrainRepository.get_by_id(
            db,
            train_id,
        )

        if train is None:
            raise Exception(
                "Train not found"
            )

        TrainRepository.delete(
            db,
            train,
        )

        return {
            "message": "Train deleted successfully"
        }