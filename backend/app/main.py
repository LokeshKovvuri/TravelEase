from fastapi import FastAPI

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.hotels import router as hotels_router

app = FastAPI(
    title="TravelEase API",
    description="Travel Booking Platform API",
    version="1.0.0"
)

# Register all routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(hotels_router)

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