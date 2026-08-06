from sqlalchemy.orm import Session

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate


class UserService:

    @staticmethod
    def register(db: Session, user: UserCreate):

        existing = UserRepository.get_by_email(db, user.email)

        if existing:
            raise Exception("Email already exists")

        new_user = User(
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=hash_password(user.password),
        )

        return UserRepository.create(db, new_user)

    @staticmethod
    def login(db: Session, email: str, password: str):

        user = UserRepository.get_by_email(db, email)

        if not user:
            raise Exception("Invalid email or password")

        if not verify_password(password, user.password):
            raise Exception("Invalid email or password")

        token = create_access_token(
            {"sub": user.email,
             "role":user.role,
             }
        )

        return {
            "access_token": token,
            "token_type": "bearer"
        }