from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.core.deps import get_db, get_current_user
from app.features.expenses.models import Expense
from app.features.expenses.schemas import ExpenseCreate, ExpenseOut, ExpenseCategorySummaryOut
from app.features.users.models import User




router = APIRouter(prefix="/expenses", tags=["expenses"])


@router.get("/", response_model=list[ExpenseOut])
def list_expenses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expenses = (
        db.query(Expense)
        .filter(Expense.user_id == current_user.id)
        .order_by(Expense.date.desc())
        .all()
    )
    return expenses


@router.post("/", response_model=ExpenseOut, status_code=status.HTTP_201_CREATED)
def create_expense(
    data: ExpenseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = Expense(**data.model_dump(), user_id=current_user.id)
    db.add(expense)
    db.commit()
    db.refresh(expense)
    return expense


@router.delete("/{expense_id}")
def delete_expense(
    expense_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    expense = (
        db.query(Expense)
        .filter(Expense.id == expense_id, Expense.user_id == current_user.id)
        .first()
    )
    if not expense:
        raise HTTPException(status_code=404, detail="Gasto não encontrado")
    db.delete(expense)
    db.commit()
    return {"ok": True}


@router.get(
    "/summary/by-category",
    response_model=list[ExpenseCategorySummaryOut],
)
def summary_by_category(
    year: int = Query(..., ge=2000),
    month: int = Query(..., ge=1, le=12),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retorna o total gasto por categoria no mês/ano informado
    para o usuário logado.
    """
    query = (
        db.query(
            Expense.category.label("category"),
            func.sum(Expense.value).label("total"),
        )
        .filter(
            Expense.user_id == current_user.id,
            func.extract("year", Expense.date) == year,
            func.extract("month", Expense.date) == month,
        )
        .group_by(Expense.category)
        .order_by(func.sum(Expense.value).desc())
    )

    results = query.all()
    return [
        ExpenseCategorySummaryOut(category=row.category, total=row.total)
        for row in results
    ]