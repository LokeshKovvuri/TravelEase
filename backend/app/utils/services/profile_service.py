from sqlalchemy.orm import Session

from app.models.user import User
from app.repositories.profile_repository import ProfileRepository
from app.schemas.profile import ProfileUpdate 
from fastapi import HTTPException

from app.core.security import (
    verify_password,
    hash_password,
)
from app.schemas.profile import ChangePasswordRequest


class ProfileService:

    @staticmethod
    def get_profile(
        db: Session,
        current_user: User,
    ):
        return ProfileRepository.get_by_id(
            db,
            current_user.id,
        )

    
    @staticmethod
    def update_profile(
        db: Session,
        current_user: User,
        data: ProfileUpdate,
    ):

        user = ProfileRepository.get_by_id(
            db,
            current_user.id,
        )

        user.first_name = data.first_name
        user.last_name = data.last_name
        user.phone = data.phone
        user.gender = data.gender
        user.date_of_birth = data.date_of_birth
        user.profile_image = data.profile_image

        return ProfileRepository.update(
            db,
            user,
        )

    @staticmethod
    def get_bookings(
        db: Session,
        current_user: User,
    ):
        return ProfileRepository.get_bookings(
            db,
            current_user.id,
        )

    @staticmethod
    def get_payments(
        db: Session,
        current_user: User,
    ):
        return ProfileRepository.get_payments(
            db,
            current_user.id,
        )

    @staticmethod
    def get_reviews(
        db: Session,
        current_user: User,
    ):
        return ProfileRepository.get_reviews(
            db,
            current_user.id,
        )

    @staticmethod
    def change_password(
        db: Session,
        current_user: User,
        data: ChangePasswordRequest,
    ):

        user = ProfileRepository.get_by_id(
            db,
            current_user.id,
       )

        if not verify_password(
           data.old_password,
           user.password,
       ):
           raise HTTPException(
               status_code=400,
               detail="Old password is incorrect",
           )

        user.password = hash_password(
           data.new_password
        )

        return ProfileRepository.update(
             db,
             user,
        )