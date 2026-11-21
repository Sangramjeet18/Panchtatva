import os
import json
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Query, HTTPException
from pydantic import BaseModel
try:
    from app.services.forest_service import get_national_forest_forecast
except ImportError:
    from backend.app.services.forest_service import get_national_forest_forecast

router = APIRouter(prefix="/forest", tags=["Forest"])

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


class MetaEnvelope(BaseModel):
    source: str
    data_status: str
    years: str
    downloaded: str


class StandardResponse(BaseModel):
    data: Any
    meta: MetaEnvelope


@router.get("/states", response_model=StandardResponse)
def get_forest_states():
    path = os.path.join(SERVE_DIR, "forest_cover_assessments.json")
    records = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            records = json.load(f)

    # Filter to states (level is state or id starts with IN-)
    state_records = [r for r in records if str(r.get("region_id", "")).startswith("IN-")]

    return {
        "data": state_records,
        "meta": {
            "source": "Forest Survey of India (ISFR Biennial Assessment)",
            "data_status": "real",
            "years": "2013-2023",
            "downloaded": "2026-11-21"
        }
    }


@router.get("/districts", response_model=StandardResponse)
def get_forest_districts(
    state: Optional[str] = Query(None, description="State ID or code"),
    q: Optional[str] = Query(None, description="Search query by district name"),
    sort: Optional[str] = Query("name", description="Sort field: name, total_km2, change"),
    page: int = Query(1, ge=1, description="Page number"),
    size: int = Query(50, ge=1, le=1000, description="Items per page")
):
    if not isinstance(state, str):
        state = None
    if not isinstance(q, str):
        q = None
    if not isinstance(sort, str):
        sort = "name"
    if not isinstance(page, int):
        page = 1
    if not isinstance(size, int):
        size = 50
    path = os.path.join(SERVE_DIR, "forest_cover_assessments.json")
    records = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            records = json.load(f)

    # Filter district records (not starting with IN-)
    districts = [r for r in records if not str(r.get("region_id", "")).startswith("IN-")]

    if state:
        districts = [d for d in districts if d.get("parent_id") == state or d.get("state_id") == state]

    if q:
        query_str = q.lower().strip()
        districts = [d for d in districts if query_str in d.get("region_name", "").lower()]

    # Sort
    if sort == "total_km2":
        districts.sort(key=lambda x: float(x.get("total_km2", 0)), reverse=True)
    elif sort == "change":
        districts.sort(key=lambda x: float(x.get("change_vs_previous_km2", 0)), reverse=True)
    else:
        districts.sort(key=lambda x: str(x.get("region_name", "")))

    total_count = len(districts)
    start_idx = (page - 1) * size
    end_idx = start_idx + size
    paged_items = districts[start_idx:end_idx]

    return {
        "data": {
            "items": paged_items,
            "total": total_count,
            "page": page,
            "size": size,
            "pages": (total_count + size - 1) // size if total_count > 0 else 1
        },
        "meta": {
            "source": "Forest Survey of India (ISFR 2021/2023)",
            "data_status": "real",
            "years": "2021-2023",
            "downloaded": "2026-11-21"
        }
    }


@router.get("/national", response_model=StandardResponse)
def get_forest_national():
    forecast_result = get_national_forest_forecast()
    return {
        "data": forecast_result,
        "meta": {
            "source": "World Bank / FAO National Forest Area Indicator (AG.LND.FRST.K2)",
            "data_status": "real",
            "years": "1990-2033",
            "downloaded": "2026-11-21"
        }
    }
