"""
Direct Results Query API Route.
Allows fetching a completed analysis result directly via /result/{result_id}.
"""

from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from app.services.db_service import db_service

router = APIRouter(tags=["Results"])


@router.get("/result/{result_id}", response_model=Dict[str, Any])
def get_result_by_id(result_id: str):
    """
    Direct lookup endpoint for analysis results.
    Accepts either result_id or analysis_id.
    """
    # Check if passed ID matches analysis_id
    res_record = db_service.get_analysis_result(result_id)
    if res_record:
        return res_record

    # Check local results by result_id
    for aid, rec in db_service._local_results.items():
        if rec.get("id") == result_id or aid == result_id:
            return rec

    raise HTTPException(status_code=404, detail=f"Analysis result '{result_id}' not found.")
