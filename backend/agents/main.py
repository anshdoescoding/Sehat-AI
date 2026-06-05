"""
main.py
-------
Sehat FastAPI backend — entry point.

All business logic lives in agents/. This file only handles:
  - FastAPI app setup & CORS
  - Request validation
  - Routing to AgentOrchestrator
"""

import os
import sys
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator

# Make sure the backend directory is on the path when running directly
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from agents.orchestrator import AgentOrchestrator

# ---------------------------------------------------------------------------
# App & middleware
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Sehat — Agentic AI Healthcare",
    description="AI-assisted symptom checker for Indian users.",
    version="1.0.0",
)

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
# Request / response models
# ---------------------------------------------------------------------------
class SymptomInput(BaseModel):
    text: str

    @field_validator("text")
    @classmethod
    def validate_text(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3:
            raise ValueError("Please describe your symptoms (at least 3 characters).")
        if len(v) > 2000:
            raise ValueError("Input is too long. Please keep your description under 2000 characters.")
        return v


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/", summary="Health check")
async def root():
    """Simple liveness probe."""
    from agents.constants import DISEASE_DATA
    return {"status": "running", "diseases_loaded": len(DISEASE_DATA)}


@app.post("/check", summary="Analyse symptoms")
async def check_symptoms(input: SymptomInput):
    """
    Run the full agent pipeline (Triage → Diagnosis → Treatment → Safety)
    and return a structured health assessment.

    Raises HTTP 422 if the input text is too short or too long.
    """
    try:
        result = orchestrator.process(input.text)
        return result
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc))
    except Exception as exc:
        # Log the unexpected error and return a safe message
        print(f"[ERROR] /check pipeline failed: {exc}")
        raise HTTPException(
            status_code=500,
            detail="An unexpected error occurred. Please try again.",
        )


# ---------------------------------------------------------------------------
# Run directly for local development
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
