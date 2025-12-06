from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.features.entries.models import Entry
from app.features.entries.schemas import EntryCreate, EntryOut
from app.features.users.models import User

router = APIRouter(prefix="/entries", tags=["entries"])


@router.get("/", response_model=list[EntryOut])
def list_entries(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entries = (
        db.query(Entry)
        .filter(Entry.user_id == current_user.id)
        .order_by(Entry.date.desc())
        .all()
    )
    return entries


@router.post("/", response_model=EntryOut, status_code=status.HTTP_201_CREATED)
def create_entry(
    entry_in: EntryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = Entry(
        user_id=current_user.id,
        name=entry_in.name,
        value=entry_in.value,
        date=entry_in.date,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


@router.delete("/{entry_id}")
def delete_entry(
    entry_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    entry = (
        db.query(Entry)
        .filter(Entry.id == entry_id, Entry.user_id == current_user.id)
        .first()
    )
    if not entry:
        raise HTTPException(status_code=404, detail="Entrada não encontrada")
    db.delete(entry)
    db.commit()
    return {"ok": True}
