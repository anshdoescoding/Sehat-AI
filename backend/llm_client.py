"""
llm_client.py
-------------
Shared LLM client using OpenRouter's free DeepSeek API.
"""

import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_BASE_URL = os.getenv("DEEPSEEK_BASE_URL", "https://openrouter.ai/api/v1")
DEEPSEEK_MODEL = os.getenv("DEEPSEEK_MODEL", "deepseek/deepseek-chat:free")

_client = None

def get_client():
    global _client
    if _client is None:
        if not DEEPSEEK_API_KEY or "your_" in DEEPSEEK_API_KEY:
            print("⚠️  [LLM] No valid API key set — LLM features disabled")
            return None
        _client = OpenAI(api_key=DEEPSEEK_API_KEY, base_url=DEEPSEEK_BASE_URL)
        print(f"✅ [LLM] Client initialized: {DEEPSEEK_MODEL} @ {DEEPSEEK_BASE_URL}")
    return _client


def call_deepseek(system_prompt, user_message, model=None, max_tokens=500, temperature=0.3):
    client = get_client()
    if client is None:
        return None
    
    if model is None:
        model = DEEPSEEK_MODEL
    
    try:
        print(f"🤖 [LLM] Calling {model}...")
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            max_tokens=max_tokens,
            temperature=temperature,
        )
        result = response.choices[0].message.content
        print(f"✅ [LLM] Response received ({len(result)} chars)")
        return result
    except Exception as e:
        print(f"❌ [LLM] API call failed: {e}")
        return None


def call_deepseek_json(system_prompt, user_message, model=None, max_tokens=500):
    import json
    
    json_system = system_prompt + "\n\nCRITICAL: Respond with ONLY valid JSON. No markdown, no explanation. Just the JSON object."
    
    text = call_deepseek(json_system, user_message, model=model, max_tokens=max_tokens, temperature=0.0)
    if text is None:
        return None
    
    text = text.strip()
    if text.startswith("```json"): text = text[7:]
    if text.startswith("```"): text = text[3:]
    if text.endswith("```"): text = text[:-3]
    text = text.strip()
    
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        print(f"⚠️  [LLM] Failed to parse JSON: {text[:200]}")
        return None