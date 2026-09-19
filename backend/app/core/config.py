import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    """Application settings loaded from environment variables.

    Keeping configuration here prevents development-only addresses and
    credentials from leaking into source code or production deployments.
    """

    def __init__(self):
        self.project_name = os.getenv("APP_NAME", "TravelEase")
        self.database_url = os.getenv("DATABASE_URL")
        self.secret_key = os.getenv("SECRET_KEY")
        self.algorithm = os.getenv("ALGORITHM", "HS256")
        self.access_token_expire_minutes = int(
            os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
        )
        self.debug = os.getenv("DEBUG", "false").lower() == "true"
        self.frontend_url = os.getenv(
            "FRONTEND_URL",
            "http://localhost:5173",
        ).rstrip("/")
        self.cors_origins = self._get_cors_origins()
        self.payment_provider = os.getenv(
            "PAYMENT_PROVIDER",
            "mock",
        ).strip().lower()
        self.allow_mock_payments = (
            os.getenv("ALLOW_MOCK_PAYMENTS", "false").lower() == "true"
        )
        self.payment_hold_minutes = int(
            os.getenv("PAYMENT_HOLD_MINUTES", "30")
        )
        self.stripe_secret_key = os.getenv("STRIPE_SECRET_KEY")
        self.stripe_webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        self.openai_model = os.getenv("OPENAI_MODEL", "gpt-5-mini")

        if self.payment_hold_minutes < 1:
            raise ValueError("PAYMENT_HOLD_MINUTES must be at least 1")
        # Stripe Checkout sessions may not expire earlier than 30 minutes.
        # Keep the inventory hold and provider checkout lifetime aligned.
        if self.payment_provider == "stripe" and self.payment_hold_minutes < 30:
            raise ValueError(
                "PAYMENT_HOLD_MINUTES must be at least 30 for Stripe Checkout"
            )

    def _get_cors_origins(self) -> list[str]:
        configured_origins = os.getenv("CORS_ORIGINS", "")
        origins = [
            origin.strip().rstrip("/")
            for origin in configured_origins.split(",")
            if origin.strip()
        ]
        return origins or [self.frontend_url]


settings = Settings()
