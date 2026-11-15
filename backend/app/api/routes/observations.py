"""
NISAR Observations Discovery and Search API Route.
Queries NASA CMR for live granules matching geographic and temporal filters.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Dict, Any

from app.schemas.api_schemas import ObservationSearchRequest, ObservationSearchResponse
from app.services.cmr_search_service import CMRSearchService
from app.data.uttarakhand_districts import get_district_info, UTTARAKHAND_DISTRICTS

router = APIRouter(prefix="/observations", tags=["Observations"])
cmr_service = CMRSearchService()


@router.post("/search", response_model=ObservationSearchResponse)
async def search_observations(payload: ObservationSearchRequest):
    # Determine bounding box
    bbox = None
    if payload.district:
        dist = get_district_info(payload.district)
        if not dist:
            raise HTTPException(status_code=400, detail=f"Invalid district: '{payload.district}'.")
        bbox = tuple(dist["bbox"])
    elif payload.bbox:
        if len(payload.bbox) != 4:
            raise HTTPException(status_code=400, detail="Bounding box must contain exactly 4 coordinates: [min_lon, min_lat, max_lon, max_lat].")
        bbox = tuple(payload.bbox)
    else:
        # Default to entire Uttarakhand
        bbox = (77.5, 28.7, 81.1, 31.5)

    try:
        granules = await cmr_service.search_nisar_granules(
            bbox=bbox,
            start_date=payload.start_date,
            end_date=payload.end_date,
            product_type=payload.product_type
        )
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"NASA CMR search error: {str(e)}")

    return ObservationSearchResponse(
        total_found=len(granules),
        product_type=payload.product_type,
        search_bbox=list(bbox),
        granules=granules
    )
