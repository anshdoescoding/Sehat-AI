"""
agents/triage_agent.py
----------------------
Agent 1: Detects life-threatening emergencies before any diagnosis runs.

Uses EMERGENCIES from constants (single source of truth) and a secondary
HIGH_CONCERN list. Critical matches halt the pipeline immediately;
high-concern matches let the pipeline continue but flag elevated severity.
"""

from .constants import EMERGENCIES


class TriageAgent:
    """Agent 1: Detects life-threatening emergencies."""

    # Secondary list — serious but not instantly pipeline-stopping
    _HIGH_CONCERN = [
        "shortness of breath", "wheezing", "chest tightness",
        "severe pain", "worst pain", "unbearable",
        "confusion", "fainting", "dizziness with fall",
        "blood in vomit", "blood in stool", "coughing blood",
    ]

    # Duration / worsening indicators
    _WORSENING = [
        "more than a week", "over a week", "worsening", "getting worse",
    ]

    def assess(self, text: str) -> dict:
        """
        Assess the urgency of the user's message.

        Returns a dict with:
            severity      – "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
            stop_pipeline – True if the pipeline should halt and return emergency response
            reason        – human-readable explanation of the classification
        """
        text_lower = text.lower()

        for pattern in EMERGENCIES:
            if pattern in text_lower:
                return {
                    "severity": "CRITICAL",
                    "stop_pipeline": True,
                    "reason": f"Critical pattern detected: '{pattern}'",
                }

        for pattern in self._HIGH_CONCERN:
            if pattern in text_lower:
                return {
                    "severity": "HIGH",
                    "stop_pipeline": False,
                    "reason": f"High-concern pattern detected: '{pattern}'",
                }

        if any(word in text_lower for word in self._WORSENING):
            return {
                "severity": "MEDIUM",
                "stop_pipeline": False,
                "reason": "Symptoms appear to be persisting or worsening",
            }

        return {
            "severity": "LOW",
            "stop_pipeline": False,
            "reason": "No emergency indicators found",
        }
