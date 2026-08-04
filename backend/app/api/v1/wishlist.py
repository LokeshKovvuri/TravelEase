from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.database.session import get_db
from app.models.user import User
from app.schemas.wishlist import WishlistCreate, WishlistResponse
from app.services.wishlist_service import WishlistService

router = APIRouter(
    prefix="/api/v1/wishlist",
    tags=["Wishlist"],
)


@router.post(
    "/",
    response_model=WishlistResponse,
)
def add_to_wishlist(
    wishlist: WishlistCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return WishlistService.add_to_wishlist(
        db,
        current_user,
        wishlist,
    )


@router.get(
    "/",
    response_model=list[WishlistResponse],
)
def get_my_wishlist(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return WishlistService.get_wishlist(
        db,
        current_user,
    )

@router.delete("/{hotel_id}")
def remove_from_wishlist(
    hotel_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return WishlistService.remove_from_wishlist(
        db,
        current_user,
        hotel_id,
    )