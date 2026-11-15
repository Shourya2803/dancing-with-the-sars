"""
Analyses Management and Execution API Route.
Handles analysis creation, background scientific execution, polling, and results retrieval.
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks, Query
from typing import Dict, Any, Optional

from app.schemas.api_schemas import AnalysisCreateRequest, AnalysisResponse, RequestedPeriod
from app.services.processing_service import ProcessingService
from app.services.db_service import db_service

router = APIRouter(prefix="/analyses", tags=["Analyses"])
proc_service = ProcessingService(db=db_service)


@router.post("", response_model=AnalysisResponse)
async def create_analysis(
    payload: AnalysisCreateRequest,
    background_tasks: BackgroundTasks,
    async_exec: bool = Query(default=False, description="Whether to execute in background task (default False for synchronous demo)")
):
    # Validate date ordering
    if payload.start_date >= payload.end_date:
        raise HTTPException(
            status_code=400,
            detail=f"start_date ({payload.start_date}) must be earlier than end_date ({payload.end_date})."
        )

    # 1. Create analysis record in DB
    analysis_id = db_service.create_analysis(
        analysis_type=payload.analysis_type,
        region=payload.region,
        district=payload.district,
        aoi_geometry=payload.aoi_geometry,
        start_date=payload.start_date,
        end_date=payload.end_date,
        status="pending"
    )

    if async_exec:
        # Schedule in background
        background_tasks.add_task(
            proc_service.execute_analysis,
            analysis_id=analysis_id,
            region=payload.region,
            district=payload.district,
            custom_aoi_geojson=payload.aoi_geometry,
            start_date=payload.start_date,
            end_date=payload.end_date,
            analysis_type=payload.analysis_type,
            comparison_strategy=payload.comparison_strategy
        )

        return AnalysisResponse(
            analysis_id=analysis_id,
            status="pending",
            region=payload.region,
            district=payload.district,
            requested_period=RequestedPeriod(start=payload.start_date, end=payload.end_date),
            message="Analysis queued for background scientific processing. Poll /analyses/{analysis_id} for status."
        )
    else:
        # Execute synchronously
        result_dict = await proc_service.execute_analysis(
            analysis_id=analysis_id,
            region=payload.region,
            district=payload.district,
            custom_aoi_geojson=payload.aoi_geometry,
            start_date=payload.start_date,
            end_date=payload.end_date,
            analysis_type=payload.analysis_type,
            comparison_strategy=payload.comparison_strategy
        )

        return AnalysisResponse(
            analysis_id=analysis_id,
            status=result_dict.get("status", "completed"),
            region=result_dict.get("region", payload.region),
            district=result_dict.get("district", payload.district),
            requested_period=RequestedPeriod(start=payload.start_date, end=payload.end_date),
            observations_used=result_dict.get("observations_used", []),
            result=result_dict.get("result"),
            map=result_dict.get("map"),
            explanation=result_dict.get("explanation"),
            error=result_dict.get("error"),
            message=result_dict.get("message")
        )


@router.get("/{analysis_id}", response_model=AnalysisResponse)
def get_analysis_status(analysis_id: str):
    analysis = db_service.get_analysis(analysis_id)
    if not analysis:
        raise HTTPException(status_code=404, detail=f"Analysis with ID '{analysis_id}' not found.")

    res_record = db_service.get_analysis_result(analysis_id)
    result_payload = None
    map_artifacts = None
    explanation = None

    if res_record:
        result_payload = {
            "processor": res_record.get("result_type"),
            "change_metric": res_record.get("change_metric"),
            "changed_area_km2": res_record.get("changed_area_km2"),
            "change_percentage": res_record.get("change_percentage"),
            "classification": res_record.get("change_magnitude"),
            "statistics": res_record.get("statistics")
        }
        map_artifacts = {
            "geotiff_url": res_record.get("geotiff_url"),
            "geojson_url": res_record.get("geojson_url")
        }
        explanation = res_record.get("gemini_explanation")

    return AnalysisResponse(
        analysis_id=analysis_id,
        status=analysis.get("status", "pending"),
        region=analysis.get("region", "Uttarakhand"),
        district=analysis.get("district"),
        requested_period=RequestedPeriod(
            start=analysis.get("requested_start_date", ""),
            end=analysis.get("requested_end_date", "")
        ),
        observations_used=[],
        result=result_payload,
        map=map_artifacts,
        explanation=explanation,
        error=analysis.get("error_message")
    )


@router.get("/{analysis_id}/result", response_model=Dict[str, Any])
def get_analysis_full_result(analysis_id: str):
    res_record = db_service.get_analysis_result(analysis_id)
    if not res_record:
        analysis = db_service.get_analysis(analysis_id)
        if not analysis:
            raise HTTPException(status_code=404, detail=f"Analysis '{analysis_id}' not found.")
        return {
            "analysis_id": analysis_id,
            "status": analysis.get("status"),
            "message": "Analysis result is not yet available or failed."
        }
    return res_record
