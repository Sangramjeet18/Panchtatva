import os
import json
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field
try:
    from app.services.carbon_service import calculate_carbon_footprint, load_factors
except ImportError:
    from backend.app.services.carbon_service import calculate_carbon_footprint, load_factors

router = APIRouter(prefix="/carbon", tags=["Carbon"])

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


class MetaEnvelope(BaseModel):
    source: str
    data_status: str
    years: str
    downloaded: str


class StandardResponse(BaseModel):
    data: Any
    meta: MetaEnvelope


class CarbonCalcRequest(BaseModel):
    electricity_kwh_monthly: float = Field(..., ge=0, description="Monthly grid electricity in kWh")
    car_km_weekly: float = Field(0, ge=0, description="Weekly personal car travel in km")
    bus_km_weekly: float = Field(0, ge=0, description="Weekly city bus travel in km")
    metro_km_weekly: float = Field(0, ge=0, description="Weekly metro rail travel in km")
    flights_yearly: int = Field(0, ge=0, description="Annual domestic short flights")
    diet_type: str = Field("vegetarian", description="vegetarian, mixed, or meatHeavy")


@router.get("/factors", response_model=StandardResponse)
def get_factors():
    factors = load_factors()
    return {
        "data": factors,
        "meta": {
            "source": "Central Electricity Authority / IPCC Guidelines",
            "data_status": "assumption",
            "years": "2020-2023",
            "downloaded": "2026-11-21"
        }
    }


@router.get("/countries", response_model=StandardResponse)
def get_countries():
    path = os.path.join(SERVE_DIR, "co2_countries.json")
    records = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            records = json.load(f)

    return {
        "data": records,
        "meta": {
            "source": "Our World in Data (OWID) / Global Carbon Project",
            "data_status": "real",
            "years": "1990-2022",
            "downloaded": "2026-11-21"
        }
    }


@router.get("/air", response_model=StandardResponse)
def get_air_quality():
    path = os.path.join(SERVE_DIR, "kolkata_air_live.json")
    records = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            records = json.load(f)

    return {
        "data": records,
        "meta": {
            "source": "Copernicus Atmosphere Monitoring Service (CAMS) via Open-Meteo",
            "data_status": "modelled",
            "years": "2026",
            "downloaded": "2026-11-21"
        }
    }


@router.post("/calc", response_model=StandardResponse)
def calculate_footprint(payload: CarbonCalcRequest):
    result = calculate_carbon_footprint(
        electricity_kwh_monthly=payload.electricity_kwh_monthly,
        car_km_weekly=payload.car_km_weekly,
        bus_km_weekly=payload.bus_km_weekly,
        metro_km_weekly=payload.metro_km_weekly,
        flights_yearly=payload.flights_yearly,
        diet_type=payload.diet_type
    )
    return {
        "data": result,
        "meta": {
            "source": "CEA Grid Database & IPCC Factor Accounting",
            "data_status": "assumption",
            "years": "2023",
            "downloaded": "2026-11-21"
        }
    }
