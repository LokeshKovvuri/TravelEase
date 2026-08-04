from fastapi import HTTPException


class BookingNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Booking not found",
        )


class HotelNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Hotel not found",
        )


class RoomNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Room not found",
        )


class PaymentNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Payment not found",
        )


class ReviewNotFoundException(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=404,
            detail="Review not found",
        )