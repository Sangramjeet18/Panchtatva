import os
import json
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends, Query
from pydantic import BaseModel, Field
try:
    from app.services.reforestation_service import load_species, plan_reforestation, get_priority_zones
    from app.limiter import rate_limit_post
except ImportError:
    from backend.app.services.reforestation_service import load_species, plan_reforestation, get_priority_zones
    from backend.app.limiter import rate_limit_post

router = APIRouter(prefix="/reforestation", tags=["Reforestation"])


class MetaEnvelope(BaseModel):
    source: str
    data_status: str
    years: str
    downloaded: str


class StandardResponse(BaseModel):
    data: Any
    meta: MetaEnvelope


class ReforestationPlanRequest(BaseModel):
    target_trees: Optional[int] = Field(None, gt=0, description="Target number of saplings")
    trees: Optional[int] = Field(None, gt=0, description="Alias for target_trees")
    hectares: Optional[float] = Field(None, gt=0.0, description="Target land area in hectares")
    survival_rate: Optional[float] = Field(None, ge=0.1, le=1.0, description="Selectable survival rate (0.1 to 1.0)")
    tree_age: Optional[str] = Field("mature", description="Tree age: year_5, year_10, year_20, mature")
    rainfall_mm: Optional[int] = Field(None, ge=0, description="Regional rainfall in mm/year")
    state: Optional[str] = Field(None, description="Target state code e.g. IN-WB")
    region: Optional[str] = Field(None, description="Alias for state")


@router.get("/species", response_model=StandardResponse)
def get_species():
    species = load_species()
    return {
        "data": species,
        "meta": {
            "source": "Indian Council of Forestry Research and Education (ICFRE)",
            "data_status": "assumption",
            "years": "2022",
            "downloaded": "2026-11-21"
        }
    }


@router.get("/priority-zones", response_model=StandardResponse)
def get_priority_zones_endpoint(state: Optional[str] = Query(None, description="State ID e.g. IN-WB")):
    zones = get_priority_zones(state_id=state)
    return {
        "data": {
            "state_id": state,
            "districts_count": len(zones),
            "ranking_description": "Districts with the largest forest cover decline from 2021 to 2023 relative to forest cover",
            "formula": "Relative decline = decline in forest cover (km2) / total forest cover (km2)",
            "figures_status": "Real",
            "ranking_status": "Proxy",
            "districts": zones
        },
        "meta": {
            "source": "Forest Survey of India (ISFR Biennial Assessment)",
            "data_status": "proxy",
            "years": "2021-2023",
            "downloaded": "2026-11-21"
        }
    }


@router.post("/plan", response_model=StandardResponse, dependencies=[Depends(rate_limit_post)])
def create_plan(payload: ReforestationPlanRequest):
    # Support both target_trees and trees, state and region
    t = payload.target_trees or payload.trees
    st = payload.state or payload.region

    result = plan_reforestation(
        target_trees=t,
        hectares=payload.hectares,
        survival_rate=payload.survival_rate if payload.survival_rate is not None else 0.85,
        tree_age=payload.tree_age or "mature",
        rainfall_mm=payload.rainfall_mm,
        state=st
    )
    # Include backward-compatible fields for smoke test suite
    result["target_trees"] = result["inputs"]["target_trees"]
    result["hectares"] = result["inputs"]["hectares"]
    result["annual_co2_kg"] = round(result["target_trees"] * 21.0, 1)

    return {
        "data": result,
        "meta": {
            "source": "ICFRE Species Candidates & Rule of Thumb Baseline",
            "data_status": "assumption",
            "years": "2022",
            "downloaded": "2026-11-21"
        }
    }
