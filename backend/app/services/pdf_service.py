from io import BytesIO

from reportlab.lib.units import inch
from reportlab.pdfgen import canvas


class PDFService:

    @staticmethod
    def generate_invoice(booking):

        buffer = BytesIO()

        pdf = canvas.Canvas(buffer)

        pdf.setTitle("TravelEase Invoice")

        pdf.setFont("Helvetica-Bold", 18)
        pdf.drawString(1 * inch, 10.5 * inch, "TravelEase")

        pdf.setFont("Helvetica", 12)

        y = 10 * inch

        pdf.drawString(1 * inch, y, f"Booking ID: {booking.id}")
        y -= 0.3 * inch

        pdf.drawString(1 * inch, y, f"Room ID: {booking.room_id}")
        y -= 0.3 * inch

        pdf.drawString(1 * inch, y, f"Check-in: {booking.check_in}")
        y -= 0.3 * inch

        pdf.drawString(1 * inch, y, f"Check-out: {booking.check_out}")
        y -= 0.3 * inch

        pdf.drawString(1 * inch, y, f"Guests: {booking.guests}")
        y -= 0.3 * inch

        pdf.drawString(
            1 * inch,
            y,
            f"Total Price: ₹{booking.total_price}"
        )

        pdf.save()

        buffer.seek(0)

        return buffer