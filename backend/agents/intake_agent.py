"""
agents/intake_agent.py
---------------------
Agent: Conversational intake — decides whether to ask follow-up questions
or proceed to diagnosis based on how much information the patient has shared.
"""

from llm_client import call_deepseek_json


class IntakeAgent:
    """
    Conversational intake agent.
    
    Evaluates the conversation history and decides:
    - Do we have enough information to diagnose?
    - Or should we ask one more clarifying question?
    """
    
    def __init__(self):
        self.min_turns_for_diagnosis = 1  # At least 1 user message
        self.min_symptoms_for_diagnosis = 2  # At least 2 symptoms mentioned
    
    def assess(self, history: list[dict]) -> dict:
        """
        Analyze conversation history and decide next step.
        
        Args:
            history: List of {"role": "user"|"assistant", "content": "..."}
        
        Returns:
            {"ready": True} or {"ready": False, "question": "..."}
        """
        # Count user turns
        user_turns = [msg for msg in history if msg.get("role") == "user"]
        turn_count = len(user_turns)
        
        # Get the latest user message
        latest_user_msg = ""
        for msg in reversed(history):
            if msg.get("role") == "user":
                latest_user_msg = msg["content"]
                break
        
        # Quick rule-based check: is this a new conversation?
        if turn_count == 1:
            # First message — check if they gave enough detail
            word_count = len(latest_user_msg.split())
            
            # Very short responses likely need follow-up
            if word_count < 5:
                return {
                    "ready": False,
                    "question": "Could you tell me more about what you're experiencing? For example, when did it start, and do you have any other symptoms like fever, cough, or pain?"
                }
            
            # Single symptom mentioned — ask for more
            common_single_words = ["fever", "headache", "cough", "pain", "cold"]
            words = latest_user_msg.lower().split()
            symptom_count = sum(1 for w in words if w in common_single_words)
            
            if symptom_count <= 1 and word_count < 10:
                return {
                    "ready": False,
                    "question": "I understand. Could you tell me if you have any other symptoms? And how long have you been feeling this way?"
                }
        
        # Rule-based: 3+ turns = definitely enough
        if turn_count >= 3:
            return {"ready": True}
        
        # Rule-based: 2+ symptoms mentioned = probably enough
        if turn_count >= 2:
            return {"ready": True}
        
        # Use LLM for nuanced decision
        return self._llm_assess(history, latest_user_msg)
    
    def _llm_assess(self, history: list[dict], latest_msg: str) -> dict:
        """Use LLM to decide if we need more information."""
        # Build conversation summary for the LLM
        conversation = ""
        for msg in history[-6:]:  # Last 6 messages max
            role = "Patient" if msg["role"] == "user" else "Assistant"
            conversation += f"{role}: {msg['content']}\n"
        
        system = """You are a medical intake assistant. Your job is to decide if the patient has shared enough information for a diagnosis.

Rules:
- If they've described their problem and mentioned at least 1-2 symptoms → ready
- If they gave a very short answer and it's the first exchange → not ready
- If they answered a follow-up question with detail → ready
- If they keep giving one-word answers after 2+ exchanges → ready anyway (don't ask forever)

Return ONLY JSON: {"ready": true} or {"ready": false, "question": "your follow-up question here"}"""
        
        user = f"Conversation so far:\n{conversation}\n\nShould we proceed to diagnosis or ask one more question?"
        
        result = call_deepseek_json(system, user, model=None, max_tokens=150)
        
        if result and isinstance(result, dict) and "ready" in result:
            print(f"🤔 [Intake] LLM decision: ready={result['ready']}")
            return result
        
        # Default: ready
        print("⚠️  [Intake] LLM failed, defaulting to ready")
        return {"ready": True}