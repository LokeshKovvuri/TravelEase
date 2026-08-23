from datetime import datetime

from app.database.session import SessionLocal

from app.models.user import User
from app.models.hotel import Hotel

from app.core.security import hash_password


db = SessionLocal()


# ============================================================
# SEED USERS
# ============================================================

def seed_users():
    print("\nChecking users...")

    existing_admin = (
        db.query(User)
        .filter(User.email == "admin@travelease.com")
        .first()
    )

    if existing_admin:
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


# ============================================================
# SEED HOTELS
# ============================================================

def seed_hotels():
    print("\nChecking hotels...")

    existing_hotel = db.query(Hotel).first()

    if existing_hotel:
        print("Hotels already seeded.")
        return

    hotels = [
        Hotel(
            name="Ocean Pearl Resort",
            description=(
                "A beautiful beachfront resort offering comfortable "
                "rooms, modern facilities, swimming pool access and "
                "stunning views."
            ),
            city="Goa",
            country="India",
            address="Calangute Beach Road, Goa",
            price_per_night=4500,
            rating=4.6,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1564501049412-61c2a3083791"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=12,
        ),

        Hotel(
            name="Mountain View Retreat",
            description=(
                "A peaceful mountain retreat surrounded by nature. "
                "Perfect for families, couples and adventure travelers."
            ),
            city="Manali",
            country="India",
            address="Old Manali Road, Himachal Pradesh",
            price_per_night=3800,
            rating=4.8,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1510798831971-661eb04b3739"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=8,
        ),

        Hotel(
            name="Royal Palace Hotel",
            description=(
                "Experience traditional Indian hospitality with "
                "luxurious rooms, elegant interiors and premium service."
            ),
            city="Jaipur",
            country="India",
            address="MI Road, Jaipur, Rajasthan",
            price_per_night=5200,
            rating=4.7,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1600607687939-ce8a6c25118c"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=15,
        ),

        Hotel(
            name="Sea Breeze Resort",
            description=(
                "Relax beside the sea in this modern coastal resort "
                "featuring spacious rooms and excellent dining options."
            ),
            city="Kochi",
            country="India",
            address="Marine Drive, Kochi, Kerala",
            price_per_night=4200,
            rating=4.5,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1566073771259-6a8506099945"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=10,
        ),

        Hotel(
            name="Grand Horizon Hotel",
            description=(
                "A premium city hotel located close to major attractions "
                "with comfortable rooms and modern amenities."
            ),
            city="Mumbai",
            country="India",
            address="Andheri West, Mumbai, Maharashtra",
            price_per_night=6500,
            rating=4.4,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1551882547-ff40c63fe5fa"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=20,
        ),

        Hotel(
            name="Lakeview Paradise",
            description=(
                "A relaxing lakeside property with beautiful views, "
                "comfortable rooms and a peaceful atmosphere."
            ),
            city="Udaipur",
            country="India",
            address="Lake Pichola, Udaipur, Rajasthan",
            price_per_night=5800,
            rating=4.9,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1564501049412-61c2a3083791"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=6,
        ),

        Hotel(
            name="Palm Grove Resort",
            description=(
                "A tropical resort surrounded by palm trees and greenery, "
                "ideal for a relaxing vacation."
            ),
            city="Pondicherry",
            country="India",
            address="White Town, Puducherry",
            price_per_night=3500,
            rating=4.3,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1584132967334-10e028bd69f7"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=18,
        ),

        Hotel(
            name="Skyline Luxury Suites",
            description=(
                "Modern luxury suites in the heart of the city with "
                "premium rooms, fine dining and excellent service."
            ),
            city="Bengaluru",
            country="India",
            address="MG Road, Bengaluru, Karnataka",
            price_per_night=7200,
            rating=4.8,
            image_url=(
                "https://images.unsplash.com/"
                "photo-1566073771259-6a8506099945"
                "?auto=format&fit=crop&w=1200&q=80"
            ),
            available_rooms=14,
        ),
    ]

    db.add_all(hotels)
    db.commit()

    print(f"{len(hotels)} hotels seeded successfully.")


# ============================================================
# MAIN
# ============================================================

def main():
    print("=" * 50)
    print("       TravelEase Database Seeder")
    print("=" * 50)

    try:
        seed_users()
        seed_hotels()

        print("\n" + "=" * 50)
        print("Database seeding completed successfully.")
        print("=" * 50)

    except Exception as e:
        db.rollback()

        print("\nDatabase seeding failed.")
        print(f"Error: {e}")

        raise

    finally:
        db.close()


if __name__ == "__main__":
    main()