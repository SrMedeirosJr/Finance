from datetime import date
from pydantic import BaseModel


class SavingBase(BaseModel):
    name: str
    saving_type: str
    value: float
    date: date


class SavingCreate(SavingBase):
    pass


class SavingOut(SavingBase):
    id: str

    class Config:
        from_attributes = True
