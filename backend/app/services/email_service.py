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

        smtp_server = os.getenv("SMTP_SERVER")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        email_username = os.getenv("EMAIL_USERNAME")
        email_password = os.getenv("EMAIL_PASSWORD")

        if not smtp_server:
            raise Exception("SMTP_SERVER is not configured")

        if not email_username:
            raise Exception("EMAIL_USERNAME is not configured")

        if not email_password:
            raise Exception("EMAIL_PASSWORD is not configured")

        with smtplib.SMTP(
            smtp_server,
            smtp_port,
        ) as smtp:

            smtp.starttls()

            smtp.login(
                email_username,
                email_password,
            )

            smtp.send_message(email)

    @staticmethod
    def send_booking_confirmation(
        to_email: str,
        customer_name: str,
        booking,
    ):
        # -----------------------------------------
        # Booking details
        # -----------------------------------------

        room = booking.room

        hotel = room.hotel if room else None

        hotel_name = (
            hotel.name
            if hotel
            else "TravelEase Hotel"
        )

        hotel_city = (
            f"{hotel.city}, {hotel.country}"
            if hotel
            else "N/A"
        )

        hotel_address = (
            hotel.address
            if hotel
            else "N/A"
        )

        room_type = (
            room.room_type
            if room
            else "Room"
        )

        nights = (
            booking.check_out - booking.check_in
        ).days

        # -----------------------------------------
        # Email subject
        # -----------------------------------------

        subject = (
            f"TravelEase Atlas - "
            f"Booking #{booking.id} Confirmed"
        )

        # -----------------------------------------
        # Email body
        # -----------------------------------------

        body = f"""
TRAVELEASE ATLAS
==============================

BOOKING CONFIRMED ✓

Hello {customer_name},

Your hotel booking has been successfully
confirmed.

BOOKING DETAILS
------------------------------

Booking ID   : TEA-{booking.id:06d}
Status       : {booking.status}

HOTEL
------------------------------

Hotel        : {hotel_name}
Location     : {hotel_city}
Address      : {hotel_address}

ROOM
------------------------------

Room Type    : {room_type}
Guests       : {booking.guests}
Nights       : {nights}

STAY DETAILS
------------------------------

Check-in     : {booking.check_in.strftime("%d %b %Y")}
Check-out    : {booking.check_out.strftime("%d %b %Y")}

PAYMENT DETAILS
------------------------------

Total Price  : ₹{booking.total_price:,.2f}

------------------------------

Thank you for choosing
TravelEase Atlas (TEA).

Have a wonderful journey! 🌍✈️

Travel smarter.
Travel easier.

TravelEase Atlas
"""

        # -----------------------------------------
        # Send email
        # -----------------------------------------

        EmailService.send_email(
            to_email=to_email,
            subject=subject,
            body=body,
        )