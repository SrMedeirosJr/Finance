from datetime import date
from pydantic import BaseModel


class AccountBillBase(BaseModel):
    name: str
    planned_value: float
    paid_value: float | None = None
    paid_date: date | None = None
    is_paid: bool = False


class AccountBillCreate(AccountBillBase):
    pass


class AccountBillOut(AccountBillBase):
    id: str

    class Config:
        from_attributes = True
