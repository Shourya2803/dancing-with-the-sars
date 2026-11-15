"""
Health Check and Service Diagnostics API Route.
"""

from fastapi import APIRouter
from app.config.settings import settings
from app.schemas.api_schemas import HealthResponse

router = APIRouter(tags=["Health"])


@router.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="ok",
        service=settings.APP_NAME,
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        cmr_search_endpoint=settings.NASA_CMR_SEARCH_URL,
        storage_provider="cloudflare_r2" if (settings.R2_ACCOUNT_ID and settings.R2_BUCKET) else "local_disk",
        supabase_configured=bool(settings.SUPABASE_URL and settings.SUPABASE_KEY),
        gemini_configured=bool(settings.GEMINI_API_KEY)
    )
