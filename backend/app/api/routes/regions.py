"""
Geographic Regions and Uttarakhand Districts API Route.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.data.uttarakhand_districts import get_all_districts, get_district_info, UTTARAKHAND_DISTRICTS
from app.data.uttarakhand_cities import get_all_cities, get_city_info, UTTARAKHAND_CITIES
from app.schemas.api_schemas import DistrictDetail, LocationDetail

router = APIRouter(prefix="/regions", tags=["Regions"])


@router.get("", response_model=List[Dict[str, Any]])
def list_supported_regions():
    return [
        {
            "id": "uttarakhand",
            "name": "Uttarakhand, India",
            "state_code": "UK",
            "districts_count": len(UTTARAKHAND_DISTRICTS),
            "cities_count": len(UTTARAKHAND_CITIES),
            "dominant_nisar_track": 106,
            "repeat_cycle_days": 12,
            "description": "Himalayan state in Northern India; operational geographic scope for Dancing with the SARs."
        }
    ]


@router.get("/uttarakhand/districts", response_model=List[DistrictDetail])
def list_uttarakhand_districts():
    return get_all_districts()


@router.get("/uttarakhand/districts/{district_id}", response_model=Dict[str, Any])
def get_district_details(district_id: str):
    data = get_district_info(district_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"District '{district_id}' not found in Uttarakhand.")
    return data


@router.get("/uttarakhand/cities", response_model=List[LocationDetail])
def list_uttarakhand_cities():
    """List verified real cities and areas across Uttarakhand with WGS84 coordinates and AOI geometries."""
    return get_all_cities()


@router.get("/uttarakhand/cities/{city_id}", response_model=LocationDetail)
def get_city_details(city_id: str):
    """Retrieve detailed metadata, elevation, and AOI geometry for a specific Uttarakhand city/area."""
    data = get_city_info(city_id)
    if not data:
        raise HTTPException(status_code=404, detail=f"City/Area '{city_id}' not found in Uttarakhand.")
    return data
