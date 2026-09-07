from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.deps import get_db, get_current_user
from app.models.hosted_zone import HostedZone
from app.models.user import User
from app.schemas.hosted_zone import (
    HostedZoneCreate,
    HostedZoneUpdate,
    HostedZoneResponse,
)


router = APIRouter(
    prefix="/hosted-zones",
    tags=["Hosted Zones"],
)


# CREATE Hosted Zone
@router.post("", response_model=HostedZoneResponse)
def create_hosted_zone(
    hosted_zone: HostedZoneCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_zone = (
        db.query(HostedZone)
        .filter(
            HostedZone.name == hosted_zone.name,
            HostedZone.user_id == current_user.id,
        )
        .first()
    )

    if existing_zone:
        raise HTTPException(
            status_code=409,
            detail="Hosted Zone already exists",
        )

    new_hosted_zone = HostedZone(
        user_id=current_user.id,
        name=hosted_zone.name,
        description=hosted_zone.description,
        zone_type=hosted_zone.zone_type,
    )

    db.add(new_hosted_zone)
    db.commit()
    db.refresh(new_hosted_zone)

    return new_hosted_zone


# GET Hosted Zones
@router.get("", response_model=list[HostedZoneResponse])
def get_hosted_zones(
    search: str | None = None,
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    query = db.query(HostedZone).filter(
        HostedZone.user_id == current_user.id
    )

    if search:
        query = query.filter(
            HostedZone.name.ilike(f"%{search}%")
        )

    offset = (page - 1) * limit

    hosted_zones = (
        query
        .offset(offset)
        .limit(limit)
        .all()
    )

    return hosted_zones


# GET One Hosted Zone
@router.get("/{hosted_zone_id}", response_model=HostedZoneResponse)
def get_hosted_zone(
    hosted_zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hosted_zone = (
        db.query(HostedZone)
        .filter(
            HostedZone.id == hosted_zone_id,
            HostedZone.user_id == current_user.id,
        )
        .first()
    )

    if not hosted_zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted Zone not found",
        )

    return hosted_zone


# UPDATE Hosted Zone
@router.put("/{hosted_zone_id}", response_model=HostedZoneResponse)
def update_hosted_zone(
    hosted_zone_id: int,
    hosted_zone_data: HostedZoneUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hosted_zone = (
        db.query(HostedZone)
        .filter(
            HostedZone.id == hosted_zone_id,
            HostedZone.user_id == current_user.id,
        )
        .first()
    )

    if not hosted_zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted Zone not found",
        )

    update_data = hosted_zone_data.model_dump(
        exclude_unset=True
    )

    # Check duplicates if name changes
    if "name" in update_data:
        existing_zone = (
            db.query(HostedZone)
            .filter(
                HostedZone.name == update_data["name"],
                HostedZone.user_id == current_user.id,
                HostedZone.id != hosted_zone_id,
            )
            .first()
        )

        if existing_zone:
            raise HTTPException(
                status_code=409,
                detail="Hosted Zone with this name already exists",
            )

    for key, value in update_data.items():
        setattr(hosted_zone, key, value)

    db.commit()
    db.refresh(hosted_zone)

    return hosted_zone


# DELETE Hosted Zone
@router.delete("/{hosted_zone_id}")
def delete_hosted_zone(
    hosted_zone_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    hosted_zone = (
        db.query(HostedZone)
        .filter(
            HostedZone.id == hosted_zone_id,
            HostedZone.user_id == current_user.id,
        )
        .first()
    )

    if not hosted_zone:
        raise HTTPException(
            status_code=404,
            detail="Hosted Zone not found",
        )

    db.delete(hosted_zone)
    db.commit()

    return {
        "message": "Hosted Zone deleted successfully"
    }