from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
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


# ============================================================
# CREATE PAYMENT
# ============================================================

@router.post(
    "/",
    response_model=PaymentResponse,
)
def create_payment(
    payment: PaymentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.create(
            db=db,
            data=payment,
            user_id=current_user.id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# GET MY PAYMENTS
# ============================================================

@router.get(
    "/",
    response_model=list[PaymentResponse],
)
def get_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PaymentService.get_user_payments(
        db=db,
        user_id=current_user.id,
    )


# ============================================================
# GET SINGLE PAYMENT
# ============================================================

@router.get(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def get_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.get_by_id(
            db=db,
            payment_id=payment_id,
            user_id=current_user.id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# UPDATE PAYMENT
# ============================================================

@router.put(
    "/{payment_id}",
    response_model=PaymentResponse,
)
def update_payment(
    payment_id: int,
    payment: PaymentUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.update(
            db=db,
            payment_id=payment_id,
            data=payment,
            user_id=current_user.id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# DELETE PAYMENT
# ============================================================

@router.delete(
    "/{payment_id}",
)
def delete_payment(
    payment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        return PaymentService.delete(
            db=db,
            payment_id=payment_id,
            user_id=current_user.id,
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )