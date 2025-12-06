from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.features.accounts.models import AccountBill
from app.features.accounts.schemas import AccountBillCreate, AccountBillOut
from app.features.users.models import User

router = APIRouter(prefix="/accounts", tags=["accounts"])


@router.get("/", response_model=list[AccountBillOut])
def list_accounts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bills = (
        db.query(AccountBill)
        .filter(AccountBill.user_id == current_user.id)
        .order_by(AccountBill.created_at.desc())
        .all()
    )
    return bills


@router.post("/", response_model=AccountBillOut, status_code=status.HTTP_201_CREATED)
def create_account_bill(
    bill_in: AccountBillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bill = AccountBill(**bill_in.model_dump(), user_id=current_user.id)
    db.add(bill)
    db.commit()
    db.refresh(bill)
    return bill


@router.delete("/{bill_id}")
def delete_account_bill(
    bill_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    bill = (
        db.query(AccountBill)
        .filter(AccountBill.id == bill_id, AccountBill.user_id == current_user.id)
        .first()
    )
    if not bill:
        raise HTTPException(status_code=404, detail="Conta não encontrado")
    db.delete(bill)
    db.commit()
    return {"ok": True}
