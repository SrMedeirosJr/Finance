from functools import lru_cache

from pydantic import PostgresDsn
from pydantic_settings import BaseSettings  # <- AGORA VEM DAQUI


class Settings(BaseSettings):
    PROJECT_NAME: str = "FinancePessoal API"
    API_V1_PREFIX: str = "/api"

    # Banco
    DATABASE_URL: PostgresDsn | str = (
        "postgresql+psycopg2://postgres:postgres@db:5432/finance_db"
    )

    # Auth
    JWT_SECRET_KEY: str = "e4e2c9b0f87c72cd83ab9f6d33d3c8dcf4d9ff08c69012ab5efb4d0b19aa31fb"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 dia

    class Config:
        env_file = ".env"
        extra = "ignore"  # ignora variáveis a mais, se tiver


@lru_cache
def get_settings() -> Settings:
    return Settings()
