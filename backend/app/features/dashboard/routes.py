from calendar import monthrange
from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.features.entries.models import Entry
from app.features.expenses.models import Expense
from app.features.accounts.models import AccountBill
from app.features.savings.models import Saving
from app.features.users.models import User

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/{year}/{month}")
def get_dashboard(
    year: int,
    month: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    start_date = date(year, month, 1)
    end_date = date(year, month, monthrange(year, month)[1])

    # Total de entradas
    total_entries = (
        db.query(func.coalesce(func.sum(Entry.value), 0))
        .filter(
            Entry.user_id == current_user.id,
            Entry.date.between(start_date, end_date),
        )
        .scalar()
    )

    # Total de gastos
    total_expenses = (
        db.query(func.coalesce(func.sum(Expense.value), 0))
        .filter(
            Expense.user_id == current_user.id,
            Expense.date.between(start_date, end_date),
        )
        .scalar()
    )

    # Por forma de pagamento (crédito, débito)
    expenses_by_payment = (
        db.query(Expense.payment_method, func.coalesce(func.sum(Expense.value), 0))
        .filter(
            Expense.user_id == current_user.id,
            Expense.date.between(start_date, end_date),
        )
        .group_by(Expense.payment_method)
        .all()
    )

    # Por categoria (para o gráfico de alocação de categorias)
    expenses_by_category = (
        db.query(Expense.category, func.coalesce(func.sum(Expense.value), 0))
        .filter(
            Expense.user_id == current_user.id,
            Expense.date.between(start_date, end_date),
        )
        .group_by(Expense.category)
        .all()
    )

    # Contas pagas / pendentes (fluxo de contas)
    total_planned_bills = (
        db.query(func.coalesce(func.sum(AccountBill.planned_value), 0))
        .filter(AccountBill.user_id == current_user.id)
        .scalar()
    )
    total_paid_bills = (
        db.query(func.coalesce(func.sum(AccountBill.paid_value), 0))
        .filter(AccountBill.user_id == current_user.id, AccountBill.is_paid.is_(True))
        .scalar()
    )

    # Reservas / investimentos no mês
    savings_month = (
        db.query(func.coalesce(func.sum(Saving.value), 0))
        .filter(
            Saving.user_id == current_user.id,
            Saving.date.between(start_date, end_date),
        )
        .scalar()
    )

    remaining_to_spend = float(total_entries) - float(total_expenses)

    return {
        "total_entries": float(total_entries),
        "total_expenses": float(total_expenses),
        "remaining_to_spend": remaining_to_spend,
        "expenses_by_payment": [
            {"payment_method": pm, "value": float(v)} for pm, v in expenses_by_payment
        ],
        "expenses_by_category": [
            {"category": c, "value": float(v)} for c, v in expenses_by_category
        ],
        "bills": {
            "total_planned": float(total_planned_bills),
            "total_paid": float(total_paid_bills),
        },
        "savings_month": float(savings_month),
    }
