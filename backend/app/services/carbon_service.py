import os
import json
import math
from typing import Dict, Any, List

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


def load_factors() -> List[Dict[str, Any]]:
    path = os.path.join(SERVE_DIR, "emission_factors.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def calculate_carbon_footprint(
    electricity_kwh_monthly: float,
    car_km_weekly: float,
    bus_km_weekly: float,
    metro_km_weekly: float,
    flights_yearly: int,
    diet_type: str
) -> Dict[str, Any]:
    factors = {f["key"]: float(f["kg_co2_per_unit"]) for f in load_factors()}

    grid_factor = factors.get("grid_kwh", 0.80)
    car_factor = factors.get("car_km", 0.17)
    bus_factor = factors.get("bus_km", 0.08)
    metro_factor = factors.get("metro_km", 0.04)
    flight_factor = factors.get("flight_short", 250.0)

    diet_factors = {
        "vegetarian": factors.get("vegetarian", 1000.0),
        "mixed": factors.get("mixed", 1700.0),
        "meatHeavy": factors.get("meatHeavy", 2500.0),
    }

    elec_kg = electricity_kwh_monthly * 12 * grid_factor
    travel_kg = ((car_km_weekly * car_factor) + (bus_km_weekly * bus_factor) + (metro_km_weekly * metro_factor)) * 52
    flights_kg = flights_yearly * flight_factor
    diet_kg = diet_factors.get(diet_type, 1700.0)

    total_kg = round(elec_kg + travel_kg + flights_kg + diet_kg, 1)
    total_tonnes = round(total_kg / 1000.0, 2)
    # Standard 21 kg per tree annually (Data Truth Rule 5: tagged Assumption)
    trees_needed = math.ceil(total_kg / 21.0) if total_kg > 0 else 0

    return {
        "total_kg_per_year": total_kg,
        "total_tonnes_per_year": total_tonnes,
        "trees_needed": trees_needed,
        "tree_absorption_rate_kg": 21.0,
        "tree_absorption_status": "assumption",
        "breakdown": {
            "electricity_kg": round(elec_kg, 1),
            "travel_kg": round(travel_kg, 1),
            "flights_kg": round(flights_kg, 1),
            "diet_kg": round(diet_kg, 1),
        },
        "factors_used": factors
    }
