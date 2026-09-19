from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.database.session import get_db

from app.schemas.cab import (
    CabCreate,
    CabUpdate,
    CabResponse,
)

from app.services.cab_service import (
    CabService,
)


router = APIRouter(
    prefix="/api/v1/cabs",
    tags=["Cabs"],
)


# ============================================================
# CREATE CAB
# ============================================================

@router.post(
    "/",
    response_model=CabResponse,
)
def create_cab(
    cab: CabCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:
        return CabService.create(
            db,
            cab,
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# SEARCH CABS
# ============================================================

@router.get(
    "/search",
    response_model=list[CabResponse],
)
def search_cabs(
    origin: str | None = Query(
        default=None
    ),

    destination: str | None = Query(
        default=None
    ),

    vehicle_type: str | None = Query(
        default=None
    ),

    db: Session = Depends(get_db),
):

    return CabService.search(
        db=db,
        origin=origin,
        destination=destination,
        vehicle_type=vehicle_type,
    )


# ============================================================
# GET ALL
# ============================================================

@router.get(
    "/",
    response_model=list[CabResponse],
)
def get_cabs(
    db: Session = Depends(get_db),
):

    return CabService.get_all(
        db
    )


# ============================================================
# GET BY ID
# ============================================================

@router.get(
    "/{cab_id}",
    response_model=CabResponse,
)
def get_cab(
    cab_id: int,
    db: Session = Depends(get_db),
):

    try:

        return CabService.get_by_id(
            db,
            cab_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# UPDATE
# ============================================================

@router.put(
    "/{cab_id}",
    response_model=CabResponse,
)
def update_cab(
    cab_id: int,
    cab: CabUpdate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return CabService.update(
            db=db,
            cab_id=cab_id,
            data=cab,
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# DELETE
# ============================================================

@router.delete(
    "/{cab_id}",
)
def delete_cab(
    cab_id: int,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return CabService.delete(
            db,
            cab_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )
