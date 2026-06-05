class SafetyAgent:
    """Agent 4: Ensures all responses are safe with proper disclaimers."""
    
    def __init__(self):
        self.base_disclaimers = [
            "This is an AI assessment, not a medical diagnosis.",
            "If symptoms worsen or new symptoms appear, see a doctor.",
            "For emergencies, call 108 (ambulance) immediately."
        ]
        
        self.danger_signs = [
            "Difficulty breathing or shortness of breath",
            "Chest pain or pressure",
            "Severe bleeding that won't stop",
            "Sudden confusion or difficulty speaking",
            "High fever (above 103°F / 39.4°C) that doesn't respond to medication",
            "Severe pain that is getting worse"
        ]
    
    def validate(self, response):
        """Add safety information to the response."""
        response["disclaimers"] = self.base_disclaimers
        response["danger_signs"] = self.danger_signs
        response["safety_checked"] = True
        return response
    
    def emergency_response(self, triage_result):
        """Format emergency response."""
        return {
            "status": "EMERGENCY",
            "message": "This sounds like a medical emergency. Please call 108 (ambulance) immediately or go to your nearest hospital right now. Do not wait or try to drive yourself.",
            "reason": triage_result.get("reason", "Critical symptoms detected"),
            "disclaimers": ["This is a medical emergency. Seek immediate professional help."]
        }