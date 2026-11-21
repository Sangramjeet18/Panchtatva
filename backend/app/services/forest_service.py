import os
import json
import math
from typing import Dict, Any, List
import numpy as np

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


def load_json(filename: str) -> List[Dict[str, Any]]:
    path = os.path.join(SERVE_DIR, filename)
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_national_forest_forecast() -> Dict[str, Any]:
    """
    Computes linear regression on World Bank national forest series.
    Evaluates MAE on a 3-year holdout.
    Projects a 10-year forecast with upper/lower bounds clamped at zero.
    """
    data = load_json("national_forest_series.json")
    if not data:
        return {"historical": [], "forecast": [], "mae": 0.0, "r2": 0.0}

    # Sort chronologically
    data.sort(key=lambda x: x["year"])
    years = np.array([d["year"] for d in data], dtype=float)
    areas = np.array([d["forest_area_km2"] for d in data], dtype=float)

    if len(years) < 5:
        return {"historical": data, "forecast": [], "mae": 0.0}

    # 3-year holdout validation
    train_years = years[:-3]
    train_areas = areas[:-3]
    test_years = years[-3:]
    test_areas = areas[-3:]

    # Train linear regression
    slope, intercept = np.polyfit(train_years, train_areas, 1)
    test_preds = slope * test_years + intercept
    mae = float(np.mean(np.abs(test_preds - test_areas)))

    # Fit on all available data for future projection
    full_slope, full_intercept = np.polyfit(years, areas, 1)
    residuals = areas - (full_slope * years + full_intercept)
    std_err = float(np.std(residuals)) if len(residuals) > 0 else 1000.0

    last_year = int(years[-1])
    forecast_points = []
    for step in range(1, 11):
        target_year = last_year + step
        pred = full_slope * target_year + full_intercept
        pred_clamped = max(0.0, float(pred))
        margin = max(std_err * 1.96, mae * 1.5)
        lower_clamped = max(0.0, pred_clamped - margin)
        upper_clamped = max(0.0, pred_clamped + margin)

        forecast_points.append({
            "year": target_year,
            "predicted_km2": round(pred_clamped, 2),
            "lower_km2": round(lower_clamped, 2),
            "upper_km2": round(upper_clamped, 2),
            "data_status": "modelled"
        })

    return {
        "historical": data,
        "forecast": forecast_points,
        "mae": round(mae, 2),
        "model": "Ordinary Least Squares Linear Regression",
        "holdout": "3-year holdout validation (2020-2022)"
    }
