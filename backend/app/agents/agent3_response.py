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

The reply MUST follow this exact Markdown structure (concise, scannable). Keep headers big and bold, and use fenced code with language hints. Do NOT wrap the outer JSON in backticks:

## ❌ Here’s Your Mistake
- bullets explaining what’s wrong (keep it tight)

---

## 🔍 Dry Run (Intuition Building)
- pick a small/edge case
- show stepwise state changes

---

## ✅ Here’s the Correct Code
✔️ Correct Approach
- 1 short paragraph of the approach

✔️ Corrected Code
```<language>
# code here (preserve braces/brackets)
```

✔️ Key Logic Dry Run
- 1–2 bullets showing the critical steps and update points
"""
    raw = chat_complete(SYSTEM, prompt, temperature=0.35)

    def _strip_code_fence(text: str) -> str:
        t = text.strip()
        if t.startswith("```"):
            t = t.removeprefix("```")
        if t.endswith("```"):
            t = t.removesuffix("```")
        if t.lower().startswith("json"):
            t = t[4:].lstrip()
        return t.strip()

    cleaned = _strip_code_fence(raw)
    try:
        return json.loads(cleaned)
    except Exception:
        return {
            "reply": cleaned,
            "mistake_tag": "General misunderstanding",
        }
