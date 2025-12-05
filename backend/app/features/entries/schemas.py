from datetime import date
from pydantic import BaseModel


class EntryBase(BaseModel):
    name: str
    value: float
    date: date


class EntryCreate(EntryBase):
    pass


class EntryOut(EntryBase):
    id: str

    class Config:
        from_attributes = True
