import os
import json
from typing import Dict, Any, List, Optional

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


def load_monitoring_areas() -> List[Dict[str, Any]]:
    path = os.path.join(SERVE_DIR, "monitoring_areas.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def load_rainfall_daily() -> List[Dict[str, Any]]:
    path = os.path.join(SERVE_DIR, "rainfall_daily.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def calculate_screening_index(rain_3day_mm: float, elevation_m: float) -> str:
    """
    Transparent screening rule (Data Truth Rule 3).
    Evaluates drainage vulnerability deterministically:
    - High: 3-day accumulated rainfall >= 70mm and elevation <= 5.0m
    - Medium: 3-day accumulated rainfall >= 40mm, or >= 25mm with elevation <= 6.0m
    - Low: all other conditions
    """
    if rain_3day_mm >= 70.0 and elevation_m <= 5.0:
        return "high"
    elif rain_3day_mm >= 40.0 or (rain_3day_mm >= 25.0 and elevation_m <= 6.0):
        return "medium"
    return "low"


def get_waterlogging_index(rain_override: Optional[float] = None, target_date: Optional[str] = None) -> List[Dict[str, Any]]:
    areas = load_monitoring_areas()
    daily_records = load_rainfall_daily()

    # Index by (area_id, date)
    date_map = {}
    for r in daily_records:
        k = (r["area_id"], r["date"])
        date_map[k] = r

    results = []
    for area in areas:
        elevation = float(area["elevation_m"])
        if rain_override is not None:
            rain_val = float(rain_override)
            rain_3day = round(rain_val * 2.2, 1)
        elif target_date and (area["id"], target_date) in date_map:
            rec = date_map[(area["id"], target_date)]
            rain_val = float(rec["rain_mm"])
            rain_3day = float(rec["rain_3day"])
        else:
            # First available or default
            matching = [r for r in daily_records if r["area_id"] == area["id"]]
            if matching:
                rec = matching[0]
                rain_val = float(rec["rain_mm"])
                rain_3day = float(rec["rain_3day"])
            else:
                rain_val = 15.0
                rain_3day = 33.0

        risk = calculate_screening_index(rain_3day, elevation)

        results.append({
            "area_id": area["id"],
            "area_name": area["name"],
            "lat": float(area["lat"]),
            "lon": float(area["lon"]),
            "elevation_m": elevation,
            "rain_mm": rain_val,
            "rain_3day_mm": rain_3day,
            "risk_proxy": risk,
            "screening_type": "Deterministic Rule-based Index",
            "data_status": "proxy"
        })

    return results
