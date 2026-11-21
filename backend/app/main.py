import os
import sys

# Ensure backend directory is in sys.path
backend_dir = os.path.dirname(os.path.dirname(__file__))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from app.routers.regions import router as regions_router
    from app.routers.forest import router as forest_router
    from app.routers.carbon import router as carbon_router
    from app.routers.reforestation import router as reforestation_router
    from app.routers.waterlogging import router as waterlogging_router
except ImportError:
    from backend.app.routers.regions import router as regions_router
    from backend.app.routers.forest import router as forest_router
    from backend.app.routers.carbon import router as carbon_router
    from backend.app.routers.reforestation import router as reforestation_router
    from backend.app.routers.waterlogging import router as waterlogging_router

app = FastAPI(
    title="EcoSense API",
    description="Environmental Prediction and Analytical Intelligence for India",
    version="1.0.0"
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://ecosense.vercel.app",
    "https://panchtatva.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(regions_router)
app.include_router(forest_router)
app.include_router(carbon_router)
app.include_router(reforestation_router)
app.include_router(waterlogging_router)


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "ecosense-backend"}


@app.get("/")
def root():
    return {
        "service": "EcoSense Environmental Prediction API",
        "version": "1.0.0",
        "data_truth_rules_active": True,
        "endpoints": [
            "/health",
            "/regions",
            "/forest/states",
            "/forest/districts",
            "/forest/national",
            "/carbon/factors",
            "/carbon/countries",
            "/carbon/air",
            "/carbon/calc",
            "/reforestation/species",
            "/reforestation/plan",
            "/waterlogging/areas",
            "/waterlogging/index"
        ]
    }
