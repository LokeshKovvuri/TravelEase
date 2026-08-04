from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.schemas.payment import (
    PaymentCreate,
    PaymentUpdate,
    PaymentResponse,
)
from app.services.payment_service import PaymentService

router = APIRouter(
    prefix="/api/v1/payments",
    tags=["Payments"],
)


@router.post("/", response_model=PaymentResponse)
def create_payment(
    payment: PaymentCreate,
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.create(db, payment)
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.get("/", response_model=list[PaymentResponse])
def get_payments(
    db: Session = Depends(get_db),
):
    return PaymentService.get_all(db)


@router.get("/{payment_id}", response_model=PaymentResponse)
def get_payment(
    payment_id: int,
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.get_by_id(
            db,
            payment_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put("/{payment_id}", response_model=PaymentResponse)
def update_payment(
    payment_id: int,
    payment: PaymentUpdate,
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.update(
            db,
            payment_id,
            payment,
        )
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


@router.delete("/{payment_id}")
def delete_payment(
    payment_id: int,
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.delete(
            db,
            payment_id,
        )
    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )