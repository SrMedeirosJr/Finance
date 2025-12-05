import uuid
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Expense(Base):
    __tablename__ = "expenses"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True,default=uuid.uuid4,)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"),index=True,nullable=False,)
    category: Mapped[str] = mapped_column(String(100), nullable=False)
    payment_method: Mapped[str] = mapped_column(String(30), nullable=False)  # "Crédito", "Débito", "Pix", etc.
    value: Mapped[Decimal] = mapped_column(Numeric(12, 2), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    essential: Mapped[bool] = mapped_column(Boolean, default=False)
    installments: Mapped[str] = mapped_column( String(20), nullable=True, doc="Ex: '1/10', '2/10' etc.",)
    created_at: Mapped[datetime] = mapped_column( DateTime, default=datetime.utcnow,)
    updated_at: Mapped[datetime] = mapped_column(DateTime,default=datetime.utcnow,onupdate=datetime.utcnow,)

    user = relationship("User")
