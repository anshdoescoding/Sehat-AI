"""
main.py
-------
Sehat FastAPI backend — entry point.

Handles:
  - FastAPI app setup & CORS
  - Rate limiting (slowapi)
  - Request validation
  - Session management (in-memory conversation store)
  - Routing to AgentOrchestrator
"""

import os
import sys
import uuid
import uvicorn
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, field_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from charak_agent import search_charak
from charak_agent import search_charak
from database import init_db, save_vitals, get_vitals, get_latest_vitals
# Make sure the backend directory is on the path when running directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.orchestrator import AgentOrchestrator

# ---------------------------------------------------------------------------
# Rate limiter
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

# ---------------------------------------------------------------------------
# App & middleware
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Sehat — Agentic AI Healthcare",
    description="AI-assisted symptom checker for Indian users.",
    version="1.0.0",
)
@app.on_event("startup")
async def startup():
    await init_db()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # Create React App dev server
        "http://localhost:5173",   # Vite dev server
    ],
    allow_methods=["GET", "POST", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Singleton orchestrator — initialised once at startup
# ---------------------------------------------------------------------------
orchestrator = AgentOrchestrator()

# ---------------------------------------------------------------------------
# In-memory conversation store
# ---------------------------------------------------------------------------
conversation_store: dict[str, list[dict]] = {}

MAX_HISTORY_TURNS = 20  # Keep only the last 20 messages per session

# ---------------------------------------------------------------------------
# Request / response models
# ---------------------------------------------------------------------------
class SymptomInput(BaseModel):
    text: str
    session_id: str | None = None

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Please describe your symptoms (at least 3 characters).")
        if len(v) > 2000:
            raise ValueError("Input is too long. Please keep your description under 2000 characters.")
        return v

class VitalsInput(BaseModel):
    session_id: str
    heart_rate: int | None = None
    bp_systolic: int | None = None
    bp_diastolic: int | None = None
    temperature: float | None = None
    weight: float | None = None

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/", summary="Health check")
async def root():
    """Simple liveness probe."""
    from agents.constants import DISEASE_DATA
    return {"status": "running", "diseases_loaded": len(DISEASE_DATA)}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "ok", "version": "1.0.0"}


@app.post("/check", summary="Analyse symptoms")
@limiter.limit("20/minute")
async def check_symptoms(request: Request, input: SymptomInput):
    """
    Run the full agent pipeline (Triage → Diagnosis → Treatment → Safety)
    and return a structured health assessment.

    Supports session-based conversation history.
    """
    try:
        # --- Session management ---
        session_id = input.session_id
        if not session_id:
            session_id = str(uuid.uuid4())

        # Load or create conversation history
        history = conversation_store.get(session_id, [])

        # Append user message to history
        history.append({"role": "user", "content": input.text})

        # Pass the full history to orchestrator
        result = orchestrator.process(history)

        # Append assistant response to history
        assistant_text = result.get("message", "") or result.get("diagnosis", {}).get("primary", {}).get("disease", "Assessment complete")
        history.append({"role": "assistant", "content": str(assistant_text)})

        # Trim to last N turns
        if len(history) > MAX_HISTORY_TURNS:
            history = history[-MAX_HISTORY_TURNS:]

        # Save back to store
        conversation_store[session_id] = history

        # Include session_id in response
        result["session_id"] = session_id

        return result

    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        print(f"[ERROR] /check pipeline failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )


@app.delete("/session/{session_id}", summary="Delete a conversation session")
async def delete_session(session_id: str):
    """
    Delete a conversation session and its history.
    Used when the user wants to start a new conversation.
    """
    if session_id in conversation_store:
        del conversation_store[session_id]
        return {"deleted": True, "session_id": session_id}
    return {"deleted": False, "session_id": session_id, "message": "Session not found"}

@app.post("/synthesize", summary="Modern + Ayurvedic synthesis")
async def synthesize(input: SymptomInput):
    """
    Combines modern medical diagnosis with Ayurvedic wisdom.
    Calls both pipelines and uses LLM to create a unified health plan.
    """
    try:
        # Run modern diagnosis
        modern_result = orchestrator.process([
            {"role": "user", "content": input.text}
        ])
        
        # Extract the primary condition for Ayurvedic search
        condition = ""
        if modern_result.get("diagnosis", {}).get("primary", {}).get("disease"):
            condition = modern_result["diagnosis"]["primary"]["disease"]
        
        # Search Charak Samhita for the same condition
        ayurvedic_result = search_charak(condition) if condition else search_charak(input.text)
        
        # Synthesize with LLM
        synthesis = _generate_synthesis(input.text, modern_result, ayurvedic_result)
        
        return {
            "status": "success",
            "modern": {
                "condition": condition,
                "advice": modern_result.get("treatment", {}).get("primary_advice", ""),
                "symptoms": modern_result.get("diagnosis", {}).get("symptoms_found", [])
            },
            "ayurvedic": {
                "type": ayurvedic_result.get("type", ""),
                "title": ayurvedic_result.get("title", ""),
                "ingredients": ayurvedic_result.get("ingredients", ""),
                "method": ayurvedic_result.get("method", "")
            },
            "synthesis": synthesis,
            "disclaimers": [
                "This is an AI assessment, not a medical diagnosis.",
                "Always consult a qualified doctor before trying remedies."
            ],
            "session_id": input.session_id
        }
        
    except Exception as exc:
        print(f"[ERROR] /synthesize failed: {exc}")
        raise HTTPException(status_code=500, detail="Synthesis failed. Please try again.")


def _generate_synthesis(user_text: str, modern: dict, ayurvedic: dict) -> str:
    """Use LLM to create a unified modern + Ayurvedic health plan."""
    from llm_client import call_deepseek
    
    system = """You are Sehat, a compassionate Indian health assistant who bridges modern medicine and Ayurveda.
You have two perspectives on the patient's condition.

Write a unified health plan that:
1. What is happening (2 sentences, simple reassuring language)
2. Modern medicine recommends (2 sentences)
3. Ayurveda recommends (herbs, diet, lifestyle — 2 sentences, mention specific herbs)
4. A practical daily routine combining both (3 steps)
5. When to see a doctor (1 sentence, always include)

Write warmly. Use simple English. Keep under 350 words.
Use bullet points for the daily routine."""

    # Extract info
    modern_advice = modern.get("treatment", {}).get("primary_advice", "")
    modern_condition = modern.get("diagnosis", {}).get("primary", {}).get("disease", "")
    
    ayur_title = ayurvedic.get("title", "")
    ayur_ingredients = ayurvedic.get("ingredients", "")
    ayur_method = ayurvedic.get("method", "")
    
    user = f"""Patient concern: {user_text}

MODERN MEDICINE says:
Condition: {modern_condition}
Advice: {modern_advice[:500]}

AYURVEDA (Charak Samhita) says:
Remedy: {ayur_title}
Ingredients: {ayur_ingredients}
Method: {ayur_method}

Create a warm, unified health plan for this patient."""

    result = call_deepseek(system, user, model=None, max_tokens=500)
    
    if result:
        return result
    
    # Fallback if LLM fails
    return f"""**Your Health Plan**

**What's happening:** Based on your symptoms, you may have {modern_condition or 'a mild condition'}.

**Modern Medicine:** {modern_advice[:200]}

**Ayurveda:** {ayur_title} — {ayur_ingredients}. {ayur_method}

**Daily Routine:**
• Rest and stay hydrated
• Follow the Ayurvedic remedy as described
• Monitor your symptoms

**See a doctor if symptoms worsen within 48 hours.**"""
# ---------------------------------------------------------------------------
# Run directly for local development
# ---------------------------------------------------------------------------
@app.post("/vitals", summary="Log vitals reading")
async def log_vitals(input: VitalsInput):
    """Save a vitals reading."""
    try:
        record = await save_vitals(input.session_id, {
            "heart_rate": input.heart_rate,
            "bp_systolic": input.bp_systolic,
            "bp_diastolic": input.bp_diastolic,
            "temperature": input.temperature,
            "weight": input.weight
        })
        return {"status": "logged", "record": record}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/vitals/{session_id}", summary="Get vitals history")
async def get_vitals_history(session_id: str):
    """Get last 30 vitals records."""
    records = await get_vitals(session_id)
    return {"records": records, "count": len(records)}


@app.get("/vitals/{session_id}/latest", summary="Get latest vitals")
async def get_latest_vital(session_id: str):
    """Get most recent vitals."""
    record = await get_latest_vitals(session_id)
    if record:
        return {"record": record}
    return {"record": None}
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
    
@app.post("/charak", summary="Search Charak Samhita knowledge")
async def charak_search(input: SymptomInput):
    """
    Search the Charak Samhita dataset for Ayurvedic remedies and knowledge.
    """
    if not input.text.strip():
        raise HTTPException(status_code=422, detail="Please enter a search query.")
    result = search_charak(input.text)
    return result


