"""Focused service tests for booking inventory and payment confirmation."""

from datetime import date, datetime, timedelta, UTC
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import app.models  # noqa: F401 - registers all SQLAlchemy tables
from app.core.config import settings
from app.database.base import Base
from app.models.booking import Booking
from app.models.flight import Flight
from app.models.hotel import Hotel
from app.models.payment import Payment
from app.models.room import Room
from app.models.train import Train
from app.models.user import User
from app.schemas.booking import BookingCreate
from app.schemas.payment import PaymentCreate
from app.schemas.review import ReviewCreate, ReviewUpdate
from app.schemas.wishlist import WishlistCreate
from app.services.booking_service import BookingService
from app.services.payment_service import PaymentService
from app.services.review_service import ReviewService
from app.services.wishlist_service import WishlistService
from app.services.train_service import TrainService
from app.services.room_service import RoomService
from app.schemas.train import TrainCreate
from app.schemas.ai import TripPlanRequest
from app.services.travel_planner_service import TravelPlannerService


class BookingAndPaymentServiceTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite+pysqlite:///:memory:")
        Base.metadata.create_all(self.engine)
        self.Session = sessionmaker(bind=self.engine)
        self.db = self.Session()

        self.original_payment_provider = settings.payment_provider
        self.original_allow_mock_payments = settings.allow_mock_payments
        self.original_debug = settings.debug
        self.original_hold_minutes = settings.payment_hold_minutes
        self.original_openai_api_key = settings.openai_api_key
        settings.payment_provider = "mock"
        settings.allow_mock_payments = True
        settings.debug = True
        settings.payment_hold_minutes = 15
        settings.openai_api_key = None

        self.user = User(
            first_name="Test",
            last_name="Traveller",
            email="traveller@example.test",
            password="not-used-in-service-tests",
            is_active=True,
            role="USER",
        )
        hotel = Hotel(
            name="Test Hotel",
            city="Goa",
            country="India",
            address="Test Road",
            price_per_night=3000,
            available_rooms=2,
        )
        self.db.add_all([self.user, hotel])
        self.db.flush()

        self.room = Room(
            hotel_id=hotel.id,
            room_type="Deluxe",
            price=3000,
            capacity=2,
            available_rooms=2,
            total_rooms=2,
        )
        self.db.add(self.room)
        self.db.commit()
        self.db.refresh(self.user)
        self.db.refresh(self.room)

    def tearDown(self):
        self.db.close()
        Base.metadata.drop_all(self.engine)
        self.engine.dispose()
        settings.payment_provider = self.original_payment_provider
        settings.allow_mock_payments = self.original_allow_mock_payments
        settings.debug = self.original_debug
        settings.payment_hold_minutes = self.original_hold_minutes
        settings.openai_api_key = self.original_openai_api_key

    def hotel_booking_data(self):
        check_in = date.today() + timedelta(days=2)
        return BookingCreate(
            room_id=self.room.id,
            check_in=check_in,
            check_out=check_in + timedelta(days=2),
            guests=2,
        )

    def test_room_inventory_supports_capacity_without_overbooking(self):
        first_booking = BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )
        second_booking = BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )

        self.assertEqual(first_booking.status, "PENDING_PAYMENT")
        self.assertEqual(second_booking.status, "PENDING_PAYMENT")
        with self.assertRaisesRegex(Exception, "No rooms are available"):
            BookingService.create(
                self.db,
                self.user.id,
                self.hotel_booking_data(),
            )

    def test_room_availability_includes_active_payment_holds(self):
        BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )
        booking_data = self.hotel_booking_data()

        availability = RoomService.get_availability(
            self.db,
            self.room.id,
            booking_data.check_in,
            booking_data.check_out,
        )

        self.assertEqual(availability["total_rooms"], 2)
        self.assertEqual(availability["reserved_rooms"], 1)
        self.assertEqual(availability["available_rooms"], 1)

    def test_train_routes_are_normalized_and_searchable_by_typed_city(self):
        departure = datetime.now(UTC) + timedelta(days=2)
        train = TrainService.create(
            self.db,
            TrainCreate(
                train_number="  te 101 ",
                train_name="  Coastal Express ",
                origin="  Mumbai ",
                destination=" Goa ",
                departure_time=departure,
                arrival_time=departure + timedelta(hours=9),
                economy_price=1250,
                total_seats=240,
                available_seats=240,
            ),
        )

        matches = TrainService.search(self.db, "mumb", "GOA")

        self.assertEqual(train.train_number, "TE 101")
        self.assertEqual(train.origin, "Mumbai")
        self.assertEqual(train.destination, "Goa")
        self.assertEqual([match.id for match in matches], [train.id])

        with self.assertRaisesRegex(Exception, "cannot be the same"):
            TrainService.create(
                self.db,
                TrainCreate(
                    train_number="TE 102",
                    train_name="Invalid Route",
                    origin="Goa",
                    destination=" goa ",
                    departure_time=departure,
                    arrival_time=departure + timedelta(hours=2),
                    economy_price=500,
                    total_seats=10,
                ),
            )

    def test_trip_planner_uses_current_catalogue_without_an_ai_key(self):
        plan = TravelPlannerService.create_plan(
            self.db,
            TripPlanRequest(
                destination="Goa",
                budget_per_night=3500,
                nights=2,
                interests="Quiet stay",
                question="Which stay should I choose?",
            ),
        )

        self.assertEqual(plan.provider, "local")
        self.assertEqual([hotel.id for hotel in plan.recommendations], [self.room.hotel_id])
        self.assertIn("Goa", plan.advice)

    def test_mock_checkout_confirms_the_owned_pending_booking(self):
        booking = BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )

        payment = PaymentService.create(
            self.db,
            PaymentCreate(booking_id=booking.id, payment_method="UPI"),
            self.user.id,
        )
        self.db.refresh(booking)

        self.assertEqual(payment.provider, "mock")
        self.assertEqual(payment.status, "SUCCESS")
        self.assertEqual(booking.status, "CONFIRMED")

    def test_expired_hotel_hold_cannot_be_paid_later(self):
        booking = BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )
        booking.created_at = datetime.now(UTC) - timedelta(minutes=20)
        self.db.commit()

        with self.assertRaisesRegex(Exception, "payment hold has expired"):
            PaymentService.create(
                self.db,
                PaymentCreate(booking_id=booking.id, payment_method="UPI"),
                self.user.id,
            )

        self.db.refresh(booking)
        self.assertEqual(booking.status, "EXPIRED")

    def test_stripe_completion_is_idempotent(self):
        booking = BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )
        payment = Payment(
            booking_id=booking.id,
            amount=booking.total_price,
            payment_method="CARD",
            transaction_id="cs_pending",
            status="PENDING",
            provider="stripe",
            provider_payment_id="cs_pending",
        )
        self.db.add(payment)
        self.db.commit()

        session = {
            "id": "cs_completed",
            "payment_intent": "pi_completed",
            "payment_status": "paid",
            "amount_total": round(booking.total_price * 100),
        }
        confirmed_payment, was_confirmed = PaymentService.confirm_stripe_checkout(
            self.db,
            payment.id,
            session,
        )
        repeated_payment, was_confirmed_again = (
            PaymentService.confirm_stripe_checkout(
                self.db,
                payment.id,
                session,
            )
        )
        self.db.refresh(booking)

        self.assertEqual(confirmed_payment.status, "SUCCESS")
        self.assertEqual(repeated_payment.id, confirmed_payment.id)
        self.assertTrue(was_confirmed)
        self.assertFalse(was_confirmed_again)
        self.assertEqual(booking.status, "CONFIRMED")

    def test_wishlist_rejects_duplicate_saved_stay(self):
        first = WishlistService.add_to_wishlist(
            self.db,
            self.user,
            WishlistCreate(hotel_id=self.room.hotel_id),
        )

        self.assertEqual(first.hotel_id, self.room.hotel_id)
        with self.assertRaisesRegex(Exception, "already exists"):
            WishlistService.add_to_wishlist(
                self.db,
                self.user,
                WishlistCreate(hotel_id=self.room.hotel_id),
            )

    def test_only_booking_owner_can_edit_a_review(self):
        booking = BookingService.create(
            self.db,
            self.user.id,
            self.hotel_booking_data(),
        )
        PaymentService.create(
            self.db,
            PaymentCreate(booking_id=booking.id, payment_method="CARD"),
            self.user.id,
        )
        review = ReviewService.create(
            self.db,
            ReviewCreate(booking_id=booking.id, rating=5, comment="Excellent stay"),
            self.user.id,
        )
        other_user = User(
            first_name="Other",
            last_name="Traveller",
            email="other@example.test",
            password="not-used-in-service-tests",
            is_active=True,
            role="USER",
        )
        self.db.add(other_user)
        self.db.commit()

        with self.assertRaisesRegex(Exception, "not allowed"):
            ReviewService.update(
                self.db,
                review.id,
                ReviewUpdate(rating=1, comment="Changed"),
                other_user.id,
            )

    def test_expired_flight_hold_releases_its_seat_before_next_booking(self):
        flight = Flight(
            airline="TravelEase Air",
            flight_number="TE101",
            origin="Delhi",
            destination="Goa",
            departure_time=datetime.now() + timedelta(days=3),
            arrival_time=datetime.now() + timedelta(days=3, hours=2),
            economy_price=5000,
            available_seats=0,
            total_seats=2,
            status="SCHEDULED",
        )
        self.db.add(flight)
        self.db.flush()
        expired_booking = Booking(
            user_id=self.user.id,
            flight_id=flight.id,
            guests=1,
            total_price=5000,
            status="PENDING_PAYMENT",
            created_at=datetime.now(UTC) - timedelta(minutes=20),
        )
        self.db.add(expired_booking)
        self.db.commit()

        new_booking = BookingService.create(
            self.db,
            self.user.id,
            BookingCreate(flight_id=flight.id, guests=1),
        )
        self.db.refresh(expired_booking)
        self.db.refresh(flight)

        self.assertEqual(expired_booking.status, "EXPIRED")
        self.assertEqual(new_booking.status, "PENDING_PAYMENT")
        self.assertEqual(flight.available_seats, 0)


if __name__ == "__main__":
    unittest.main()
