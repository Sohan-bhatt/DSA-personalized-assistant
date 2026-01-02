from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.database import engine, Base
from app.api.chat import router as chat_router
from app.api.revise import router as revise_router
from app.api.auth import router as auth_router

app = FastAPI()

# create tables on startup
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(revise_router)
app.include_router(auth_router)
