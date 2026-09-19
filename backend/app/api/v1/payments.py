import json

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.payment import PaymentCreate, PaymentResponse
from app.services.payment_gateway import (
    PaymentGatewayError,
    verify_stripe_signature,
)
from app.services.payment_service import PaymentService
from app.services.email_service import EmailService


router = APIRouter(prefix="/api/v1/payments", tags=["Payments"])


@router.post("/", response_model=PaymentResponse)
def create_payment(
    payment: PaymentCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        created_payment = PaymentService.create(
            db=db,
            data=payment,
            user_id=current_user.id,
        )
        if created_payment.status == "SUCCESS":
            background_tasks.add_task(
                EmailService.send_booking_confirmation,
                current_user.email,
                current_user.first_name,
                created_payment.booking,
            )
        return created_payment
    except PaymentGatewayError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.post("/webhooks/stripe")
async def stripe_webhook(
    request: Request,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
):
    """Accept Stripe's signed events without requiring user authentication."""
    payload = await request.body()
    try:
        verify_stripe_signature(payload, request.headers.get("stripe-signature"))
        event = json.loads(payload)
        if event.get("type") != "checkout.session.completed":
            return {"received": True}

        session = event.get("data", {}).get("object", {})
        payment_id = session.get("metadata", {}).get("payment_id")
        if not payment_id:
            raise PaymentGatewayError("Stripe event is missing a payment reference.")

        payment, was_confirmed = PaymentService.confirm_stripe_checkout(
            db=db,
            payment_id=int(payment_id),
            session=session,
        )
        if was_confirmed:
            background_tasks.add_task(
                EmailService.send_booking_confirmation,
                payment.booking.user.email,
                payment.booking.user.first_name,
                payment.booking,
            )
        return {"received": True}
    except (PaymentGatewayError, ValueError) as error:
        raise HTTPException(status_code=400, detail=str(error)) from error
    except Exception as error:
        raise HTTPException(status_code=400, detail=str(error)) from error


@router.get("/", response_model=list[PaymentResponse])
def get_payments(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return PaymentService.get_user_payments(db=db, user_id=current_user.id)


@router.get("/{payment_id}", response_model=PaymentResponse)
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
    except Exception as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
