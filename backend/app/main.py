"""
Main FastAPI Application Entrypoint for 'Dancing with the SARs'.
"""

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config.settings import settings
from app.api.routes import health, regions, observations, analyses, results

app = FastAPI(
    title=settings.APP_NAME,
    description="Scientific NISAR Earth observation and change-analysis backend focused on Uttarakhand, India.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static file serving for local processed raster/vector artifacts
os.makedirs(settings.STORAGE_LOCAL_DIR, exist_ok=True)
app.mount("/storage", StaticFiles(directory=settings.STORAGE_LOCAL_DIR), name="storage")

# Include Routers
app.include_router(health.router)
app.include_router(results.router)
app.include_router(regions.router, prefix=settings.API_V1_STR)
app.include_router(observations.router, prefix=settings.API_V1_STR)
app.include_router(analyses.router, prefix=settings.API_V1_STR)


@app.get("/", tags=["Root"])
def root():
    return {
        "project": "Dancing with the SARs",
        "role": "Scientific NISAR Backend",
        "scope": "Uttarakhand, India",
        "documentation": "/docs",
        "health": "/health",
        "api_v1_prefix": settings.API_V1_STR
    }
