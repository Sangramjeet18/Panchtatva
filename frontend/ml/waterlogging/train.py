"""
Waterlogging Risk Prediction Model
Trains a Random Forest classifier on Kolkata ward topographic and meteorological features.
Exports model evaluation metrics and feature importances to data/models/waterlogging.json.
"""

import json
import os
from datetime import datetime
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

def generate_training_data(wards_df, n_samples_per_ward=80, random_state=42):
    np.random.seed(random_state)
    records = []

    # Rainfall bands: dry, light rain, moderate monsoon, heavy monsoon, extreme depression (cyclonic)
    rain_scenarios = [
        (0.0, 10.0, 0.25),     # light/none
        (10.0, 35.0, 0.25),    # moderate
        (35.0, 70.0, 0.25),    # heavy
        (70.0, 150.0, 0.25)    # extreme cloudburst / cyclonic
    ]

    for _, ward in wards_df.iterrows():
        for band_min, band_max, weight in rain_scenarios:
            n_samples = int(n_samples_per_ward * weight)
            for _ in range(n_samples):
                rain = np.random.uniform(band_min, band_max)
                elev = ward['elevation_m'] + np.random.normal(0, 0.2)
                drainage = np.clip(ward['drainage_score'] + np.random.normal(0, 0.3), 1.0, 10.0)
                floods = max(0, int(ward['past_flood_events'] + np.random.normal(0, 1)))
                impervious = np.clip(ward['impervious_pct'] + np.random.normal(0, 2), 50.0, 95.0)

                # Hydrological index: Runoff Accumulation Potential (RAP)
                # In low-lying Kolkata (avg elev 4-7m), rain > 40mm causes severe stagnation if drainage < 5
                runoff_factor = (rain / 20.0) * (impervious / 100.0)
                elevation_penalty = np.exp(-elev / 8.0) * 2.2
                drainage_efficiency = (drainage / 10.0)
                past_penalty = 1.0 + (floods / 25.0)

                risk_score = (runoff_factor * elevation_penalty * past_penalty) / max(0.4, drainage_efficiency)

                if risk_score < 1.8 and rain < 30.0:
                    risk_class = 'low'
                elif risk_score < 4.2 and rain < 75.0:
                    risk_class = 'medium'
                else:
                    risk_class = 'high'

                records.append({
                    'ward_id': ward['ward_id'],
                    'rainfall_mm_24h': round(float(rain), 2),
                    'elevation_m': round(float(elev), 2),
                    'drainage_score': round(float(drainage), 2),
                    'past_flood_events': floods,
                    'impervious_pct': round(float(impervious), 2),
                    'risk_level': risk_class
                })

    return pd.DataFrame(records)

def train_and_export():
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    features_csv = os.path.join(base_dir, 'data', 'ward_features.csv')
    output_model_json = os.path.join(base_dir, 'data', 'models', 'waterlogging.json')

    print(f"Loading ward features from: {features_csv}")
    wards_df = pd.read_csv(features_csv)

    print("Synthesizing training scenarios based on empirical Kolkata ward parameters...")
    dataset = generate_training_data(wards_df, n_samples_per_ward=100)

    feature_cols = ['rainfall_mm_24h', 'elevation_m', 'drainage_score', 'past_flood_events', 'impervious_pct']
    X = dataset[feature_cols]
    y = dataset['risk_level']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42, stratify=y)

    print(f"Training Random Forest with {len(X_train)} samples, testing on {len(X_test)} samples...")
    rf = RandomForestClassifier(
        n_estimators=100,
        max_depth=6,
        min_samples_split=4,
        random_state=42,
        class_weight='balanced'
    )
    rf.fit(X_train, y_train)

    y_pred = rf.predict(X_test)
    accuracy = float(accuracy_score(y_test, y_pred))
    report = classification_report(y_test, y_pred, output_dict=True)

    print(f"Model test accuracy: {accuracy:.4f}")
    importances = {col: round(float(imp), 4) for col, imp in zip(feature_cols, rf.feature_importances_)}
    print(f"Feature importances: {importances}")

    os.makedirs(os.path.dirname(output_model_json), exist_ok=True)

    model_metadata = {
        "model_name": "Random Forest Ward Waterlogging Classifier",
        "version": "1.0.0",
        "target_classes": ["low", "medium", "high"],
        "features": feature_cols,
        "feature_importance": importances,
        "accuracy": round(accuracy, 4),
        "train_samples": len(X_train),
        "test_samples": len(X_test),
        "metrics": {
            "low_f1": round(report['low']['f1-score'], 4),
            "medium_f1": round(report['medium']['f1-score'], 4),
            "high_f1": round(report['high']['f1-score'], 4)
        },
        "trained_at": datetime.utcnow().isoformat() + "Z",
        "simulated": True,
        "citation": "Kolkata Municipal Corporation drainage reports and Open-Meteo precipitation models."
    }

    with open(output_model_json, 'w', encoding='utf-8') as f:
        json.dump(model_metadata, f, indent=2)

    print(f"Successfully exported model metadata to: {output_model_json}")

if __name__ == '__main__':
    train_and_export()
