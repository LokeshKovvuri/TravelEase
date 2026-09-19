from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.database.session import get_db
from app.schemas.train import (
    TrainCreate,
    TrainUpdate,
    TrainResponse,
)
from app.services.train_service import TrainService


router = APIRouter(
    prefix="/api/v1/trains",
    tags=["Trains"],
)


@router.post(
    "/",
    response_model=TrainResponse,
)
def create_train(
    train: TrainCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:
        return TrainService.create(
            db,
            train,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get(
    "/",
    response_model=list[TrainResponse],
)
def get_trains(
    db: Session = Depends(get_db),
):

    return TrainService.get_all(db)


@router.get(
    "/search",
    response_model=list[TrainResponse],
)
def search_trains(
    origin: str,
    destination: str,
    db: Session = Depends(get_db),
):

    return TrainService.search(
        db,
        origin,
        destination,
    )


@router.get(
    "/{train_id}",
    response_model=TrainResponse,
)
def get_train(
    train_id: int,
    db: Session = Depends(get_db),
):

    try:
        return TrainService.get_by_id(
            db,
            train_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/{train_id}",
    response_model=TrainResponse,
)
def update_train(
    train_id: int,
    train: TrainUpdate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:
        return TrainService.update(
            db,
            train_id,
            train,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete(
    "/{train_id}",
)
def delete_train(
    train_id: int,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:
        return TrainService.delete(
            db,
            train_id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )
