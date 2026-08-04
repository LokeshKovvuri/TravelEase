import os
import smtplib
from email.message import EmailMessage

from dotenv import load_dotenv

load_dotenv()


class EmailService:

    @staticmethod
    def send_email(
        to_email: str,
        subject: str,
        body: str,
    ):

        email = EmailMessage()

        email["Subject"] = subject
        email["From"] = os.getenv("EMAIL_FROM")
        email["To"] = to_email

        email.set_content(body)

        with smtplib.SMTP(
            os.getenv("SMTP_SERVER"),
            int(os.getenv("SMTP_PORT")),
        ) as smtp:

            smtp.starttls()

            smtp.login(
                os.getenv("EMAIL_USERNAME"),
                os.getenv("EMAIL_PASSWORD"),
            )

            smtp.send_message(email)

    @staticmethod
    def send_booking_confirmation(
        to_email: str,
        customer_name: str,
        booking,
   ):
        subject = "TravelEase - Booking Confirmation"

        body = f"""
    Hello {customer_name},

    Your booking has been confirmed successfully!

    Booking Details
    ----------------------------
    Booking ID : {booking.id}
    Room ID    : {booking.room_id}
    Check-in   : {booking.check_in}
    Check-out  : {booking.check_out}
    Guests     : {booking.guests}
    Total Price: ₹{booking.total_price}
    Status     : {booking.status}

    Thank you for choosing TravelEase.

    Have a wonderful stay!
     """

        EmailService.send_email(
            to_email=to_email,
            subject=subject,
            body=body,
       )