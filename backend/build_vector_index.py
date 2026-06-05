"""
build_vector_index.py
---------------------
One-time script: embeds all 4,920 diseases and stores them in ChromaDB.
Run once during setup. After this, DiagnosisAgent uses semantic search.
"""

import json
import os
import chromadb
from sentence_transformers import SentenceTransformer
from tqdm import tqdm

print("=" * 50)
print("🔨 BUILDING VECTOR INDEX")
print("=" * 50)

# Load model (runs locally, no API needed)
print("\n📥 Loading embedding model...")
model = SentenceTransformer("all-MiniLM-L6-v2")
print("✅ Model loaded")

# Load disease data
DATA_PATH = os.path.join(os.path.dirname(__file__), "master_health_data.json")
with open(DATA_PATH, "r", encoding="utf-8") as f:
    diseases = json.load(f)
print(f"📊 Loaded {len(diseases)} diseases")

# Initialize ChromaDB
DB_PATH = os.path.join(os.path.dirname(__file__), "chroma_db")
client = chromadb.PersistentClient(path=DB_PATH)

# Delete old collection if exists
try:
    client.delete_collection("diseases")
    print("🗑️  Deleted old collection")
except:
    pass

collection = client.create_collection(
    name="diseases",
    metadata={"description": "Sehat disease symptom vectors"}
)

# Process in batches of 100
BATCH_SIZE = 100
total_batches = (len(diseases) + BATCH_SIZE - 1) // BATCH_SIZE

print(f"\n🔨 Embedding {len(diseases)} diseases in {total_batches} batches...")

for batch_num in range(total_batches):
    start = batch_num * BATCH_SIZE
    end = min(start + BATCH_SIZE, len(diseases))
    batch = diseases[start:end]
    
    ids = []
    documents = []
    metadatas = []
    
    for i, disease in enumerate(batch):
        disease_id = f"disease_{start + i}"
        disease_name = disease.get("disease", "unknown").replace("_", " ").title()
        symptoms = ", ".join(disease.get("symptoms", [])[:10])
        description = disease.get("description", "")[:200]
        advice = disease.get("precautions", "")[:200]
        
        # Build searchable text
        text = f"{disease_name}. Symptoms: {symptoms}. {description}"
        
        ids.append(disease_id)
        documents.append(text)
        metadatas.append({
            "disease": disease_name,
            "symptoms": symptoms,
            "advice": advice,
            "description": description[:100]
        })
    
    # Embed and add
    embeddings = model.encode(documents).tolist()
    collection.add(
        ids=ids,
        embeddings=embeddings,
        documents=documents,
        metadatas=metadatas
    )
    
    print(f"   Batch {batch_num + 1}/{total_batches} — {len(batch)} diseases indexed")

print(f"\n✅ Vector index built: {collection.count()} diseases")
print(f"📁 Stored at: {DB_PATH}")