"""Payment-provider adapters.

The application deliberately keeps card and UPI details out of its own API.
Stripe Checkout collects payment data on Stripe's hosted page, and the webhook
is the only production path that changes a booking to CONFIRMED.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import json
import time
import uuid
from dataclasses import dataclass
from decimal import Decimal, ROUND_HALF_UP
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from app.core.config import settings


class PaymentGatewayError(Exception):
    """A safe error that can be returned to the API caller."""


@dataclass(frozen=True)
class CheckoutSession:
    provider: str
    transaction_id: str
    status: str
    checkout_url: str | None = None
    provider_payment_id: str | None = None


class MockPaymentGateway:
    """Local-only gateway for development and automated tests."""

    provider_name = "mock"

    def create_checkout(
        self,
        *,
        payment_id: int,
        booking_id: int,
        amount: float,
        description: str,
    ) -> CheckoutSession:
        if not (settings.debug or settings.allow_mock_payments):
            raise PaymentGatewayError(
                "Mock payments are disabled. Configure Stripe for production."
            )

        transaction_id = f"mock_{uuid.uuid4().hex}"
        return CheckoutSession(
            provider=self.provider_name,
            transaction_id=transaction_id,
            provider_payment_id=transaction_id,
            status="SUCCESS",
        )


class StripeCheckoutGateway:
    """Create hosted Stripe Checkout sessions without storing payment data."""

    provider_name = "stripe"
    checkout_url = "https://api.stripe.com/v1/checkout/sessions"

    def __init__(self, secret_key: str | None):
        if not secret_key:
            raise PaymentGatewayError(
                "Stripe is selected but STRIPE_SECRET_KEY is not configured."
            )
        self.secret_key = secret_key

    def create_checkout(
        self,
        *,
        payment_id: int,
        booking_id: int,
        amount: float,
        description: str,
    ) -> CheckoutSession:
        amount_minor = int(
            (Decimal(str(amount)) * Decimal("100")).quantize(
                Decimal("1"),
                rounding=ROUND_HALF_UP,
            )
        )
        if amount_minor <= 0:
            raise PaymentGatewayError("Payment amount must be greater than zero.")

        success_url = (
            f"{settings.frontend_url}/booking-success?booking_id={booking_id}"
            "&session_id={CHECKOUT_SESSION_ID}"
        )
        cancel_url = f"{settings.frontend_url}/payment/{booking_id}?cancelled=1"
        payload = {
            "mode": "payment",
            "success_url": success_url,
            "cancel_url": cancel_url,
            "client_reference_id": str(payment_id),
            "expires_at": str(
                int(time.time()) + settings.payment_hold_minutes * 60
            ),
            "metadata[payment_id]": str(payment_id),
            "metadata[booking_id]": str(booking_id),
            "line_items[0][price_data][currency]": "inr",
            "line_items[0][price_data][product_data][name]": description,
            "line_items[0][price_data][unit_amount]": str(amount_minor),
            "line_items[0][quantity]": "1",
        }
        encoded = urlencode(payload).encode("utf-8")
        basic_token = base64.b64encode(
            f"{self.secret_key}:".encode("utf-8")
        ).decode("ascii")
        request = Request(
            self.checkout_url,
            data=encoded,
            headers={
                "Authorization": f"Basic {basic_token}",
                "Content-Type": "application/x-www-form-urlencoded",
            },
            method="POST",
        )

        try:
            with urlopen(request, timeout=15) as response:
                session = json.loads(response.read().decode("utf-8"))
        except HTTPError as error:
            # Avoid returning provider internals or credentials to clients.
            raise PaymentGatewayError(
                "The payment provider could not start checkout. Please try again."
            ) from error
        except URLError as error:
            raise PaymentGatewayError(
                "The payment provider is temporarily unavailable."
            ) from error

        session_id = session.get("id")
        checkout_url = session.get("url")
        if not session_id or not checkout_url:
            raise PaymentGatewayError("The payment provider returned an invalid checkout session.")

        return CheckoutSession(
            provider=self.provider_name,
            transaction_id=session_id,
            provider_payment_id=session_id,
            checkout_url=checkout_url,
            status="PENDING",
        )


def get_payment_gateway():
    if settings.payment_provider == "stripe":
        return StripeCheckoutGateway(settings.stripe_secret_key)
    if settings.payment_provider == "mock":
        return MockPaymentGateway()
    raise PaymentGatewayError(
        "PAYMENT_PROVIDER must be configured as 'stripe' or 'mock'."
    )


def verify_stripe_signature(payload: bytes, signature_header: str | None) -> None:
    """Verify Stripe's signed webhook envelope before processing an event."""
    if not settings.stripe_webhook_secret:
        raise PaymentGatewayError("STRIPE_WEBHOOK_SECRET is not configured.")
    if not signature_header:
        raise PaymentGatewayError("Missing Stripe signature.")

    parts = {}
    for item in signature_header.split(","):
        key, separator, value = item.partition("=")
        if separator:
            parts.setdefault(key, []).append(value)

    timestamps = parts.get("t", [])
    signatures = parts.get("v1", [])
    if len(timestamps) != 1 or not signatures:
        raise PaymentGatewayError("Invalid Stripe signature.")

    try:
        timestamp = int(timestamps[0])
    except ValueError as error:
        raise PaymentGatewayError("Invalid Stripe signature timestamp.") from error

    if abs(time.time() - timestamp) > 300:
        raise PaymentGatewayError("Expired Stripe signature.")

    signed_payload = f"{timestamp}.".encode("utf-8") + payload
    expected = hmac.new(
        settings.stripe_webhook_secret.encode("utf-8"),
        signed_payload,
        hashlib.sha256,
    ).hexdigest()
    if not any(hmac.compare_digest(expected, signature) for signature in signatures):
        raise PaymentGatewayError("Invalid Stripe signature.")
