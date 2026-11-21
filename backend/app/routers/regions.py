import os
import json
from typing import Dict, Any, List, Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

router = APIRouter(prefix="/regions", tags=["Regions"])

SERVE_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "serve")


class MetaEnvelope(BaseModel):
    source: str
    data_status: str
    years: str
    downloaded: str


class RegionsResponse(BaseModel):
    data: List[Dict[str, Any]]
    meta: MetaEnvelope


@router.get("", response_model=RegionsResponse)
def get_regions(level: Optional[str] = Query(None, description="Filter by level: state or district")):
    if not isinstance(level, str):
        level = None
    path = os.path.join(SERVE_DIR, "regions.json")
    regions = []
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            regions = json.load(f)

    if level:
        regions = [r for r in regions if r.get("level") == level]

    return {
        "data": regions,
        "meta": {
            "source": "Forest Survey of India / Census of India",
            "data_status": "real",
            "years": "2021-2023",
            "downloaded": "2026-11-21"
        }
    }
