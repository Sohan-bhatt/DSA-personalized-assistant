import uuid
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from app.db.database import SessionLocal
from app.db.models import User

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


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


@router.post("/signup", response_model=AuthResponse)
def signup(payload: AuthRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=payload.email,
        hashed_password=pwd_context.hash(payload.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = uuid.uuid4().hex
    return {"token": token, "user_id": payload.email}


@router.post("/login", response_model=AuthResponse)
def login(payload: AuthRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == payload.email).first()
    if not user or not pwd_context.verify(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = uuid.uuid4().hex
    return {"token": token, "user_id": payload.email}
