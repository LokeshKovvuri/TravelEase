from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class ProfileResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    phone: str | None = None
    gender: str | None = None
    date_of_birth: date | None = None
    profile_image: str | None = None
    is_active: bool
    created_at: datetime
    updated_at: datetime | None = None

    model_config = {
        "from_attributes": True
    }


class ProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: str | None = None
    gender: str | None = None
    date_of_birth: date | None = None
    profile_image: str | None = None


class ChangePasswordRequest(BaseModel):
    old_password: str
    new_password: str