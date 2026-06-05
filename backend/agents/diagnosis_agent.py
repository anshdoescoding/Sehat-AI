"""
agents/diagnosis_agent.py
-------------------------
Agent 2: Matches user symptoms to diseases.
Keyword matching first (fast + accurate), ChromaDB fallback for edge cases.
"""

import os
from difflib import get_close_matches
from .constants import SYMPTOM_MAP, DISEASE_DATA
from llm_client import call_deepseek_json

MILD_CONDITIONS = [
    "common cold", "viral fever", "flu", "influenza", "migraine", "tension headache",
    "acidity", "indigestion", "constipation", "diarrhoea", "food poisoning",
    "allergy", "allergic rhinitis", "sinusitis", "conjunctivitis",
    "muscle spasm", "back pain", "sprain", "fatigue", "insomnia",
    "anxiety", "stress", "dandruff", "acne"
]

SERIOUS_CONDITIONS = [
    "malaria", "dengue", "typhoid", "pneumonia", "tuberculosis",
    "hepatitis", "jaundice", "meningitis", "encephalitis",
    "heart attack", "stroke", "cancer", "kidney failure", "liver failure",
    "sepsis", "hiv", "aids", "ebola", "cholera", "plague"
]

LLM_TO_DATASET = {
    "fever": ["high fever", "mild fever"],
    "head pain": ["headache"],
    "stomach ache": ["stomach pain"],
    "breathing difficulty": ["breathlessness"],
    "tired": ["fatigue"],
    "throwing up": ["vomiting"],
    "loose stools": ["diarrhoea"],
    "sore throat": ["throat irritation"],
    "runny nose": ["runny nose"],
}


class DiagnosisAgent:
    """Agent 2: Symptom-to-disease matching. Keywords first, vector fallback."""

    def _extract_symptoms_llm(self, text: str) -> list[str] | None:
        system = """You are a medical symptom extractor. Extract ALL symptoms as a JSON array.
Return ONLY: ["symptom1", "symptom2", ...]"""
        user = f"Patient description: {text}"
        result = call_deepseek_json(system, user, model=None, max_tokens=200)
        if result and isinstance(result, list):
            print(f"🤖 [Diagnosis] LLM extracted symptoms: {result}")
            return [s.lower() for s in result]
        return None

    def _extract_symptoms_keyword(self, text: str) -> list[str]:
        text_lower = text.lower()
        found = []
        for symptom, keywords in SYMPTOM_MAP.items():
            for keyword in keywords:
                if keyword in text_lower:
                    found.append(symptom)
                    break
        print(f"🔤 [Diagnosis] Keyword extracted symptoms: {found}")
        return list(set(found))

    def extract_symptoms(self, text: str) -> list[str]:
        llm_result = self._extract_symptoms_llm(text)
        if llm_result:
            mapped = []
            for symptom in llm_result:
                if symptom in LLM_TO_DATASET:
                    mapped.extend(LLM_TO_DATASET[symptom])
                else:
                    mapped.append(symptom)
            print(f"🤖 [Diagnosis] LLM symptoms mapped: {llm_result} → {mapped}")
            return list(set(mapped))
        return self._extract_symptoms_keyword(text)

    def _severity_rank(self, disease_name: str) -> int:
        name_lower = disease_name.lower()
        for mild in MILD_CONDITIONS:
            if mild in name_lower:
                return 0
        for serious in SERIOUS_CONDITIONS:
            if serious in name_lower:
                return 2
        return 1

    def analyze(self, text: str, triage_context: dict | None = None) -> dict:
        user_symptoms = self.extract_symptoms(text)

        if not user_symptoms:
            return {
                "status": "insufficient",
                "message": "I need more details to understand your condition better.",
                "symptoms_found": [],
            }

        # PRIMARY: Keyword matching (fast + accurate)
        results = self._keyword_match(user_symptoms)

        # If no results, try fuzzy
        if not results:
            print("🔍 [Diagnosis] No exact matches, trying fuzzy...")
            results = self._fuzzy_match(user_symptoms)

        # Sort
        results.sort(key=lambda x: (
            self._severity_rank(x["disease"]),
            -x["confidence"],
            -len(x.get("matched_exact", []))
        ))

        if not results:
            return {
                "status": "no_match",
                "message": "I couldn't identify a specific condition from your symptoms.",
                "symptoms_found": user_symptoms,
            }

        unique_alts = []
        seen = set()
        for r in results[1:]:
            name = r["disease"].lower()
            if name not in seen:
                seen.add(name)
                unique_alts.append(r)
            if len(unique_alts) >= 4:
                break

        print(f"🩺 [Diagnosis] Primary: {results[0]['disease']} ({results[0]['confidence']}%)")
        return {
            "status": "success",
            "primary": results[0],
            "alternatives": unique_alts,
            "symptoms_found": user_symptoms,
        }

    def _keyword_match(self, user_symptoms: list[str]) -> list[dict]:
        results = []
        seen = set()
        for disease in DISEASE_DATA:
            name = disease.get("disease", "").lower().strip()
            if name in seen:
                continue
            seen.add(name)
            disease_symptoms = [s.strip().lower() for s in disease.get("symptoms", [])]
            matches = [s for s in user_symptoms if s in disease_symptoms]
            if matches:
                conf = min(92, (len(matches) / len(user_symptoms)) * 100)
                results.append({
                    "disease": disease.get("disease", "unknown").replace("_", " ").title(),
                    "confidence": round(conf, 1),
                    "matched_exact": matches,
                    "matched_fuzzy": [],
                    "advice": disease.get("precautions", ""),
                    "description": disease.get("description", ""),
                })
        return results

    def _fuzzy_match(self, user_symptoms: list[str]) -> list[dict]:
        results = []
        seen = set()
        for disease in DISEASE_DATA:
            name = disease.get("disease", "").lower().strip()
            if name in seen:
                continue
            seen.add(name)
            disease_symptoms = [s.strip().lower() for s in disease.get("symptoms", [])]
            exact = []
            fuzzy = []
            for s in user_symptoms:
                if s in disease_symptoms:
                    exact.append(s)
                else:
                    close = get_close_matches(s, disease_symptoms, n=1, cutoff=0.7)
                    if close:
                        fuzzy.append(close[0])
            total = len(exact) + len(fuzzy)
            if total > 0:
                conf = min(92, (total / len(user_symptoms)) * 100 * 0.8)
                results.append({
                    "disease": disease.get("disease", "unknown").replace("_", " ").title(),
                    "confidence": round(conf, 1),
                    "matched_exact": exact,
                    "matched_fuzzy": fuzzy,
                    "advice": disease.get("precautions", ""),
                    "description": disease.get("description", ""),
                })
        return results