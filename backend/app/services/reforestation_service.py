import os
import json
import math
from typing import Dict, Any, List, Optional

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


def load_species() -> List[Dict[str, Any]]:
    path = os.path.join(SERVE_DIR, "species.json")
    if not os.path.exists(path):
        return []
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def plan_reforestation(
    target_trees: Optional[int] = None,
    hectares: Optional[float] = None,
    rainfall_mm: Optional[int] = None,
    region: Optional[str] = None
) -> Dict[str, Any]:
    all_species = load_species()

    if target_trees is not None and target_trees > 0:
        trees = int(target_trees)
        calc_hectares = round(trees / 1000.0, 2)
    elif hectares is not None and hectares > 0:
        calc_hectares = float(hectares)
        trees = int(calc_hectares * 1000)
    else:
        trees = 1000
        calc_hectares = 1.0

    # Filter species with valid rainfall range
    matched_species = []
    for sp in all_species:
        min_r = sp.get("min_rain_mm")
        max_r = sp.get("max_rain_mm")
        if min_r is not None and max_r is not None:
            if rainfall_mm is None or (min_r <= rainfall_mm <= max_r):
                matched_species.append(sp)

    if not matched_species:
        # Fallback to general canopy species
        matched_species = [s for s in all_species if s.get("rainfall_band") in ["Moderate", "Low"]]

    # Standard 21 kg per tree per year (Data Truth Rule 5: Assumption)
    standard_rate = 21.0
    annual_co2_kg = round(trees * standard_rate, 1)
    annual_co2_tonnes = round(annual_co2_kg / 1000.0, 2)

    return {
        "target_trees": trees,
        "hectares": calc_hectares,
        "standard_absorption_per_tree_kg": standard_rate,
        "standard_absorption_status": "assumption",
        "annual_co2_kg": annual_co2_kg,
        "annual_co2_tonnes": annual_co2_tonnes,
        "matched_species_count": len(matched_species),
        "matched_species": matched_species,
        "data_status": "assumption"
    }
