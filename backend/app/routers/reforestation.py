import os
import json
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
try:
    from app.services.reforestation_service import load_species, plan_reforestation
    from app.limiter import rate_limit_post
except ImportError:
    from backend.app.services.reforestation_service import load_species, plan_reforestation
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
    target_trees: Optional[int] = Field(None, ge=1, description="Target number of saplings")
    hectares: Optional[float] = Field(None, ge=0.01, description="Target land area in hectares")
    rainfall_mm: Optional[int] = Field(None, ge=0, description="Regional rainfall in mm/year")
    region: Optional[str] = Field(None, description="Target region or state name")


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


@router.post("/plan", response_model=StandardResponse, dependencies=[Depends(rate_limit_post)])
def create_plan(payload: ReforestationPlanRequest):
    result = plan_reforestation(
        target_trees=payload.target_trees,
        hectares=payload.hectares,
        rainfall_mm=payload.rainfall_mm,
        region=payload.region
    )
    return {
        "data": result,
        "meta": {
            "source": "ICFRE Species Baseline & FSI Sequestration Model",
            "data_status": "assumption",
            "years": "2022",
            "downloaded": "2026-11-21"
        }
    }
