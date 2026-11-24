import os
import json
import math
import pandas as pd
from typing import Dict, Any, List, Optional

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")
SPECIES_CSV_PATH = os.path.join(DATA_DIR, "species", "species_candidates.csv")
SERVE_DIR = os.path.join(DATA_DIR, "serve")
PROCESSED_FSI_DIR = os.path.join(DATA_DIR, "processed", "fsi")
DISTRICTS_CSV_PATH = os.path.join(PROCESSED_FSI_DIR, "districts_forest_cover_2023.csv")


def load_species() -> List[Dict[str, Any]]:
    """
    Load exactly the 19 species candidates from backend/data/species/species_candidates.csv.
    Absorption rate is not yet sourced and set to null.
    Missing rainfall ranges return null and rain_text 'Range not sourced'.
    """
    if os.path.exists(SPECIES_CSV_PATH):
        df = pd.read_csv(SPECIES_CSV_PATH)
        records = []
        for _, row in df.iterrows():
            min_r = None if pd.isna(row.get("min_rain_mm")) else int(row["min_rain_mm"])
            max_r = None if pd.isna(row.get("max_rain_mm")) else int(row["max_rain_mm"])
            has_range = min_r is not None and max_r is not None
            records.append({
                "species_id": int(row.get("species_id", len(records) + 1)),
                "name": str(row.get("name", "")),
                "scientific_name": str(row.get("scientific_name", "")),
                "broad_zone_hint": str(row.get("broad_zone_hint", "")),
                "broad_zone_tag": "Unverified",
                "min_rain_mm": min_r,
                "max_rain_mm": max_r,
                "rain_tag": "Assumption" if has_range else None,
                "rain_text": f"{min_r}-{max_rain_mm_val} mm" if has_range and (max_rain_mm_val := max_r) else "Range not sourced",
                "absorption_rate": None,
                "absorption_rate_text": "Not yet sourced",
                "note": "" if pd.isna(row.get("note", "")) else str(row.get("note", "")),
                "data_status": "assumption"
            })
        return records

    # Fallback to species.json if CSV not found
    path = os.path.join(SERVE_DIR, "species.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    return []


def get_priority_zones(state_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Rank districts of the selected state using backend/data/processed/fsi/districts_forest_cover_2023.csv
    by highest decline in forest cover from 2021 to 2023 relative to forest cover.
    Districts with no decline (change >= 0) are excluded so states with no decline show an empty state.
    """
    districts = []
    if os.path.exists(DISTRICTS_CSV_PATH):
        df = pd.read_csv(DISTRICTS_CSV_PATH)
        if state_id:
            df = df[df["state_id"] == state_id]

        chg_col = "change_vs_2021_km2" if "change_vs_2021_km2" in df.columns else "change_vs_previous_km2"
        cover_col = "forest_cover_km2" if "forest_cover_km2" in df.columns else "total_km2"

        for _, row in df.iterrows():
            chg = float(row.get(chg_col, 0))
            cov = float(row.get(cover_col, 0))
            # Only consider actual declines (change < 0)
            if chg < 0 and cov > 0:
                rel_decline = abs(chg) / cov
                districts.append({
                    "district_id": str(row.get("district_id", "")),
                    "state_id": str(row.get("state_id", "")),
                    "name": str(row.get("name", "")),
                    "forest_cover_km2": round(cov, 2),
                    "change_vs_2021_km2": round(chg, 2),
                    "relative_decline_pct": round(rel_decline * 100, 2),
                    "ranking_rule": "Highest relative forest cover decline: abs(change_vs_2021_km2) / forest_cover_km2",
                    "figures_status": "Real",
                    "ranking_status": "Proxy"
                })

        # Rank by highest relative decline descending
        districts.sort(key=lambda d: d["relative_decline_pct"], reverse=True)

    return districts


def evaluate_density_verdict(trees_per_ha: float) -> Dict[str, str]:
    if trees_per_ha < 250:
        return {"verdict": "sparse", "label": "Sparse", "tag": "Assumption"}
    elif trees_per_ha < 600:
        return {"verdict": "agroforestry", "label": "Agroforestry", "tag": "Assumption"}
    elif trees_per_ha < 1000:
        return {"verdict": "standard", "label": "Standard", "tag": "Assumption"}
    elif trees_per_ha < 2000:
        return {"verdict": "dense", "label": "Dense", "tag": "Assumption"}
    else:
        return {"verdict": "very_dense", "label": "Very Dense", "tag": "Assumption"}


def plan_reforestation(
    target_trees: Optional[int] = None,
    hectares: Optional[float] = None,
    survival_rate: Optional[float] = None,
    tree_age: str = "mature",
    rainfall_mm: Optional[int] = None,
    state: Optional[str] = None
) -> Dict[str, Any]:
    """
    Reforestation planning model with independent trees and hectares,
    non-blocking density warning, and range result for annual CO2 absorption.
    """
    trees = int(target_trees) if (target_trees is not None and target_trees > 0) else 500
    ha = float(hectares) if (hectares is not None and hectares > 0) else 6.5

    density = round(trees / ha, 2)
    spacing_m = round(math.sqrt(10000.0 / density), 2) if density > 0 else 0.0

    verdict_info = evaluate_density_verdict(density)

    # Unusual density warning (not a blocking error)
    density_warning = None
    if density >= 1000:
        density_warning = f"High density warning: {density:,.1f} trees/ha exceeds typical agroforestry spacing (400-800 trees/ha). Canopy competition will require progressive thinning."
    elif density < 50:
        density_warning = f"Low density notice: {density:,.1f} trees/ha is below standard afforestation density. Suitable for pasture enrichment or scattered agroforestry."

    # Age factors (min_multiplier, max_multiplier)
    age_factors = {
        "year_5": (0.15, 0.25),
        "year_10": (0.45, 0.60),
        "year_20": (0.75, 0.90),
        "mature": (0.85, 1.00)
    }
    min_factor, max_factor = age_factors.get(tree_age, (0.85, 1.00))

    # Baseline 21 kg per mature tree rule of thumb
    baseline_rate = 21.0
    effective_survival = 1.0 if survival_rate is None else max(0.1, min(1.0, float(survival_rate)))
    surviving_trees = round(trees * effective_survival)

    min_co2_kg = round(surviving_trees * min_factor * baseline_rate, 1)
    max_co2_kg = round(surviving_trees * max_factor * baseline_rate, 1)
    min_co2_tonnes = round(min_co2_kg / 1000.0, 2)
    max_co2_tonnes = round(max_co2_kg / 1000.0, 2)

    # Sourced species
    species_list = load_species()

    # Priority zones for selected state
    priority_zones = get_priority_zones(state) if state else []

    return {
        "inputs": {
            "target_trees": trees,
            "hectares": ha,
            "survival_rate": effective_survival,
            "tree_age": tree_age,
            "state": state
        },
        "density_trees_per_ha": density,
        "average_gap_m": spacing_m,
        "density_verdict": verdict_info["verdict"],
        "density_verdict_label": verdict_info["label"],
        "density_verdict_tag": verdict_info["tag"],
        "density_warning": density_warning,
        "surviving_trees": surviving_trees,
        "standard_absorption_per_tree_kg": baseline_rate,
        "standard_absorption_status": "assumption",
        "baseline_rate_kg": baseline_rate,
        "baseline_provenance": "A common rule of thumb used here as an Assumption. Source to be confirmed.",
        "annual_co2_kg_min": min_co2_kg,
        "annual_co2_kg_max": max_co2_kg,
        "annual_co2_tonnes_min": min_co2_tonnes,
        "annual_co2_tonnes_max": max_co2_tonnes,
        "annual_co2_range_text": f"{min_co2_tonnes} to {max_co2_tonnes} tonnes CO2/year",
        "formula": "CO2 absorption = surviving trees × age factor × baseline absorption rate (21 kg/tree/yr)",
        "formula_status": "Assumption",
        "priority_zones_count": len(priority_zones),
        "priority_zones": priority_zones[:5],
        "total_species_count": len(species_list),
        "data_status": "assumption"
    }
