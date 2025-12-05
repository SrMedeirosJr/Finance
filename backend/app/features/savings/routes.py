from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.features.savings.models import Saving
from app.features.savings.schemas import SavingCreate, SavingOut
from app.features.users.models import User

router = APIRouter(prefix="/savings", tags=["savings"])


@router.get("/", response_model=list[SavingOut])
def list_savings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    savings = (
        db.query(Saving)
        .filter(Saving.user_id == current_user.id)
        .order_by(Saving.date.desc())
        .all()
    )
    return savings


@router.post("/", response_model=SavingOut)
def create_saving(
    data: SavingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    saving = Saving(**data.model_dump(), user_id=current_user.id)
    db.add(saving)
    db.commit()
    db.refresh(saving)
    return saving


@router.delete("/{saving_id}")
def delete_saving(
    saving_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    saving = (
        db.query(Saving)
        .filter(Saving.id == saving_id, Saving.user_id == current_user.id)
        .first()
    )
    if not saving:
        raise HTTPException(status_code=404, detail="Reserva não encontrada")
    db.delete(saving)
    db.commit()
    return {"ok": True}
