from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.services.booking_service import BookingService
from app.services.pdf_service import PDFService

router = APIRouter(
    prefix="/api/v1/invoices",
    tags=["Invoices"],
)


@router.get("/{booking_id}")
def download_invoice(
    booking_id: int,
    db: Session = Depends(get_db),
):
    try:
        booking = BookingService.get_by_id(db, booking_id)

        pdf = PDFService.generate_invoice(booking)

        return StreamingResponse(
            pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition":
                f'attachment; filename="invoice_{booking_id}.pdf"'
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )