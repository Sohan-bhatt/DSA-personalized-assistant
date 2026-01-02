import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.db.models import ChatHistory, UserMistake
from app.db.crud import log_mistake, get_or_create_topic_stat, update_topic_confidence
from app.services.embeddings import get_embedding
from app.services.confidence import update_confidence
from app.agents.agent1_context import extract_context
from app.agents.agent2_retrieval import retrieve_similar
from app.agents.agent3_response import generate_structured_response

router = APIRouter(prefix="/chat")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/")
def chat(payload: dict, db: Session = Depends(get_db)):
    user_id = payload.get("user_id", "demo_user")
    user_input = payload.get("message", "")

    context = extract_context(user_input)
    topic = (context.get("topic") or "general").strip().lower()

    # Pull user's top mistakes for this topic (for personalization)
    mistake_rows = (
        db.query(UserMistake)
        .filter(UserMistake.user_id == user_id, UserMistake.topic == topic)
        .order_by(UserMistake.frequency.desc())
        .limit(5)
        .all()
    )
    user_mistakes = [m.mistake for m in mistake_rows]

    retrieved = retrieve_similar(db, user_id=user_id, user_input=user_input, top_k=3)

    gen = generate_structured_response(user_input, context, retrieved, user_mistakes)
    reply = gen.get("reply", "(no reply)")
    mistake_tag = (gen.get("mistake_tag") or "").strip()

    # log mistake + update confidence
    stat = get_or_create_topic_stat(db, user_id, topic)

    mistake_repeated = False
    if mistake_tag:
        mistake_repeated = log_mistake(db, user_id, topic, mistake_tag)

    new_conf = update_confidence(stat.confidence, mistake_repeated)
    update_topic_confidence(db, user_id, topic, new_conf)

    # store chat + embedding
    emb = get_embedding(user_input)
    row = ChatHistory(
        user_id=user_id,
        topic=topic,
        user_input=user_input,
        response=reply,
        embedding=json.dumps(emb),
    )
    db.add(row)
    db.commit()

    return {"reply": reply, "topic": topic, "confidence": new_conf}
