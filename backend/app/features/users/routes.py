# app/features/users/routes.py
from fastapi import APIRouter, Depends, HTTPException, status
# ❌ não vamos mais usar o OAuth2PasswordRequestForm
# from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.deps import get_db, get_current_user
from app.core.security import create_access_token, get_password_hash, verify_password
from app.features.users.models import User
from app.features.users.schemas import UserCreate, UserOut, Token, LoginRequest

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register-admin", response_model=UserOut)
def register_admin(data: UserCreate, db: Session = Depends(get_db)):
    """Cria o PRIMEIRO admin. Se já existir usuário, bloqueia."""
    existing_any = db.query(User).first()
    if existing_any:
        raise HTTPException(status_code=400, detail="Já existe usuário cadastrado.")

    hashed = get_password_hash(data.password)
    user = User(
        name=data.name,
        email=data.email,
        hashed_password=hashed,
        is_admin=True,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.post("/login", response_model=Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    # agora vem JSON: {"email": "...", "password": "..."}
    user: User | None = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="E-mail ou senha inválidos",
        )

    # pode usar email ou id como subject, tanto faz
    access_token = create_access_token(subject=user.email)
    return Token(access_token=access_token)


@router.get("/me", response_model=UserOut)
def read_me(current_user: User = Depends(get_current_user)):
    return current_user
