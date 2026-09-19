"""Travel planning with an optional server-side OpenAI integration.

The local ranking mode is intentionally useful on its own. It keeps the trip
planner available in development and if an AI provider is temporarily down,
while OpenAI receives only a compact, current inventory summary when enabled.
"""

from __future__ import annotations

import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.core.config import settings
from app.models.hotel import Hotel
from app.schemas.ai import TripPlanHotel, TripPlanRequest, TripPlanResponse


class TravelPlannerService:
    @staticmethod
    def create_plan(db: Session, request: TripPlanRequest) -> TripPlanResponse:
        recommendations, matched_destination = TravelPlannerService._recommend(
            db,
            request,
        )
        fallback = TravelPlannerService._local_plan(
            request,
            recommendations,
            matched_destination,
        )

        if not settings.openai_api_key:
            return fallback

        try:
            advice = TravelPlannerService._openai_plan(
                request,
                recommendations,
                matched_destination,
            )
            return TripPlanResponse(
                advice=advice,
                recommendations=recommendations,
                provider="openai",
            )
        except (HTTPError, URLError, TimeoutError, ValueError, json.JSONDecodeError):
            return fallback.model_copy(
                update={
                    "notice": "AI is temporarily unavailable, so this plan uses live TravelEase inventory instead.",
                }
            )

    @staticmethod
    def _recommend(
        db: Session,
        request: TripPlanRequest,
    ) -> tuple[list[TripPlanHotel], bool]:
        query = db.query(Hotel)
        matched_destination = False

        if request.destination and request.destination.strip():
            destination = request.destination.strip()
            query = query.filter(
                or_(
                    Hotel.city.ilike(f"%{destination}%"),
                    Hotel.country.ilike(f"%{destination}%"),
                )
            )
            matched_destination = True

        hotels = query.all()
        if request.budget_per_night is not None:
            hotels = [
                hotel
                for hotel in hotels
                if hotel.price_per_night <= request.budget_per_night
            ]

        hotels.sort(
            key=lambda hotel: (
                -(hotel.rating or 0),
                hotel.price_per_night,
                hotel.name.lower(),
            )
        )

        return [
            TripPlanHotel(
                id=hotel.id,
                name=hotel.name,
                city=hotel.city,
                country=hotel.country,
                price_per_night=hotel.price_per_night,
                rating=hotel.rating or 0,
                image_url=hotel.image_url,
            )
            for hotel in hotels[:3]
        ], matched_destination

    @staticmethod
    def _local_plan(
        request: TripPlanRequest,
        recommendations: list[TripPlanHotel],
        matched_destination: bool,
    ) -> TripPlanResponse:
        destination = request.destination.strip() if request.destination else "your next destination"
        budget = (
            f" around ₹{request.budget_per_night:,.0f} per night"
            if request.budget_per_night is not None
            else ""
        )
        interest_note = (
            f" Your preferences: {request.interests.strip()}."
            if request.interests and request.interests.strip()
            else ""
        )

        if not recommendations:
            advice = (
                f"I could not find a listed stay for {destination}. "
                "Try a nearby city or clear the destination filter to browse the full catalogue."
            )
        else:
            names = ", ".join(hotel.name for hotel in recommendations)
            scope = "matching" if matched_destination else "top-rated available"
            advice = (
                f"For {request.nights} night(s) in {destination}{budget}, I found these {scope} stays: {names}. "
                "Open a stay to compare its room types and current availability before reserving."
                f"{interest_note}"
            )

        return TripPlanResponse(
            advice=advice,
            recommendations=recommendations,
            provider="local",
        )

    @staticmethod
    def _openai_plan(
        request: TripPlanRequest,
        recommendations: list[TripPlanHotel],
        matched_destination: bool,
    ) -> str:
        inventory = [hotel.model_dump() for hotel in recommendations]
        prompt = {
            "traveller_request": request.model_dump(),
            "destination_matched": matched_destination,
            "current_hotel_inventory": inventory,
        }
        payload = {
            "model": settings.openai_model,
            "store": False,
            "max_output_tokens": 350,
            "instructions": (
                "You are TravelEase's concise trip planner. Use only the supplied "
                "hotel inventory for recommendations. Do not invent hotels, prices, "
                "availability, promotions, weather, or transport schedules. Give a "
                "short plan in plain text with three practical bullets. If the inventory "
                "is empty, say so and suggest adjusting the destination or budget."
            ),
            "input": json.dumps(prompt, ensure_ascii=False),
        }
        body = json.dumps(payload).encode("utf-8")
        api_request = Request(
            "https://api.openai.com/v1/responses",
            data=body,
            headers={
                "Authorization": f"Bearer {settings.openai_api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        with urlopen(api_request, timeout=20) as response:
            response_payload: dict[str, Any] = json.loads(response.read().decode("utf-8"))

        text = response_payload.get("output_text") or ""
        if not text:
            text = "\n".join(
                content.get("text", "")
                for output in response_payload.get("output", [])
                for content in output.get("content", [])
                if content.get("type") == "output_text"
            )
        if not text.strip():
            raise ValueError("OpenAI returned no planner text")
        return text.strip()
