"""
agents/treatment_agent.py
-------------------------
Agent 3: Provides treatment recommendations.
Uses DeepSeek LLM for warm, personalized advice with database fallback.
"""

from .constants import DISEASE_DATA
from llm_client import call_deepseek


class TreatmentAgent:
    """Agent 3: Provides treatment recommendations."""

    _GENERAL_ADVICE = {
        "rest": "Get plenty of rest to allow your body to recover.",
        "hydration": "Drink plenty of water throughout the day to stay hydrated.",
        "monitor": "Keep track of your symptoms. Note any changes or new symptoms.",
    }

    def _generate_llm_advice(self, disease_name: str, symptoms: list[str], raw_advice: str) -> str | None:
        """Use DeepSeek to generate warm, personalized advice."""
        system = """You are Sehat, a warm and caring Indian health assistant. 
Given a possible condition and symptoms, write helpful self-care advice.

Rules:
- Write in simple, friendly English
- Be warm and reassuring (use "you")
- Give 3-5 practical tips
- Include 1 simple diet suggestion
- Include 1 lifestyle suggestion
- Always end with: "See a doctor if symptoms worsen or don't improve within 48 hours."
- Keep total under 200 words."""

        user = f"""Possible condition: {disease_name}
Patient symptoms: {', '.join(symptoms)}
Medical database advice: {raw_advice}

Please provide warm, practical self-care advice."""

        return call_deepseek(system, user, model=None, max_tokens=400)

    def get_recommendations(self, diagnosis_result: dict) -> dict:
        """Generate treatment recommendations."""
        primary = diagnosis_result.get("primary") or {}
        disease_name = primary.get("disease", "")
        symptoms = diagnosis_result.get("symptoms_found", [])
        raw_advice = primary.get("advice", "")

        # Try LLM for warm advice
        llm_advice = self._generate_llm_advice(disease_name, symptoms, raw_advice)

        general_tips = [
            self._GENERAL_ADVICE["rest"],
            self._GENERAL_ADVICE["hydration"],
            self._GENERAL_ADVICE["monitor"],
        ]

        return {
            "primary_advice": llm_advice if llm_advice else (raw_advice or "Follow general wellness practices and monitor your symptoms."),
            "general_tips": general_tips,
            "diet_tip": "Eat light, easily digestible foods. Avoid spicy, oily, and processed foods.",
        }