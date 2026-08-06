from app.database.session import SessionLocal

from app.models.user import User
from app.models.hotel import Hotel
from app.models.room import Room
from app.models.booking import Booking
from app.models.payment import Payment
from app.models.review import Review
from app.models.wishlist import Wishlist

from app.core.security import hash_password

from datetime import date

db = SessionLocal()


def seed_users():

    existing = db.query(User).filter(
        User.email == "admin@travelease.com"
    ).first()

    if existing:
        print("Users already seeded.")
        return

    admin = User(
        first_name="Admin",
        last_name="TravelEase",
        email="admin@travelease.com",
        password=hash_password("Admin@123"),
        role="ADMIN",
    )

    user = User(
        first_name="Lokesh",
        last_name="Kovvuri",
        email="loki549loki@gmail.com",
        password=hash_password("Lokesh@257"),
        role="USER",
    )

    db.add(admin)
    db.add(user)

    db.commit()

    print("Users seeded successfully.")

def main():

    print("=" * 40)
    print("TravelEase Database Seeder")
    print("=" * 40)

    seed_users()

    print("Database seeding completed successfully.")

if __name__ == "__main__":
    main()