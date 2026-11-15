"""
NASA CMR (Common Metadata Repository) Search Service.
Queries official NASA Earthdata CMR API to find actual, verified NISAR observations
over Uttarakhand and user-specified AOIs.
"""

from typing import List, Dict, Any, Optional, Tuple
import httpx
import re
from datetime import datetime

from app.config.settings import settings


class CMRSearchError(Exception):
    """Raised when NASA CMR query fails or returns an error."""
    pass


class CMRSearchService:
    """
    Service for querying live NASA CMR Granule Search API for NISAR data.
    """

    def __init__(self, cmr_url: Optional[str] = None):
        self.cmr_url = cmr_url or settings.NASA_CMR_SEARCH_URL

    async def search_nisar_granules(
        self,
        bbox: Tuple[float, float, float, float],
        start_date: Optional[str] = None,
        end_date: Optional[str] = None,
        product_type: str = "GCOV",
        page_size: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Searches NASA CMR for NISAR granules intersecting a bounding box and temporal range.
        
        Parameters:
            bbox: (min_lon, min_lat, max_lon, max_lat)
            start_date: ISO string e.g. "2025-10-01T00:00:00Z"
            end_date: ISO string e.g. "2026-12-31T23:59:59Z"
            product_type: "GCOV" or "GUNW"
        """
        collection_id = (
            settings.NISAR_GUNW_COLLECTION_ID 
            if product_type.upper() == "GUNW" 
            else settings.NISAR_GCOV_COLLECTION_ID
        )

        min_lon, min_lat, max_lon, max_lat = bbox
        params = {
            "collection_concept_id": collection_id,
            "bounding_box": f"{min_lon:.4f},{min_lat:.4f},{max_lon:.4f},{max_lat:.4f}",
            "page_size": page_size,
            "sort_key": "-start_date" # newest first
        }

        if start_date or end_date:
            t_start = start_date or "2025-01-01T00:00:00Z"
            t_end = end_date or datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
            params["temporal"] = f"{t_start},{t_end}"

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(self.cmr_url, params=params)
                if response.status_code != 200:
                    raise CMRSearchError(f"NASA CMR returned HTTP {response.status_code}: {response.text}")
                data = response.json()
        except httpx.RequestError as e:
            raise CMRSearchError(f"Failed to communicate with NASA CMR API: {str(e)}")

        entries = data.get("feed", {}).get("entry", [])
        parsed_granules = []

        for e in entries:
            parsed = self._parse_cmr_granule(e, product_type)
            if parsed:
                parsed_granules.append(parsed)

        return parsed_granules

    def _parse_cmr_granule(self, entry: Dict[str, Any], default_product_type: str) -> Optional[Dict[str, Any]]:
        title = entry.get("title") or entry.get("producer_granule_id", "")
        if not title:
            return None

        # Extract URLs
        h5_url = None
        s3_url = None
        for link in entry.get("links", []):
            href = link.get("href", "")
            if href.endswith(".h5"):
                if href.startswith("s3://"):
                    s3_url = href
                elif href.startswith("http"):
                    h5_url = href

        # Granule naming parse:
        # e.g.: NISAR_L2_PR_GCOV_005_106_D_073_4005_DHDH_A_20251117T133057_...
        # parts: [0: NISAR, 1: L2, 2: PR, 3: GCOV, 4: cycle, 5: track, 6: dir, 7: frame, 8: mode, 9: pol, ...]
        track_number = None
        frame_number = None
        flight_direction = None
        polarization = None

        parts = title.split("_")
        if len(parts) >= 10 and parts[0] == "NISAR":
            try:
                track_number = int(parts[5])
                flight_direction = "Descending" if parts[6] == "D" else "Ascending"
                frame_number = int(parts[7])
                polarization = parts[9]
            except Exception:
                pass

        # Parse polygon footprints if available
        polygon_coords = []
        for poly_str in entry.get("polygons", []):
            if isinstance(poly_str, list) and len(poly_str) > 0:
                raw = poly_str[0].split()
                # pairs of lat, lon
                coords = []
                for i in range(0, len(raw) - 1, 2):
                    try:
                        coords.append([float(raw[i + 1]), float(raw[i])]) # [lon, lat]
                    except ValueError:
                        pass
                if coords:
                    polygon_coords.append(coords)

        return {
            "granule_id": title,
            "product_type": default_product_type.upper(),
            "time_start": entry.get("time_start"),
            "time_end": entry.get("time_end"),
            "track": track_number,
            "frame": frame_number,
            "flight_direction": flight_direction,
            "polarization": polarization,
            "download_url": h5_url,
            "s3_url": s3_url,
            "granule_size_mb": float(entry.get("granule_size", 0.0)),
            "footprint_polygon": polygon_coords[0] if polygon_coords else None
        }
