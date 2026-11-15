"""
Database Persistence Service.
Interacts with Supabase PostgreSQL/PostGIS for analyses, observations, and results metadata.
Includes in-memory cache/fallback for rapid local testing when Supabase keys are not yet configured.
"""

from typing import Dict, Any, Optional, List
import uuid
from datetime import datetime, timezone

from app.config.settings import settings

try:
    from supabase import create_client, Client
    SUPABASE_INSTALLED = True
except ImportError:
    SUPABASE_INSTALLED = False


class DBService:
    """
    Manages persistence of analysis metadata, observations, and quantitative results.
    """

    def __init__(self):
        self.client: Optional[Any] = None
        self.use_supabase = False
        
        if SUPABASE_INSTALLED and settings.SUPABASE_URL and settings.SUPABASE_KEY:
            try:
                self.client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
                self.use_supabase = True
            except Exception as e:
                print(f"[DBService Warning] Failed to initialize Supabase client: {e}. Using local store.")
        
        # In-memory store fallback
        self._local_analyses: Dict[str, Dict[str, Any]] = {}
        self._local_observations: Dict[str, List[Dict[str, Any]]] = {}
        self._local_results: Dict[str, Dict[str, Any]] = {}

    def create_analysis(
        self,
        analysis_type: str,
        region: str,
        district: Optional[str],
        aoi_geometry: Optional[Dict[str, Any]],
        start_date: str,
        end_date: str,
        status: str = "pending"
    ) -> str:
        analysis_id = str(uuid.uuid4())
        record = {
            "id": analysis_id,
            "analysis_type": analysis_type,
            "region": region,
            "district": district,
            "requested_start_date": start_date,
            "requested_end_date": end_date,
            "status": status,
            "created_at": datetime.now(timezone.utc).isoformat(),
            "started_at": None,
            "completed_at": None,
            "error_message": None
        }

        if self.use_supabase and self.client:
            try:
                # Omit complex geometry if PostGIS transform not ready
                db_record = dict(record)
                self.client.table("analyses").insert(db_record).execute()
            except Exception as e:
                print(f"[DBService Error] Supabase insert failed: {e}. Storing locally.")

        self._local_analyses[analysis_id] = record
        return analysis_id

    def update_analysis_status(
        self,
        analysis_id: str,
        status: str,
        error_message: Optional[str] = None
    ) -> None:
        now_str = datetime.now(timezone.utc).isoformat()
        updates: Dict[str, Any] = {"status": status}
        if status in ["processing", "searching"]:
            updates["started_at"] = now_str
        elif status in ["completed", "failed", "insufficient_data"]:
            updates["completed_at"] = now_str
        
        if error_message:
            updates["error_message"] = error_message

        if self.use_supabase and self.client:
            try:
                self.client.table("analyses").update(updates).eq("id", analysis_id).execute()
            except Exception as e:
                print(f"[DBService Error] Supabase update failed: {e}")

        if analysis_id in self._local_analyses:
            self._local_analyses[analysis_id].update(updates)

    def get_analysis(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase and self.client:
            try:
                resp = self.client.table("analyses").select("*").eq("id", analysis_id).execute()
                if resp.data:
                    return resp.data[0]
            except Exception as e:
                print(f"[DBService Error] Supabase get failed: {e}")

        return self._local_analyses.get(analysis_id)

    def record_observations(
        self,
        analysis_id: str,
        observations: List[Dict[str, Any]]
    ) -> None:
        records = []
        for obs in observations:
            rec = {
                "id": str(uuid.uuid4()),
                "analysis_id": analysis_id,
                "product_identifier": obs.get("granule_id", "unknown"),
                "product_type": obs.get("product_type", "GCOV"),
                "acquisition_timestamp": obs.get("time_start") or datetime.now(timezone.utc).isoformat(),
                "track": obs.get("track"),
                "frame": obs.get("frame"),
                "flight_direction": obs.get("flight_direction"),
                "is_suitable": obs.get("is_suitable", True),
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            records.append(rec)

        if self.use_supabase and self.client and records:
            try:
                self.client.table("observations").insert(records).execute()
            except Exception as e:
                print(f"[DBService Error] Supabase record_observations failed: {e}")

        self._local_observations.setdefault(analysis_id, []).extend(records)

    def save_analysis_result(
        self,
        analysis_id: str,
        observations_used: List[str],
        result_type: str,
        change_metric: str,
        changed_area_km2: Optional[float],
        change_percentage: Optional[float],
        change_magnitude: Optional[str],
        statistics: Optional[Dict[str, Any]],
        geotiff_info: Optional[Dict[str, str]],
        geojson_info: Optional[Dict[str, str]],
        gemini_explanation: Optional[str] = None
    ) -> Dict[str, Any]:
        result_record = {
            "id": str(uuid.uuid4()),
            "analysis_id": analysis_id,
            "observations_used": observations_used,
            "result_type": result_type,
            "change_metric": change_metric,
            "changed_area_km2": changed_area_km2,
            "change_percentage": change_percentage,
            "change_magnitude": change_magnitude,
            "statistics": statistics,
            "geotiff_r2_key": geotiff_info.get("object_key") if geotiff_info else None,
            "geotiff_url": geotiff_info.get("url") if geotiff_info else None,
            "geojson_r2_key": geojson_info.get("object_key") if geojson_info else None,
            "geojson_url": geojson_info.get("url") if geojson_info else None,
            "gemini_explanation": gemini_explanation,
            "created_at": datetime.now(timezone.utc).isoformat()
        }

        if self.use_supabase and self.client:
            try:
                self.client.table("analysis_results").insert(result_record).execute()
            except Exception as e:
                print(f"[DBService Error] Supabase save_analysis_result failed: {e}")

        self._local_results[analysis_id] = result_record
        return result_record

    def get_analysis_result(self, analysis_id: str) -> Optional[Dict[str, Any]]:
        if self.use_supabase and self.client:
            try:
                resp = self.client.table("analysis_results").select("*").eq("analysis_id", analysis_id).execute()
                if resp.data:
                    return resp.data[0]
            except Exception as e:
                print(f"[DBService Error] Supabase get result failed: {e}")

        return self._local_results.get(analysis_id)


# Shared singleton instance
db_service = DBService()
