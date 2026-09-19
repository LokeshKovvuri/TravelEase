from datetime import datetime

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    Query,
)

from sqlalchemy.orm import Session

from app.api.dependencies import require_admin
from app.database.session import get_db

from app.schemas.bus import (
    BusCreate,
    BusUpdate,
    BusResponse,
)

from app.services.bus_service import (
    BusService,
)


router = APIRouter(
    prefix="/api/v1/buses",
    tags=["Buses"],
)


# ============================================================
# CREATE BUS
# ============================================================

@router.post(
    "/",
    response_model=BusResponse,
)
def create_bus(
    bus: BusCreate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return BusService.create(
            db,
            bus,
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# SEARCH BUSES
# ============================================================

@router.get(
    "/search",
    response_model=list[BusResponse],
)
def search_buses(
    origin: str | None = Query(
        default=None
    ),

    destination: str | None = Query(
        default=None
    ),

    departure_date: datetime | None = Query(
        default=None
    ),

    db: Session = Depends(get_db),
):

    return BusService.search(
        db=db,
        origin=origin,
        destination=destination,
        departure_date=departure_date,
    )


# ============================================================
# GET ALL BUSES
# ============================================================

@router.get(
    "/",
    response_model=list[BusResponse],
)
def get_buses(
    db: Session = Depends(get_db),
):

    return BusService.get_all(
        db
    )


# ============================================================
# GET SINGLE BUS
# ============================================================

@router.get(
    "/{bus_id}",
    response_model=BusResponse,
)
def get_bus(
    bus_id: int,
    db: Session = Depends(get_db),
):

    try:

        return BusService.get_by_id(
            db,
            bus_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


# ============================================================
# UPDATE BUS
# ============================================================

@router.put(
    "/{bus_id}",
    response_model=BusResponse,
)
def update_bus(
    bus_id: int,
    bus: BusUpdate,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return BusService.update(
            db=db,
            bus_id=bus_id,
            data=bus,
        )

    except Exception as e:

        raise HTTPException(
            status_code=400,
            detail=str(e),
        )


# ============================================================
# DELETE BUS
# ============================================================

@router.delete(
    "/{bus_id}",
)
def delete_bus(
    bus_id: int,
    _: object = Depends(require_admin),
    db: Session = Depends(get_db),
):

    try:

        return BusService.delete(
            db,
            bus_id,
        )

    except Exception as e:

        raise HTTPException(
            status_code=404,
            detail=str(e),
        )
