from datetime import date
from pydantic import BaseModel


class ExpenseBase(BaseModel):
    category: str
    payment_method: str
    value: float
    date: date
    essential: bool = False


class ExpenseCreate(ExpenseBase):
    pass


class ExpenseOut(ExpenseBase):
    id: str

    class Config:
        from_attributes = True
