#!/usr/bin/env python3
"""
EcoSense Deforestation Model Training & Data Generation
Trains linear/polynomial regressions on yearly tree cover loss for Indian states.
Holds out last 3 years to calculate MAE.
Exports:
 - frontend/data/forest_loss.csv
 - frontend/data/models/deforestation.json
 - frontend/data/district_risk.json
"""

import os
import json
import numpy as np
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error

# Base directory relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIR = os.path.abspath(os.path.join(SCRIPT_DIR, '..', '..'))
DATA_DIR = os.path.join(FRONTEND_DIR, 'data')
MODELS_DIR = os.path.join(DATA_DIR, 'models')

os.makedirs(MODELS_DIR, exist_ok=True)

# State base profiles (historical baseline ha loss in 2001, trend growth, volatility)
STATE_PROFILES = {
    'West Bengal': {
        'code': 'WB',
        'base_loss': 1850.0,
        'slope': 42.0,
        'noise': 120.0,
        'forest_cover_ha': 1684700.0,
        'districts': [
            {'name': 'Darjeeling', 'code': 'WB_DAR', 'weight': 0.28, 'fire_base': 140},
            {'name': 'Jalpaiguri', 'code': 'WB_JAL', 'weight': 0.24, 'fire_base': 110},
            {'name': 'Alipurduar', 'code': 'WB_ALI', 'weight': 0.20, 'fire_base': 95},
            {'name': 'Paschim Medinipur', 'code': 'WB_PWM', 'weight': 0.11, 'fire_base': 65},
            {'name': 'Bankura', 'code': 'WB_BAN', 'weight': 0.07, 'fire_base': 40},
            {'name': 'Purulia', 'code': 'WB_PUR', 'weight': 0.06, 'fire_base': 35},
            {'name': 'South 24 Parganas', 'code': 'WB_S24', 'weight': 0.04, 'fire_base': 20},
        ]
    },
    'Assam': {
        'code': 'AS',
        'base_loss': 7400.0,
        'slope': 185.0,
        'noise': 450.0,
        'forest_cover_ha': 2831200.0,
        'districts': [
            {'name': 'Karbi Anglong', 'code': 'AS_KAR', 'weight': 0.32, 'fire_base': 380},
            {'name': 'Dima Hasao', 'code': 'AS_DIM', 'weight': 0.25, 'fire_base': 290},
            {'name': 'Sonitpur', 'code': 'AS_SON', 'weight': 0.14, 'fire_base': 160},
            {'name': 'Kokrajhar', 'code': 'AS_KOK', 'weight': 0.11, 'fire_base': 130},
            {'name': 'Tinsukia', 'code': 'AS_TIN', 'weight': 0.08, 'fire_base': 90},
            {'name': 'Cachar', 'code': 'AS_CAC', 'weight': 0.06, 'fire_base': 70},
            {'name': 'Dibrugarh', 'code': 'AS_DIB', 'weight': 0.04, 'fire_base': 45},
        ]
    },
    'Odisha': {
        'code': 'OD',
        'base_loss': 5200.0,
        'slope': 115.0,
        'noise': 310.0,
        'forest_cover_ha': 5215600.0,
        'districts': [
            {'name': 'Mayurbhanj', 'code': 'OD_MAY', 'weight': 0.26, 'fire_base': 420},
            {'name': 'Kandhamal', 'code': 'OD_KAN', 'weight': 0.22, 'fire_base': 350},
            {'name': 'Sundargarh', 'code': 'OD_SUN', 'weight': 0.18, 'fire_base': 280},
            {'name': 'Koraput', 'code': 'OD_KOR', 'weight': 0.14, 'fire_base': 220},
            {'name': 'Rayagada', 'code': 'OD_RAY', 'weight': 0.09, 'fire_base': 150},
            {'name': 'Keonjhar', 'code': 'OD_KEO', 'weight': 0.06, 'fire_base': 110},
            {'name': 'Sambalpur', 'code': 'OD_SAM', 'weight': 0.05, 'fire_base': 85},
        ]
    },
    'Kerala': {
        'code': 'KL',
        'base_loss': 1400.0,
        'slope': 28.0,
        'noise': 90.0,
        'forest_cover_ha': 2125300.0,
        'districts': [
            {'name': 'Idukki', 'code': 'KL_IDU', 'weight': 0.35, 'fire_base': 110},
            {'name': 'Wayanad', 'code': 'KL_WAY', 'weight': 0.27, 'fire_base': 90},
            {'name': 'Palakkad', 'code': 'KL_PAL', 'weight': 0.15, 'fire_base': 55},
            {'name': 'Pathanamthitta', 'code': 'KL_PAT', 'weight': 0.10, 'fire_base': 35},
            {'name': 'Ernakulam', 'code': 'KL_ERN', 'weight': 0.05, 'fire_base': 20},
            {'name': 'Malappuram', 'code': 'KL_MAL', 'weight': 0.05, 'fire_base': 18},
            {'name': 'Kasaragod', 'code': 'KL_KAS', 'weight': 0.03, 'fire_base': 12},
        ]
    }
}

np.random.seed(42)

years = list(range(2001, 2024)) # 2001 to 2023 inclusive (23 years)
rows = []

for state_name, profile in STATE_PROFILES.items():
    current_forest = profile['forest_cover_ha']
    for idx, year in enumerate(years):
        t = idx
        # Historical trend formula with cyclical weather variations
        cyclical = 0.85 * np.sin(2 * np.pi * t / 7)
        noise = np.random.normal(0, profile['noise'])
        state_loss = max(100.0, profile['base_loss'] + profile['slope'] * t + cyclical * profile['noise'] + noise)
        current_forest -= state_loss

        for dist in profile['districts']:
            dist_loss = round(state_loss * dist['weight'] * (1.0 + np.random.normal(0, 0.05)), 1)
            dist_fires = max(0, int(dist['fire_base'] * (1.0 + 0.02 * t) + np.random.normal(0, 15)))
            dist_forest = round(current_forest * dist['weight'], 1)

            rows.append({
                'state': state_name,
                'district': dist['name'],
                'district_code': dist['code'],
                'year': year,
                'tree_cover_loss_ha': dist_loss,
                'forest_cover_ha': dist_forest,
                'fire_alerts': dist_fires,
                'is_simulated': True,
                'source': 'Global Forest Watch sample data'
            })

df_all = pd.DataFrame(rows)
csv_path = os.path.join(DATA_DIR, 'forest_loss.csv')
df_all.to_csv(csv_path, index=False)
print(f"Generated {len(df_all)} records in {csv_path}")

# Model training per state
models_output = {}
district_risk_output = []

for state_name, profile in STATE_PROFILES.items():
    df_state = df_all[df_all['state'] == state_name]
    # Aggregate state yearly loss
    df_yearly = df_state.groupby('year')['tree_cover_loss_ha'].sum().reset_index()

    X = df_yearly[['year']].values
    y = df_yearly['tree_cover_loss_ha'].values

    # Hold out last 3 years (2021, 2022, 2023)
    train_mask = df_yearly['year'] <= 2020
    test_mask = df_yearly['year'] > 2020

    X_train, y_train = X[train_mask], y[train_mask]
    X_test, y_test = X[test_mask], y[test_mask]

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred_test = model.predict(X_test)
    mae = float(mean_absolute_error(y_test, y_pred_test))

    # Refit on full series for final 10-year projection
    full_model = LinearRegression()
    full_model.fit(X, y)
    residuals = y - full_model.predict(X)
    std_err = float(np.std(residuals))

    # Forecast 10 years: 2024 to 2033
    future_years = np.array(range(2024, 2034)).reshape(-1, 1)
    future_pred = full_model.predict(future_years)

    forecast_items = []
    for f_year, f_val in zip(range(2024, 2034), future_pred):
        # 95% confidence interval roughly +/- 1.96 * std_err
        forecast_items.append({
            'year': int(f_year),
            'predicted_loss_ha': round(float(f_val), 1),
            'lower_ha': round(float(max(0, f_val - 1.96 * std_err)), 1),
            'upper_ha': round(float(f_val + 1.96 * std_err), 1)
        })

    history_items = [
        {'year': int(r['year']), 'tree_cover_loss_ha': round(float(r['tree_cover_loss_ha']), 1)}
        for _, r in df_yearly.iterrows()
    ]

    models_output[state_name] = {
        'state': state_name,
        'code': profile['code'],
        'model_type': 'Linear Regression',
        'slope': round(float(full_model.coef_[0]), 3),
        'intercept': round(float(full_model.intercept_), 3),
        'mae_held_out': round(mae, 1),
        'std_err': round(std_err, 1),
        'history': history_items,
        'forecast': forecast_items
    }

    # District risk scoring
    df_recent = df_state[df_state['year'] >= 2019]
    dist_stats = df_recent.groupby('district').agg({
        'tree_cover_loss_ha': 'mean',
        'fire_alerts': 'mean',
        'district_code': 'first'
    }).reset_index()

    max_loss = dist_stats['tree_cover_loss_ha'].max()
    max_fires = dist_stats['fire_alerts'].max()

    for _, dist_row in dist_stats.iterrows():
        norm_loss = dist_row['tree_cover_loss_ha'] / max_loss
        norm_fire = dist_row['fire_alerts'] / max_fires
        # Risk score formula combining tree cover loss rate and fire alert prevalence
        score = round(float(0.65 * norm_loss + 0.35 * norm_fire), 3)

        if score >= 0.60:
            level = 'high'
        elif score >= 0.35:
            level = 'medium'
        else:
            level = 'low'

        district_risk_output.append({
            'state': state_name,
            'district': dist_row['district'],
            'district_code': dist_row['district_code'],
            'risk_score': score,
            'risk_level': level,
            'avg_recent_loss_ha': round(float(dist_row['tree_cover_loss_ha']), 1),
            'avg_annual_fires': int(round(dist_row['fire_alerts']))
        })

# Export deforestation.json
def_path = os.path.join(MODELS_DIR, 'deforestation.json')
with open(def_path, 'w', encoding='utf-8') as f:
    json.dump(models_output, f, indent=2)
print(f"Exported model forecasts to {def_path}")

# Export district_risk.json
risk_path = os.path.join(DATA_DIR, 'district_risk.json')
with open(risk_path, 'w', encoding='utf-8') as f:
    json.dump(district_risk_output, f, indent=2)
print(f"Exported district risk ratings to {risk_path}")

print("AGENT A: Data and ML generation completed successfully.")
