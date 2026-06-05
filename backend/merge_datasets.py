 
import pandas as pd
import json
import os

DATASET_DIR = "datasets"
OUTPUT_FILE = "master_health_data.json"

print("Loading files from datasets folder...")

disease_df = pd.read_csv(os.path.join(DATASET_DIR, 'dataset.csv'))
desc_df = pd.read_csv(os.path.join(DATASET_DIR, 'symptom_Description.csv'))
prec_df = pd.read_csv(os.path.join(DATASET_DIR, 'symptom_precaution.csv'))

print(f"Loaded {len(disease_df)} diseases")

disease_df['Disease'] = disease_df['Disease'].str.lower().str.strip()
desc_df['Disease'] = desc_df['Disease'].str.lower().str.strip()
prec_df['Disease'] = prec_df['Disease'].str.lower().str.strip()

merged = disease_df.merge(desc_df, on='Disease', how='left')
merged = merged.merge(prec_df, on='Disease', how='left')

precaution_cols = ['Precaution_1', 'Precaution_2', 'Precaution_3', 'Precaution_4']
merged['all_precautions'] = merged[precaution_cols].apply(
    lambda row: '. '.join([str(x) for x in row if str(x) != 'nan']),
    axis=1
)

master_data = []

for index, row in merged.iterrows():
    disease = row['Disease']
    description = row['Description'] if pd.notna(row['Description']) else ''
    precautions = row['all_precautions'] if pd.notna(row['all_precautions']) else ''
    
    symptoms = []
    for col in disease_df.columns:
        if col.startswith('Symptom') and pd.notna(row[col]):
            symptom = str(row[col]).lower().replace('_', ' ')
            symptoms.append(symptom)
    
    if symptoms:
        master_data.append({
            "disease": disease,
            "symptoms": symptoms,
            "description": description,
            "precautions": precautions
        })

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    json.dump(master_data, f, indent=2, ensure_ascii=False)

print(f"Created master dataset with {len(master_data)} diseases")
print(f"Saved as: {OUTPUT_FILE}")

for entry in master_data[:3]:
    print(f"Disease: {entry['disease']}, Symptoms: {', '.join(entry['symptoms'][:5])}")