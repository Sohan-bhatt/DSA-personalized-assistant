import json
from app.services.openai_client import chat_complete

SYSTEM = "You are a personalized DSA tutor. Always follow the requested format."


def generate_structured_response(user_input: str, context: dict, retrieved: str, user_mistakes: list[str]) -> dict:
    prompt = f"""
User input:
{user_input}

Extracted context (JSON):
{json.dumps(context)}

Retrieved similar memory:
{retrieved}

User's recurring mistakes (strings):
{user_mistakes}

Return STRICT JSON with keys:
reply: string (formatted tutoring response below)
mistake_tag: short string describing the primary mistake to store (or "")

The reply MUST be in this structure:

1. Common Mistakes:
- ...

2. Intuition Building (dry run on small example):
- ...

3. Try These Edge / Complex Test Cases:
- ...

4. Code Intuition (step-by-step dry run):
- ...

5. Personalized Advice:
- ...
"""
    raw = chat_complete(SYSTEM, prompt, temperature=0.35)
    try:
        return json.loads(raw)
    except Exception:
        # fallback
        return {
            "reply": raw,
            "mistake_tag": "General misunderstanding"
        }
