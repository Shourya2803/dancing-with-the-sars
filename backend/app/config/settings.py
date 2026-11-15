"""
Application Configuration and Settings.
Uses Pydantic BaseSettings to load and validate environment variables with sensible defaults.
"""

import json
import os
from typing import Any, List, Optional
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "Dancing with the SARs - Scientific NISAR Backend"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False
    ENVIRONMENT: str = "production"
    
    # CORS
    CORS_ORIGINS: Any = ["*"]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Any) -> List[str]:
        if isinstance(v, list):
            return [str(item).strip() for item in v if str(item).strip()]
        if isinstance(v, str):
            v = v.strip()
            if not v or v in ("*", '""', "''", '["*"]'):
                return ["*"]
            if v.startswith("[") and v.endswith("]"):
                try:
                    parsed = json.loads(v)
                    if isinstance(parsed, list):
                        return [str(item).strip() for item in parsed if str(item).strip()]
                except Exception:
                    try:
                        clean_v = v.replace("'", '"')
                        parsed = json.loads(clean_v)
                        if isinstance(parsed, list):
                            return [str(item).strip() for item in parsed if str(item).strip()]
                    except Exception:
                        pass
            origins = [o.strip() for o in v.split(",") if o.strip()]
            return origins if origins else ["*"]
        return ["*"]

    # NASA Earthdata / CMR Search Configuration
    NASA_CMR_SEARCH_URL: str = "https://cmr.earthdata.nasa.gov/search/granules.json"
    NISAR_GCOV_COLLECTION_ID: str = "C2854338529-ASF"
    NISAR_GUNW_COLLECTION_ID: str = "C2854335566-ASF"
    NISAR_PROVIDER: str = "ASF"
    EARTHDATA_USERNAME: Optional[str] = None
    EARTHDATA_PASSWORD: Optional[str] = None

    # Supabase / PostgreSQL Configuration
    SUPABASE_URL: Optional[str] = None
    SUPABASE_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    # Cloudflare R2 / S3 Configuration
    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET: Optional[str] = None
    R2_PUBLIC_URL: Optional[str] = None

    # Google Gemini API
    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Local Directory Paths
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    STORAGE_LOCAL_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "storage")
    DATA_CACHE_DIR: str = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "cache")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def r2_endpoint_url(self) -> Optional[str]:
        if self.R2_ACCOUNT_ID:
            return f"https://{self.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
        return None


settings = Settings()
