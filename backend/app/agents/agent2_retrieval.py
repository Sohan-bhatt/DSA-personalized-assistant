import json
from sqlalchemy.orm import Session
from app.db.models import ChatHistory
from app.services.embeddings import get_embedding, cosine_similarity


def retrieve_similar(db: Session, user_id: str, user_input: str, top_k: int = 3) -> str:
    q_emb = get_embedding(user_input)

    # prioritize same user memory; fallback to global
    records = db.query(ChatHistory).filter(ChatHistory.user_id == user_id).all()
    if len(records) < top_k:
        records = db.query(ChatHistory).all()

    scored = []
    for r in records:
        if not r.embedding:
            continue
        try:
            emb = json.loads(r.embedding)
        except Exception:
            continue
        score = cosine_similarity(q_emb, emb)
        scored.append((score, r.response, r.topic))

    scored.sort(reverse=True, key=lambda x: x[0])
    top = scored[:top_k]

    if not top:
        return "No similar prior explanations."

    # Keep it compact for prompting
    chunks = []
    for s, resp, t in top:
        chunks.append(f"[topic={t} sim={s:.3f}]\n{resp}")
    return "\n\n---\n\n".join(chunks)
