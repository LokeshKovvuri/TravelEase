from fastapi import APIRouter

from app.schemas.email import EmailRequest
from app.services.email_service import EmailService

router = APIRouter(
    prefix="/api/v1/email",
    tags=["Email"],
)


@router.post("/test")
def send_test_email(request: EmailRequest):

    EmailService.send_email(
        to_email=request.email,
        subject="TravelEase Test Email",
        body="Congratulations! Your Email Service is working successfully."
    )

    return {
        "message": "Email sent successfully"
    }