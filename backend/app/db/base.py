# backend/app/db/base.py

from sqlalchemy.orm import DeclarativeBase


# Classe base do SQLAlchemy
class Base(DeclarativeBase):
    pass


# IMPORTA MODELS PARA REGISTRAR NA METADATA DO ALEMBIC
# (não remova esses imports, eles são essenciais)
from app.features.users.models import User  # noqa: F401
from app.features.entries.models import Entry  # noqa: F401
