from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.db.session import engine
from app.db.base import Base

from app.features.users.routes import router as users_router
from app.features.entries.routes import router as entries_router
from app.features.expenses.routes import router as expenses_router
from app.features.accounts.routes import router as accounts_router
from app.features.savings.routes import router as savings_router
from app.features.dashboard.routes import router as dashboard_router

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

# CORS – ajusta depois pro domínio do front
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Rotas
app.include_router(users_router, prefix=settings.API_V1_PREFIX)
app.include_router(entries_router, prefix=settings.API_V1_PREFIX)
app.include_router(expenses_router, prefix=settings.API_V1_PREFIX)
app.include_router(accounts_router, prefix=settings.API_V1_PREFIX)
app.include_router(savings_router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard_router, prefix=settings.API_V1_PREFIX)
