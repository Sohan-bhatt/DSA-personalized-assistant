import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None


def chat_complete(system: str, user: str, model: str = "gpt-4o-mini", temperature: float = 0.3) -> str:
    if not client:
        # Offline fallback for environments without OpenAI access
        return (
            "Here's your mistake: - Unable to reach OpenAI; using offline fallback.\n\n"
            "Here's a dry run for intuition: - Provide a small example manually.\n\n"
            "Here's a corrected approach/code:\n- Outline steps and pseudocode here."
        )
    try:
        res = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=temperature,
        )
        return res.choices[0].message.content
    except Exception:
        # Graceful degradation if the API call fails
        return (
            "Here's your mistake: - Unable to fetch model response right now.\n\n"
            "Here's a dry run for intuition: - Try a small example manually.\n\n"
            "Here's a corrected approach/code:\n- Draft the solution outline while offline."
        )
