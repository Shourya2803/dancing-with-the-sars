"""
API Request and Response Pydantic Schemas.
Ensures strong typing, input validation, and exact JSON responses for frontend clients.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class RequestedPeriod(BaseModel):
    start: str
    end: str


class ObservationSummary(BaseModel):
    granule_id: Optional[str] = None
    time: Optional[str] = None
    track: Optional[int] = None
    frame: Optional[int] = None


class ScientificResultStatistics(BaseModel):
    mean_db: Optional[float] = None
    std_db: Optional[float] = None
    median_db: Optional[float] = None
    min_db: Optional[float] = None
    max_db: Optional[float] = None
    p10_db: Optional[float] = None
    p90_db: Optional[float] = None


class ScientificResultPayload(BaseModel):
    processor: Optional[str] = None
    spatial_reference: Optional[str] = None
    pixel_resolution_m: Optional[List[float]] = None
    change_metric: Optional[str] = None
    changed_area_km2: Optional[float] = None
    change_percentage: Optional[float] = None
    classification: Optional[str] = None
    statistics: Optional[Dict[str, Any]] = None
    change_distribution: Optional[Dict[str, Any]] = None
    scientific_limitations: Optional[List[str]] = None


class MapArtifacts(BaseModel):
    geotiff_url: Optional[str] = None
    geojson_url: Optional[str] = None


class LocationRef(BaseModel):
    id: str = Field(..., description="Unique city/area ID (e.g. 'joshimath')")
    name: str = Field(..., description="Official name of the city or area (e.g. 'Joshimath')")
    district: Optional[str] = Field(default=None, description="Parent district (e.g. 'Chamoli')")


class AnalysisCreateRequest(BaseModel):
    region: str = Field(default="Uttarakhand", description="Target region (default: Uttarakhand)")
    location: Optional[LocationRef] = Field(default=None, description="Selected city/area in Uttarakhand")
    district: Optional[str] = Field(default=None, description="Uttarakhand district name (e.g. 'Chamoli')")
    aoi_geometry: Optional[Dict[str, Any]] = Field(default=None, description="Custom GeoJSON Polygon or MultiPolygon")
    start_date: str = Field(..., description="Requested start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="Requested end date (YYYY-MM-DD)")
    analysis_type: str = Field(
        default="surface_change",
        description="Scientific analysis type ('surface_change' for GCOV RTC backscatter, 'insar_deformation' for GUNW)"
    )
    comparison_strategy: str = Field(
        default="first_vs_last",
        description="Temporal comparison strategy ('first_vs_last', 'sequential', 'all_pairs')"
    )


class AnalysisResponse(BaseModel):
    analysis_id: str
    status: str = Field(..., description="Current status: pending, searching, processing, storing, completed, failed, insufficient_data")
    region: str = "Uttarakhand"
    location: Optional[LocationRef] = None
    location_name: Optional[str] = None
    district: Optional[str] = None
    requested_period: RequestedPeriod
    observations_used: List[ObservationSummary] = []
    result: Optional[ScientificResultPayload] = None
    map: Optional[MapArtifacts] = None
    explanation: Optional[str] = None
    error: Optional[str] = None
    message: Optional[str] = None


class ObservationSearchRequest(BaseModel):
    district: Optional[str] = None
    bbox: Optional[List[float]] = Field(default=None, description="[min_lon, min_lat, max_lon, max_lat]")
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    product_type: str = "GCOV"


class ObservationSearchResponse(BaseModel):
    total_found: int
    product_type: str
    search_bbox: List[float]
    granules: List[Dict[str, Any]]


class DistrictDetail(BaseModel):
    id: str
    name: str
    division: str
    headquarters: str
    area_km2: float
    centroid: Dict[str, float]
    bbox: List[float]


class LocationDetail(BaseModel):
    id: str
    name: str
    district: str
    division: str
    latitude: float
    longitude: float
    elevation_m: float
    description: str
    bbox: List[float]
    geometry: Dict[str, Any]
    default_nisar_track: int = 106
    default_nisar_frame: int = 73
    mapX: float
    mapY: float


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    environment: str
    cmr_search_endpoint: str
    storage_provider: str
    supabase_configured: bool
    gemini_configured: bool
