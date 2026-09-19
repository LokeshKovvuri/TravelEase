from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.hotels import router as hotels_router
from app.api.v1.rooms import router as rooms_router
from app.api.v1.bookings import router as bookings_router
from app.api.v1.payments import router as payments_router
from app.api.v1.reviews import router as reviews_router
from app.api.v1.profile import router as profile_router
from app.api.v1.wishlist import router as wishlist_router
from app.api.v1.email import router as email_router
#from app.api.v1.invoice import router as invoice_router##
from app.api.v1.invoices import router as invoice_router
from app.api.v1.flights import router as flight_router
from app.api.v1.trains import router as train_router
from app.api.v1.buses import router as bus_router
from app.api.v1.cabs import router as cab_router
from app.api.v1.ai import router as ai_router

app = FastAPI(
    title=settings.project_name,
    description="Travel Booking Platform API",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register all routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(hotels_router)
app.include_router(rooms_router)
app.include_router(bookings_router)
app.include_router(payments_router)
app.include_router(reviews_router)
app.include_router(profile_router)
app.include_router(wishlist_router)
app.include_router(email_router)
app.include_router(invoice_router)
#app.include_router(invoice_router)#
app.include_router(flight_router)
app.include_router(train_router)
app.include_router(bus_router)
app.include_router(cab_router)
app.include_router(ai_router)

@app.get("/")
async def root():
    return {
        "message": "Welcome to TravelEase 🚀",
        "version": "1.0.0",
        "status": "Running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }
