import sys
import os
import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
try:
    from app.services.reforestation_service import load_species, plan_reforestation, get_priority_zones
    from app.routers.reforestation import get_species, get_priority_zones_endpoint, create_plan, ReforestationPlanRequest
except ImportError:
    from backend.app.services.reforestation_service import load_species, plan_reforestation, get_priority_zones
    from backend.app.routers.reforestation import get_species, get_priority_zones_endpoint, create_plan, ReforestationPlanRequest


def test_species_candidates_exact_19():
    species = load_species()
    assert len(species) == 19, f"Expected exactly 19 species candidates, got {len(species)}"
    
    # Verify no absorption rate values exist (must be None and 'Not yet sourced')
    for sp in species:
        assert sp["absorption_rate"] is None, f"Species {sp['name']} has an absorption rate value, expected None"
        assert sp["absorption_rate_text"] == "Not yet sourced"
        assert sp["broad_zone_tag"] == "Unverified"
        assert sp["data_status"] == "assumption"


def test_species_rainfall_sourcing():
    species = load_species()
    sourced_count = 0
    unsourced_count = 0

    for sp in species:
        if sp["min_rain_mm"] is not None and sp["max_rain_mm"] is not None:
            sourced_count += 1
            assert sp["rain_tag"] == "Assumption"
        else:
            unsourced_count += 1
            assert sp["rain_text"] == "Range not sourced"

    assert sourced_count > 0, "Expected some species with sourced rainfall ranges"
    assert unsourced_count > 0, "Expected some species with unsourced rainfall ranges"
    assert sourced_count + unsourced_count == 19


def test_plan_500_trees_on_6_point_5_ha():
    result = plan_reforestation(target_trees=500, hectares=6.5)
    assert result["inputs"]["target_trees"] == 500
    assert result["inputs"]["hectares"] == 6.5
    assert result["density_trees_per_ha"] == 76.92
    assert result["density_verdict"] == "sparse"
    assert result["density_verdict_tag"] == "Assumption"
    assert result["surviving_trees"] > 0
    assert result["annual_co2_kg_min"] > 0
    assert result["annual_co2_kg_max"] >= result["annual_co2_kg_min"]
    assert "Assumption" in result["baseline_provenance"]


def test_plan_6000_trees_on_6_ha_shows_warning_not_error():
    result = plan_reforestation(target_trees=6000, hectares=6.0)
    assert result["inputs"]["target_trees"] == 6000
    assert result["inputs"]["hectares"] == 6.0
    assert result["density_trees_per_ha"] == 1000.0
    # Must show a density warning, NOT an error
    assert result["density_warning"] is not None
    assert "High density warning" in result["density_warning"]
    assert result["density_verdict"] == "dense"


def test_priority_zones_ranking_and_empty_state():
    wb_zones = get_priority_zones("IN-WB")
    assert isinstance(wb_zones, list)
    if len(wb_zones) > 0:
        # Check ranking order: highest relative decline first
        for i in range(len(wb_zones) - 1):
            assert wb_zones[i]["relative_decline_pct"] >= wb_zones[i + 1]["relative_decline_pct"]
            assert wb_zones[i]["change_vs_2021_km2"] < 0
            assert wb_zones[i]["figures_status"] == "Real"
            assert wb_zones[i]["ranking_status"] == "Proxy"

    # State with no decline (e.g. IN-LD) should return empty list
    ld_zones = get_priority_zones("IN-LD")
    assert ld_zones == [], "Expected empty list for state with no forest cover decline"


def test_api_reforestation_router_functions():
    # 1. get_species()
    resp = get_species()
    assert "data" in resp
    assert len(resp["data"]) == 19
    for item in resp["data"]:
        assert item["absorption_rate"] is None
        assert item["absorption_rate_text"] == "Not yet sourced"

    # 2. get_priority_zones_endpoint(state="IN-WB")
    resp_pz = get_priority_zones_endpoint(state="IN-WB")
    assert "data" in resp_pz
    assert "districts" in resp_pz["data"]

    # 3. create_plan(...)
    req = ReforestationPlanRequest(target_trees=500, hectares=6.5)
    resp_plan = create_plan(payload=req)
    assert "data" in resp_plan
    plan = resp_plan["data"]
    assert plan["target_trees"] == 500
    assert plan["density_trees_per_ha"] == 76.92
    assert plan["density_verdict"] == "sparse"
