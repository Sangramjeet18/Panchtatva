import os
import json
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel
try:
    from app.services.waterlogging_service import load_monitoring_areas, get_waterlogging_index
except ImportError:
    from backend.app.services.waterlogging_service import load_monitoring_areas, get_waterlogging_index

router = APIRouter(prefix="/waterlogging", tags=["Waterlogging"])


class MetaEnvelope(BaseModel):
    source: str
    data_status: str
    years: str
    downloaded: str


class StandardResponse(BaseModel):
    data: Any
    meta: MetaEnvelope


@router.get("/areas", response_model=StandardResponse)
def get_monitoring_areas():
    areas = load_monitoring_areas()
    return {
        "data": areas,
        "meta": {
            "source": "Kolkata Municipal Topography Survey",
            "data_status": "real",
            "years": "2023",
            "downloaded": "2026-11-21"
        }
    }


@router.get("/index", response_model=StandardResponse)
def get_index(
    rain: Optional[float] = Query(None, ge=0, description="Optional rainfall scenario in mm"),
    date: Optional[str] = Query(None, description="Target forecast date YYYY-MM-DD")
):
    if not isinstance(rain, (int, float)):
        rain = None
    if not isinstance(date, str):
        date = None
    results = get_waterlogging_index(rain_override=rain, target_date=date)
    return {
        "data": results,
        "meta": {
            "source": "Open-Meteo Forecast & Elevation Screening Index Rule",
            "data_status": "proxy",
            "years": "2026",
            "downloaded": "2026-11-21"
        }
    }
