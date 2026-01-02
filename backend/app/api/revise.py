from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import ChatHistory, UserTopicStat, UserMistake

router = APIRouter(prefix="/revise")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/topics")
def topics(user_id: str, db: Session = Depends(get_db)):
    stats = (
        db.query(UserTopicStat)
        .filter(UserTopicStat.user_id == user_id)
        .order_by(UserTopicStat.confidence.asc())
        .all()
    )
    # if no stats yet, return empty
    return {
        "topics": [
            {"topic": s.topic, "confidence": s.confidence}
            for s in stats
        ]
    }


@router.get("/topic/{topic}")
def topic_detail(topic: str, user_id: str, db: Session = Depends(get_db)):
    # recent explanations
    recents = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == user_id, ChatHistory.topic == topic)
        .order_by(ChatHistory.created_at.desc())
        .limit(10)
        .all()
    )

    mistakes = (
        db.query(UserMistake)
        .filter(UserMistake.user_id == user_id, UserMistake.topic == topic)
        .order_by(UserMistake.frequency.desc())
        .limit(10)
        .all()
    )

    return {
        "topic": topic,
        "recents": [
            {
                "id": r.id,
                "created_at": r.created_at.isoformat(),
                "user_input": r.user_input,
                "response": r.response,
            }
            for r in recents
        ],
        "mistakes": [{"mistake": m.mistake, "frequency": m.frequency} for m in mistakes],
    }
