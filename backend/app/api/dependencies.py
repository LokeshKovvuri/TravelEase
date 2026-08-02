from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.oauth2 import oauth2_scheme
from app.core.security import verify_access_token
from app.database.session import get_db
from app.repositories.user_repository import UserRepository


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    email = verify_access_token(token)

    if email is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    user = UserRepository.get_by_email(db, email)

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="User not found"
        )

    return user