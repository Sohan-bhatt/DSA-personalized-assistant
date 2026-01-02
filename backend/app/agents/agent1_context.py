import json
from app.services.openai_client import chat_complete

SYSTEM = "You are a DSA tutor. Extract structured metadata from user queries."


def extract_context(user_input: str) -> dict:
    prompt = f"""
From the user input, output STRICT JSON with keys:
topic: short topic label (e.g., "two pointers", "binary search", "dp on strings")
intent: one of ["debugging","concept","optimization","practice"]
misconception: short phrase if any else ""
confidence_hint: number 0 to 1 (how confident you are about the topic label)

User input:
{user_input}
"""
    raw = chat_complete(SYSTEM, prompt, temperature=0.1)
    # robust parse
    try:
        return json.loads(raw)
    except Exception:
        # fallback minimal
        return {"topic": "general", "intent": "concept", "misconception": "", "confidence_hint": 0.4}
