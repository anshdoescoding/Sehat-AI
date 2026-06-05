"""
agents/orchestrator.py
----------------------
Coordinates all agents in the correct sequence.

Flow:
1. TriageAgent → emergency check (always runs first)
2. IntakeAgent → decides if we need more info or can proceed
3. If not ready: return follow-up question
4. If ready: DiagnosisAgent → TreatmentAgent → SafetyAgent
"""

from .triage_agent import TriageAgent
from .diagnosis_agent import DiagnosisAgent
from .treatment_agent import TreatmentAgent
from .safety_agent import SafetyAgent
from .intake_agent import IntakeAgent


class AgentOrchestrator:
    """Coordinates all 5 agents in sequence."""

    def __init__(self):
        print("=" * 50)
        print("🏥 SEHAT — Agentic AI Pipeline")
        print("=" * 50)
        self.triage = TriageAgent()
        self.intake = IntakeAgent()
        self.diagnosis = DiagnosisAgent()
        self.treatment = TreatmentAgent()
        self.safety = SafetyAgent()
        print("✅ All 5 agents initialized!")

    def process(self, history: list[dict]) -> dict:
        """Run the complete pipeline on conversation history."""
        
        # Extract latest user message
        latest_user_msg = ""
        for msg in reversed(history):
            if msg.get("role") == "user":
                latest_user_msg = msg["content"]
                break
        
        # --- Agent 1: TRIAGE (always runs first) ---
        triage_result = self.triage.assess(latest_user_msg)

        if triage_result.get("stop_pipeline"):
            return self.safety.emergency_response(triage_result)

        # --- Agent 2: INTAKE (conversational gate) ---
        intake_result = self.intake.assess(history)

        if not intake_result.get("ready"):
            # Not enough info — ask a follow-up question
            return {
                "status": "follow_up",
                "message": intake_result.get("question", "Could you tell me more about your symptoms?"),
                "severity": triage_result["severity"],
                "disclaimers": self.safety.base_disclaimers,
            }

        # --- Agent 3: DIAGNOSIS ---
        diagnosis_result = self.diagnosis.analyze(latest_user_msg, triage_result)

        if diagnosis_result["status"] == "insufficient":
            return {
                "status": "need_more_info",
                "message": diagnosis_result["message"],
                "disclaimers": self.safety.base_disclaimers,
            }

        if diagnosis_result["status"] == "no_match":
            return {
                "status": "no_match",
                "message": diagnosis_result["message"],
                "symptoms_found": diagnosis_result.get("symptoms_found", []),
                "disclaimers": self.safety.base_disclaimers,
            }

        # --- Agent 4: TREATMENT ---
        treatment_result = self.treatment.get_recommendations(diagnosis_result)

        # --- Combine ---
        response = {
            "status": "success",
            "severity": triage_result["severity"],
            "diagnosis": diagnosis_result,
            "treatment": treatment_result,
        }

        # --- Agent 5: SAFETY ---
        response = self.safety.validate(response)

        return response