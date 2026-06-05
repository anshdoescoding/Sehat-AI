"""
agents/constants.py
-------------------
Single source of truth for shared data used across all agents.

Exports:
    EMERGENCIES   – list of critical emergency keyword phrases
    SYMPTOM_MAP   – dict mapping canonical symptom names to keyword aliases
    DISEASE_DATA  – list of disease dicts loaded once from master_health_data.json
"""

import json
import os

# ---------------------------------------------------------------------------
# Emergency keyword phrases (TriageAgent uses this)
# ---------------------------------------------------------------------------
EMERGENCIES = [
    "chest pain", "chest pressure", "heart attack", "left arm pain",
    "cannot breathe", "gasping", "choking", "lips turning blue", "difficulty breathing",
    "face drooping", "cannot speak", "slurred speech", "one side weak",
    "heavy bleeding", "blood not stopping", "deep wound",
    "throat swelling", "tongue swelling", "cannot swallow",
    "unconscious", "passed out", "seizure", "not responding",
    "severe burn", "chemical in eye", "poisoning",
]

# ---------------------------------------------------------------------------
# Symptom keyword map (DiagnosisAgent uses this)
# Maps canonical symptom name → list of aliases / informal phrases
# ---------------------------------------------------------------------------
SYMPTOM_MAP = {
    "high fever": ["fever", "high fever", "temperature", "hot", "burning up", "febrile"],
    "mild fever": ["mild fever", "low fever", "slight fever", "warm"],
    "headache": ["headache", "head pain", "migraine", "head hurts", "head pounding"],
    "cough": ["cough", "coughing", "hacking"],
    "chills": ["chills", "shivering", "cold chills", "shaking"],
    "fatigue": ["fatigue", "tired", "weak", "weakness", "lethargy", "no energy", "exhaustion"],
    "nausea": ["nausea", "vomit", "vomiting", "sick", "queasy", "nauseous"],
    "diarrhoea": ["diarrhea", "diarrhoea", "loose stool", "watery stool", "loose motion"],
    "stomach pain": ["stomach pain", "stomach ache", "abdominal pain", "belly pain", "tummy"],
    # MERGED: "chest pain" appeared twice — now one entry with all keywords
    "chest pain": ["chest pain", "chest pressure", "chest tight", "chest discomfort", "chest tightness", "heart pain"],
    "breathlessness": ["breathing", "breath", "shortness of breath", "breathlessness", "dyspnea", "wheezing"],
    "skin rash": ["rash", "itching", "itchy", "skin", "redness", "irritation", "hives"],
    "joint pain": ["joint pain", "joint ache", "arthritis", "knee pain", "swollen joints"],
    "back pain": ["back pain", "backache", "lower back", "spine pain"],
    "throat irritation": ["sore throat", "throat pain", "throat hurts", "throat irritation", "painful swallowing"],
    "dizziness": ["dizziness", "dizzy", "vertigo", "spinning", "lightheaded"],
    # MERGED: "weight loss" appeared twice — now one entry
    "weight loss": ["weight loss", "losing weight", "unexplained weight", "unexplained weight loss"],
    "depression": ["insomnia", "sleepless", "cannot sleep", "trouble sleeping", "depression", "anxiety", "anxious", "stress"],
    "constipation": ["constipation", "constipated", "hard stool", "cannot go"],
    "acidity": ["acidity", "acid reflux", "heartburn", "burning chest", "gerd"],
    "loss of appetite": ["loss of appetite", "no appetite", "not hungry", "appetite loss"],
    "sweating": ["sweating", "sweat", "night sweats", "perspiration"],
    "weight gain": ["weight gain", "gaining weight", "obesity"],
    "runny nose": ["runny nose", "sneezing", "congestion", "stuffy nose", "cold"],
    "vomiting": ["vomiting", "vomit", "throwing up"],
    "muscle pain": ["muscle pain", "body ache", "body pain", "muscle ache"],
    "fast heart rate": ["fast heart rate", "palpitations", "racing heart", "heart beating fast"],
    "stiff neck": ["stiff neck", "neck pain", "neck stiffness"],
    "blurred and distorted vision": ["blurred vision", "vision problems", "can't see clearly"],
    "dark urine": ["dark urine", "brown urine", "cola colored urine"],
    "yellowing of eyes": ["yellow eyes", "jaundice", "yellowing of eyes", "yellowish skin"],
    "bloody stool": ["bloody stool", "blood in stool", "rectal bleeding"],
    "swelling joints": ["swelling joints", "swollen joints", "joint swelling"],
    "dehydration": ["dehydration", "dehydrated", "thirsty", "dry mouth"],
    "anxiety": ["anxiety", "anxious", "panic", "worry"],
    "malaise": ["malaise", "generally unwell", "not feeling well", "sick feeling"],
}

# ---------------------------------------------------------------------------
# Disease dataset – loaded once at import time (module-level singleton)
# All agents share this single in-memory copy.
# ---------------------------------------------------------------------------
_DATA_PATH = os.path.join(os.path.dirname(__file__), "..", "master_health_data.json")

try:
    with open(_DATA_PATH, "r", encoding="utf-8") as _f:
        DISEASE_DATA: list[dict] = json.load(_f)
    print(f"✅ [constants] Loaded {len(DISEASE_DATA)} diseases from master_health_data.json")
except FileNotFoundError:
    print("⚠️  [constants] master_health_data.json not found — run merge_datasets.py first")
    DISEASE_DATA: list[dict] = []
