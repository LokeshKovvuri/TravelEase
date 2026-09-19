from io import BytesIO
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_RIGHT
from reportlab.lib.units import mm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

from app.models.booking import Booking
from app.models.payment import Payment


class InvoiceService:

    # ============================================================
    # GENERATE BOOKING INVOICE
    # ============================================================

    @staticmethod
    def generate_booking_invoice(
        booking: Booking,
        payment: Payment | None = None,
    ):

        # --------------------------------------------------------
        # Validate booking
        # --------------------------------------------------------

        if booking is None:
            raise Exception(
                "Booking not found"
            )

        # --------------------------------------------------------
        # Get user
        # --------------------------------------------------------

        user = booking.user

        if user is None:
            raise Exception(
                "Customer information not found"
            )

        # --------------------------------------------------------
        # Determine booking type
        # --------------------------------------------------------

        is_flight_booking = (
            booking.flight_id is not None
        )

        is_hotel_booking = (
            booking.room_id is not None
        )

        if is_flight_booking and is_hotel_booking:
            raise Exception(
                "Invalid booking: both flight and room are assigned"
            )

        if not is_flight_booking and not is_hotel_booking:
            raise Exception(
                "Invalid booking: no flight or room assigned"
            )

        # --------------------------------------------------------
        # Related objects
        # --------------------------------------------------------

        flight = None
        room = None
        hotel = None

        if is_flight_booking:

            flight = booking.flight

            if flight is None:
                raise Exception(
                    "Flight information not found"
                )

        else:

            room = booking.room

            if room is None:
                raise Exception(
                    "Room information not found"
                )

            hotel = room.hotel

            if hotel is None:
                raise Exception(
                    "Hotel information not found"
                )

        # --------------------------------------------------------
        # Invoice number
        # --------------------------------------------------------

        invoice_number = (
            f"TEA-INV-{booking.id:06d}"
        )

        # --------------------------------------------------------
        # Create PDF buffer
        # --------------------------------------------------------

        buffer = BytesIO()

        document = SimpleDocTemplate(
            buffer,
            pagesize=A4,
            rightMargin=20 * mm,
            leftMargin=20 * mm,
            topMargin=18 * mm,
            bottomMargin=18 * mm,
        )

        # --------------------------------------------------------
        # Styles
        # --------------------------------------------------------

        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            "InvoiceTitle",
            parent=styles["Title"],
            fontSize=24,
            leading=28,
            alignment=TA_CENTER,
            spaceAfter=5,
        )

        subtitle_style = ParagraphStyle(
            "InvoiceSubtitle",
            parent=styles["Normal"],
            fontSize=10,
            alignment=TA_CENTER,
            textColor=colors.grey,
            spaceAfter=20,
        )

        heading_style = ParagraphStyle(
            "SectionHeading",
            parent=styles["Heading2"],
            fontSize=12,
            leading=15,
            spaceBefore=12,
            spaceAfter=8,
        )

        normal_style = ParagraphStyle(
            "InvoiceNormal",
            parent=styles["Normal"],
            fontSize=9,
            leading=13,
        )

        right_style = ParagraphStyle(
            "InvoiceRight",
            parent=normal_style,
            alignment=TA_RIGHT,
        )

        # --------------------------------------------------------
        # Document content
        # --------------------------------------------------------

        story = []

        # ========================================================
        # HEADER
        # ========================================================

        story.append(
            Paragraph(
                "TEA",
                title_style,
            )
        )

        story.append(
            Paragraph(
                "TravelEase Around",
                subtitle_style,
            )
        )

        story.append(
            Paragraph(
                "<b>BOOKING INVOICE</b>",
                heading_style,
            )
        )

        # ========================================================
        # INVOICE INFORMATION
        # ========================================================

        invoice_date = datetime.now().strftime(
            "%d %b %Y"
        )

        booking_type = (
            "FLIGHT"
            if is_flight_booking
            else "HOTEL"
        )

        invoice_info = [
            [
                Paragraph(
                    "<b>Invoice Number</b>",
                    normal_style,
                ),
                Paragraph(
                    invoice_number,
                    normal_style,
                ),
                Paragraph(
                    "<b>Invoice Date</b>",
                    normal_style,
                ),
                Paragraph(
                    invoice_date,
                    normal_style,
                ),
            ],
            [
                Paragraph(
                    "<b>Booking ID</b>",
                    normal_style,
                ),
                Paragraph(
                    f"TEA-{booking.id:06d}",
                    normal_style,
                ),
                Paragraph(
                    "<b>Booking Type</b>",
                    normal_style,
                ),
                Paragraph(
                    booking_type,
                    normal_style,
                ),
            ],
            [
                Paragraph(
                    "<b>Status</b>",
                    normal_style,
                ),
                Paragraph(
                    booking.status,
                    normal_style,
                ),
                Paragraph(
                    "<b>Guests / Passengers</b>",
                    normal_style,
                ),
                Paragraph(
                    str(booking.guests),
                    normal_style,
                ),
            ],
        ]

        invoice_table = Table(
            invoice_info,
            colWidths=[
                35 * mm,
                50 * mm,
                35 * mm,
                50 * mm,
            ],
        )

        invoice_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (0, -1),
                        colors.whitesmoke,
                    ),
                    (
                        "BACKGROUND",
                        (2, 0),
                        (2, -1),
                        colors.whitesmoke,
                    ),
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.lightgrey,
                    ),
                    (
                        "VALIGN",
                        (0, 0),
                        (-1, -1),
                        "MIDDLE",
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                ]
            )
        )

        story.append(invoice_table)

        # ========================================================
        # CUSTOMER DETAILS
        # ========================================================

        story.append(
            Paragraph(
                "Customer Details",
                heading_style,
            )
        )

        customer_name = (
            f"{user.first_name} "
            f"{user.last_name}"
        )

        customer_data = [
            [
                Paragraph(
                    "<b>Name</b>",
                    normal_style,
                ),
                Paragraph(
                    customer_name,
                    normal_style,
                ),
            ],
            [
                Paragraph(
                    "<b>Email</b>",
                    normal_style,
                ),
                Paragraph(
                    user.email,
                    normal_style,
                ),
            ],
        ]

        customer_table = Table(
            customer_data,
            colWidths=[
                35 * mm,
                135 * mm,
            ],
        )

        customer_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.lightgrey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (0, -1),
                        colors.whitesmoke,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                ]
            )
        )

        story.append(customer_table)

        # ========================================================
        # FLIGHT DETAILS
        # ========================================================

        if is_flight_booking:

            story.append(
                Paragraph(
                    "Flight Details",
                    heading_style,
                )
            )

            flight_data = [
                [
                    Paragraph(
                        "<b>Airline</b>",
                        normal_style,
                    ),
                    Paragraph(
                        flight.airline,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Flight Number</b>",
                        normal_style,
                    ),
                    Paragraph(
                        flight.flight_number,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>From</b>",
                        normal_style,
                    ),
                    Paragraph(
                        flight.origin,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>To</b>",
                        normal_style,
                    ),
                    Paragraph(
                        flight.destination,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Departure</b>",
                        normal_style,
                    ),
                    Paragraph(
                        flight.departure_time.strftime(
                            "%d %b %Y, %I:%M %p"
                        ),
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Arrival</b>",
                        normal_style,
                    ),
                    Paragraph(
                        flight.arrival_time.strftime(
                            "%d %b %Y, %I:%M %p"
                        ),
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Passengers</b>",
                        normal_style,
                    ),
                    Paragraph(
                        str(booking.guests),
                        normal_style,
                    ),
                ],
            ]

            flight_table = Table(
                flight_data,
                colWidths=[
                    35 * mm,
                    135 * mm,
                ],
            )

            flight_table.setStyle(
                TableStyle(
                    [
                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.5,
                            colors.lightgrey,
                        ),
                        (
                            "BACKGROUND",
                            (0, 0),
                            (0, -1),
                            colors.whitesmoke,
                        ),
                        (
                            "LEFTPADDING",
                            (0, 0),
                            (-1, -1),
                            8,
                        ),
                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                    ]
                )
            )

            story.append(flight_table)

        # ========================================================
        # HOTEL DETAILS
        # ========================================================

        else:

            story.append(
                Paragraph(
                    "Hotel Details",
                    heading_style,
                )
            )

            hotel_data = [
                [
                    Paragraph(
                        "<b>Hotel</b>",
                        normal_style,
                    ),
                    Paragraph(
                        hotel.name,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Location</b>",
                        normal_style,
                    ),
                    Paragraph(
                        f"{hotel.city}, "
                        f"{hotel.country}",
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Address</b>",
                        normal_style,
                    ),
                    Paragraph(
                        hotel.address,
                        normal_style,
                    ),
                ],
            ]

            hotel_table = Table(
                hotel_data,
                colWidths=[
                    35 * mm,
                    135 * mm,
                ],
            )

            hotel_table.setStyle(
                TableStyle(
                    [
                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.5,
                            colors.lightgrey,
                        ),
                        (
                            "BACKGROUND",
                            (0, 0),
                            (0, -1),
                            colors.whitesmoke,
                        ),
                        (
                            "LEFTPADDING",
                            (0, 0),
                            (-1, -1),
                            8,
                        ),
                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                    ]
                )
            )

            story.append(hotel_table)

            # ----------------------------------------------------
            # STAY DETAILS
            # ----------------------------------------------------

            if booking.check_in is None or booking.check_out is None:
                raise Exception(
                    "Hotel booking dates are missing"
                )

            nights = (
                booking.check_out
                - booking.check_in
            ).days

            story.append(
                Paragraph(
                    "Stay Details",
                    heading_style,
                )
            )

            stay_data = [
                [
                    Paragraph(
                        "<b>Room Type</b>",
                        normal_style,
                    ),
                    Paragraph(
                        room.room_type,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Room Number</b>",
                        normal_style,
                    ),
                    Paragraph(
                        room.room_number,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Check-in</b>",
                        normal_style,
                    ),
                    Paragraph(
                        booking.check_in.strftime(
                            "%d %b %Y"
                        ),
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Check-out</b>",
                        normal_style,
                    ),
                    Paragraph(
                        booking.check_out.strftime(
                            "%d %b %Y"
                        ),
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Nights</b>",
                        normal_style,
                    ),
                    Paragraph(
                        str(nights),
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Guests</b>",
                        normal_style,
                    ),
                    Paragraph(
                        str(booking.guests),
                        normal_style,
                    ),
                ],
            ]

            stay_table = Table(
                stay_data,
                colWidths=[
                    35 * mm,
                    135 * mm,
                ],
            )

            stay_table.setStyle(
                TableStyle(
                    [
                        (
                            "GRID",
                            (0, 0),
                            (-1, -1),
                            0.5,
                            colors.lightgrey,
                        ),
                        (
                            "BACKGROUND",
                            (0, 0),
                            (0, -1),
                            colors.whitesmoke,
                        ),
                        (
                            "LEFTPADDING",
                            (0, 0),
                            (-1, -1),
                            8,
                        ),
                        (
                            "TOPPADDING",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                        (
                            "BOTTOMPADDING",
                            (0, 0),
                            (-1, -1),
                            7,
                        ),
                    ]
                )
            )

            story.append(stay_table)

        # ========================================================
        # PAYMENT DETAILS
        # ========================================================

        story.append(
            Paragraph(
                "Payment Details",
                heading_style,
            )
        )

        if payment:

            payment_data = [
                [
                    Paragraph(
                        "<b>Payment Method</b>",
                        normal_style,
                    ),
                    Paragraph(
                        payment.payment_method,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Transaction ID</b>",
                        normal_style,
                    ),
                    Paragraph(
                        payment.transaction_id,
                        normal_style,
                    ),
                ],
                [
                    Paragraph(
                        "<b>Payment Status</b>",
                        normal_style,
                    ),
                    Paragraph(
                        payment.status,
                        normal_style,
                    ),
                ],
            ]

        else:

            payment_data = [
                [
                    Paragraph(
                        "<b>Payment Status</b>",
                        normal_style,
                    ),
                    Paragraph(
                        "Not available",
                        normal_style,
                    ),
                ],
            ]

        payment_table = Table(
            payment_data,
            colWidths=[
                35 * mm,
                135 * mm,
            ],
        )

        payment_table.setStyle(
            TableStyle(
                [
                    (
                        "GRID",
                        (0, 0),
                        (-1, -1),
                        0.5,
                        colors.lightgrey,
                    ),
                    (
                        "BACKGROUND",
                        (0, 0),
                        (0, -1),
                        colors.whitesmoke,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        8,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        7,
                    ),
                ]
            )
        )

        story.append(payment_table)

        # ========================================================
        # TOTAL
        # ========================================================

        story.append(
            Spacer(1, 10)
        )

        total_data = [
            [
                Paragraph(
                    "<b>TOTAL AMOUNT</b>",
                    normal_style,
                ),
                Paragraph(
                    f"<b>₹{booking.total_price:,.2f}</b>",
                    right_style,
                ),
            ]
        ]

        total_table = Table(
            total_data,
            colWidths=[
                120 * mm,
                50 * mm,
            ],
        )

        total_table.setStyle(
            TableStyle(
                [
                    (
                        "BACKGROUND",
                        (0, 0),
                        (-1, -1),
                        colors.whitesmoke,
                    ),
                    (
                        "BOX",
                        (0, 0),
                        (-1, -1),
                        1,
                        colors.grey,
                    ),
                    (
                        "LEFTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "RIGHTPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "TOPPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                    (
                        "BOTTOMPADDING",
                        (0, 0),
                        (-1, -1),
                        10,
                    ),
                ]
            )
        )

        story.append(total_table)

        # ========================================================
        # FOOTER
        # ========================================================

        story.append(
            Spacer(1, 25)
        )

        story.append(
            Paragraph(
                "Thank you for choosing "
                "TEA — TravelEase Around.",
                subtitle_style,
            )
        )

        story.append(
            Paragraph(
                "Travel smarter. Travel easier. 🌍✈️",
                subtitle_style,
            )
        )

        # ========================================================
        # BUILD PDF
        # ========================================================

        document.build(story)

        buffer.seek(0)

        return buffer