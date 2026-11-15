"""
Geographic Regions and Uttarakhand Districts API Route.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any
from app.data.uttarakhand_districts import get_all_districts, get_district_info, UTTARAKHAND_DISTRICTS
from app.schemas.api_schemas import DistrictDetail

router = APIRouter(prefix="/regions", tags=["Regions"])


@router.get("", response_model=List[Dict[str, Any]])
def list_supported_regions():
    return [
        {
            "id": "uttarakhand",
            "name": "Uttarakhand, India",
            "state_code": "UK",
            "districts_count": len(UTTARAKHAND_DISTRICTS),
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
