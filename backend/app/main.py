from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext
from app.db.database import engine, Base, SessionLocal
from app.db.models import User
from app.api.chat import router as chat_router
from app.api.revise import router as revise_router
from app.api.auth import router as auth_router

app = FastAPI()

# create tables on startup
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://your-frontend.onrender.com",  # replace with actual Render frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(revise_router)
app.include_router(auth_router)


pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__truncate_error=False,  # allow >72 bytes by truncating internally
)


def ensure_demo_user():
    """Create a demo user if none exists, so login with demo creds works."""
    db = SessionLocal()
    try:
        email = "demo@example.com"
        password = "password123"
        existing = db.query(User).filter(User.email == email).first()
        if existing:
            return
        safe_pw = password.encode("utf-8")[:72].decode("utf-8", errors="ignore")
        demo = User(email=email, hashed_password=pwd_context.hash(safe_pw))
        db.add(demo)
        db.commit()
    finally:
        db.close()


@app.on_event("startup")
def startup_seed():
    ensure_demo_user()


@app.get("/health")
def health():
    return {"status": "ok"}
