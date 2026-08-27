from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
)
from fastapi.responses import StreamingResponse

from sqlalchemy.orm import Session

from app.api.dependencies import (
    get_current_user,
)

from app.database.session import (
    get_db,
)

from app.models.user import User

from app.repositories.booking_repository import (
    BookingRepository,
)

from app.repositories.payment_repository import (
    PaymentRepository,
)

from app.services.invoice_service import (
    InvoiceService,
)


router = APIRouter(
    prefix="/api/v1/invoices",
    tags=["Invoices"],
)


# ============================================================
# DOWNLOAD BOOKING INVOICE
# ============================================================

@router.get(
    "/booking/{booking_id}",
)
def download_booking_invoice(
    booking_id: int,
    current_user: User = Depends(
        get_current_user
    ),
    db: Session = Depends(get_db),
):

    # --------------------------------------------------------
    # Find booking
    # --------------------------------------------------------

    booking = BookingRepository.get_by_id(
        db,
        booking_id,
    )

    if booking is None:

        raise HTTPException(
            status_code=404,
            detail="Booking not found",
        )

    # --------------------------------------------------------
    # Ownership check
    # --------------------------------------------------------

    if booking.user_id != current_user.id:

        raise HTTPException(
            status_code=403,
            detail=(
                "You are not allowed to "
                "access this invoice"
            ),
        )

    # --------------------------------------------------------
    # Find payment
    # --------------------------------------------------------

    payment = (
        PaymentRepository.get_by_booking_id(
            db,
            booking_id,
        )
    )

    # --------------------------------------------------------
    # Generate invoice
    # --------------------------------------------------------

    try:

        pdf = (
            InvoiceService
            .generate_booking_invoice(
                booking=booking,
                payment=payment,
            )
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )

    # --------------------------------------------------------
    # Return PDF
    # --------------------------------------------------------

    filename = (
        f"TEA-Invoice-"
        f"{booking.id:06d}.pdf"
    )

    return StreamingResponse(
        pdf,
        media_type="application/pdf",
        headers={
            "Content-Disposition":
                f'attachment; filename="{filename}"'
        },
    )