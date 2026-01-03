import numpy as np
from app.services.openai_client import client


def get_embedding(text: str) -> list[float]:
    if not client:
        # Offline fallback deterministic embedding
        seed = sum(ord(c) for c in text) % 1000
        return [float((seed + i) % 17) / 17.0 for i in range(32)]
    try:
        res = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return res.data[0].embedding
    except Exception:
        seed = sum(ord(c) for c in text) % 1000
        return [float((seed + i) % 17) / 17.0 for i in range(32)]


def cosine_similarity(a: list[float], b: list[float]) -> float:
    a = np.array(a, dtype=np.float32)
    b = np.array(b, dtype=np.float32)
    denom = (np.linalg.norm(a) * np.linalg.norm(b))
    if denom == 0:
        return 0.0
    return float(np.dot(a, b) / denom)
