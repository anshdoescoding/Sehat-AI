"""
charak_agent.py
---------------
Rule-based search engine for the Charak Samhita dataset.
"""

import pandas as pd
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), 'datasets', 'charaka_samhita_training_dataset.csv')

try:
    _df = pd.read_csv(DATA_PATH)
    _df = _df.fillna('')
    print(f"✅ [Charak] Loaded {len(_df)} entries from Charak Samhita dataset")
except Exception as e:
    print(f"⚠️  [Charak] Could not load dataset: {e}")
    _df = pd.DataFrame()

SYMPTOM_SYNONYMS = {
    "joint": ["knee", "knees", "joint pain", "joint ache", "joint", "arthritis", "osteoarthritis", "pain in joints"],
    "head": ["headache", "head pain", "migraine", "head hurts"],
    "stomach": ["stomach", "stomach ache", "abdominal", "belly", "tummy", "indigestion", "gas", "bloating"],
    "fever": ["fever", "temperature", "hot", "burning", "pyrexia"],
    "cough": ["cough", "coughing"],
    "cold": ["cold", "runny nose", "sneezing", "congestion"],
    "skin": ["skin", "rash", "itching", "itchy", "acne", "eczema"],
    "sleep": ["sleep", "insomnia", "sleepless", "can't sleep"],
    "stress": ["stress", "anxiety", "anxious", "worry", "tension"],
    "diabetes": ["diabetes", "sugar", "blood sugar", "diabetic"],
    "weight": ["weight", "obesity", "overweight", "fat"],
    "hair": ["hair", "hair loss", "baldness", "dandruff"],
    "eye": ["eye", "eyes", "vision", "sight"],
    "liver": ["liver", "jaundice", "hepatitis"],
    "urine": ["urine", "urinary", "uti", "burning urine"],
    "menstrual": ["period", "menstrual", "menstruation", "period pain", "cramps"],
}


def search_charak(query: str) -> dict:
    query_lower = query.lower()

    expanded_terms = [query_lower]
    for key, synonyms in SYMPTOM_SYNONYMS.items():
        if any(s in query_lower for s in synonyms):
            expanded_terms.append(key)

    result = _search_home_remedies(query_lower, expanded_terms)
    if result:
        return result

    result = _search_disease_treatment(query_lower, expanded_terms)
    if result:
        return result

    result = _search_herbs(query_lower)
    if result:
        return result

    return _fallback_search(query_lower)


def _search_home_remedies(query: str, expanded: list) -> dict | None:
    home_df = _df[_df['category'] == 'home_remedies']
    best = None
    best_score = 0

    for _, row in home_df.iterrows():
        condition = str(row['condition_disease']).lower()
        symptom = str(row['symptom']).lower()
        ingredients = str(row['formulation_ingredients']).lower()
        name = str(row['name']).lower()
        combined = condition + " " + symptom + " " + ingredients + " " + name

        score = 0
        for term in expanded:
            if term in combined:
                score += 3
        for word in query.split():
            if len(word) > 2 and word in combined:
                score += 1

        if score > best_score:
            best_score = score
            best = row

    if best is not None and best_score >= 2:
        return {
            "type": "home_remedy",
            "title": str(best['name']).title(),
            "condition": str(best['condition_disease']).title(),
            "dosha": str(best['dosha_involved']).title() if best['dosha_involved'] else "N/A",
            "ingredients": str(best['formulation_ingredients']),
            "method": str(best['preparation_method']),
            "dosage": str(best['dosage']) if best['dosage'] else None,
            "diet": str(best['diet_recommendation']) if best['diet_recommendation'] else None,
            "source": str(best['source_reference']),
        }
    return None


def _search_disease_treatment(query: str, expanded: list) -> dict | None:
    disease_df = _df[_df['category'] == 'disease_treatment']
    best = None
    best_score = 0

    for _, row in disease_df.iterrows():
        condition = str(row['condition_disease']).lower()
        symptom = str(row['symptom']).lower()
        treatment = str(row['treatment_type']).lower()
        combined = condition + " " + symptom + " " + treatment

        score = 0
        for term in expanded:
            if term in combined:
                score += 3
        for word in query.split():
            if len(word) > 2 and word in combined:
                score += 1

        if score > best_score:
            best_score = score
            best = row

    if best is not None and best_score >= 2:
        return {
            "type": "disease_treatment",
            "title": str(best['condition_disease']).title(),
            "dosha": str(best['dosha_involved']).title() if best['dosha_involved'] else "N/A",
            "symptoms": str(best['symptom']),
            "treatment": str(best['treatment_type']),
            "herbs": str(best['formulation_ingredients']) if best['formulation_ingredients'] else None,
            "diet": str(best['diet_recommendation']) if best['diet_recommendation'] else None,
            "source": str(best['source_reference']),
        }
    return None


def _search_herbs(query: str) -> dict | None:
    herb_df = _df[_df['category'] == 'herb_substance']
    best = None
    best_score = 0

    for _, row in herb_df.iterrows():
        name = str(row['name']).lower()
        uses = str(row['therapeutic_uses']).lower()
        score = 0
        for word in query.split():
            if len(word) > 2 and word in name:
                score += 5
            if len(word) > 2 and word in uses:
                score += 2

        if score > best_score:
            best_score = score
            best = row

    if best is not None and best_score >= 3:
        return {
            "type": "herb",
            "title": str(best['name']).title(),
            "taste": str(best['rasa_taste']).title(),
            "potency": str(best['virya_potency']).title(),
            "uses": str(best['therapeutic_uses']),
            "properties": str(best['properties']),
            "contraindications": str(best['contraindications']) if best['contraindications'] else None,
            "source": str(best['source_reference']),
        }
    return None


def _fallback_search(query: str) -> dict:
    text_columns = ['name', 'therapeutic_uses', 'symptom', 'condition_disease', 'training_response', 'treatment_type']
    best_row = None
    best_score = 0

    for _, row in _df.iterrows():
        score = 0
        for col in text_columns:
            text = str(row[col]).lower()
            for word in query.split():
                if len(word) > 2 and word in text:
                    score += 1
        if score > best_score:
            best_score = score
            best_row = row

    if best_row is not None and best_score >= 1:
        return {
            "type": "general",
            "title": str(best_row['name']).title() if best_row['name'] else "Ayurvedic Knowledge",
            "description": str(best_row['training_response'])[:500] if best_row['training_response'] else str(best_row['therapeutic_uses']),
            "source": str(best_row['source_reference']),
        }

    return {
        "type": "not_found",
        "description": "I couldn't find a specific match. Try asking about a herb (Tulsi, Ginger), a condition (fever, cough, joint pain), or a formulation (Triphala, Chyawanprash)."
    }