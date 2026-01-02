import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db.database import SessionLocal
from app.db.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__truncate_error=False,  # allow >72 bytes by truncating internally
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class AuthRequest(BaseModel):
    email: EmailStr
    password: str


class AuthResponse(BaseModel):
    token: str
    user_id: str


def _sanitize_password(raw: str) -> str:
    # bcrypt ignores bytes beyond 72; truncate to avoid ValueError
    return raw.encode("utf-8")[:72].decode("utf-8", errors="ignore")


@router.post("/signup", response_model=AuthResponse)
def signup(payload: AuthRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    password = _sanitize_password(payload.password)
    user = User(
        email=payload.email,
        hashed_password=pwd_context.hash(password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = uuid.uuid4().hex
    return {"token": token, "user_id": payload.email}


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    password = _sanitize_password(payload.password)
    if not user or not pwd_context.verify(password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = uuid.uuid4().hex
    return {"token": token, "user_id": payload.email}
