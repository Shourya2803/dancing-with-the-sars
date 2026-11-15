"""
Scientific and geometric validation module for NISAR observations and AOIs.
Ensures SAR orbital geometry and spatial constraints are rigorously satisfied
before any processing is attempted.
"""

from typing import Dict, Any, List, Tuple, Optional
from shapely.geometry import shape, Polygon, MultiPolygon
from shapely.ops import transform
import math


# Geographic bounds of Uttarakhand (approx bounding envelope with safety buffer)
UTTARAKHAND_BBOX = {
    "min_lon": 77.4,
    "min_lat": 28.5,
    "max_lon": 81.2,
    "max_lat": 31.6
}

# Maximum allowed AOI area for Hackathon MVP on-demand processing (in sq km)
MAX_AOI_AREA_SQ_KM = 25000.0
MIN_AOI_AREA_SQ_KM = 0.01


class ValidationError(Exception):
    """Raised when scientific or geometric validation fails."""
    pass


def validate_aoi_geometry(geojson_geom: Dict[str, Any]) -> Tuple[Polygon, float]:
    """
    Validates the user-supplied AOI GeoJSON geometry:
    - Must be a valid Polygon or MultiPolygon
    - Must not be self-intersecting
    - Coordinates must be in WGS84 (lon, lat)
    - Computes area in square kilometers
    - Checks bounds against maximum permitted on-demand processing footprint
    """
    if not geojson_geom or not isinstance(geojson_geom, dict):
        raise ValidationError("AOI geometry must be a valid GeoJSON object.")

    geom_type = geojson_geom.get("type")
    if geom_type not in ["Polygon", "MultiPolygon"]:
        raise ValidationError(f"Unsupported geometry type: {geom_type}. Must be Polygon or MultiPolygon.")

    try:
        geom = shape(geojson_geom)
    except Exception as e:
        raise ValidationError(f"Invalid GeoJSON coordinates: {str(e)}")

    if not geom.is_valid:
        # Attempt simple buffer(0) fix if self-intersection is minor
        geom = geom.buffer(0)
        if not geom.is_valid:
            raise ValidationError("AOI geometry is invalid or self-intersecting.")

    min_x, min_y, max_x, max_y = geom.bounds

    # Check longitudes and latitudes are in reasonable ranges
    if not (-180.0 <= min_x <= 180.0 and -180.0 <= max_x <= 180.0 and
            -90.0 <= min_y <= 90.0 and -90.0 <= max_y <= 90.0):
        raise ValidationError("AOI coordinates must be in WGS84 (degrees longitude [-180, 180], latitude [-90, 90]).")

    # Approximate area in sq km using spherical projection at mean latitude
    mean_lat_rad = math.radians((min_y + max_y) / 2.0)
    # 1 deg lat ~ 111.132 km, 1 deg lon ~ 111.320 * cos(lat) km
    km_per_deg_lat = 111.132
    km_per_deg_lon = 111.320 * math.cos(mean_lat_rad)
    
    # Scale degree area to sq km
    area_sq_deg = geom.area
    area_sq_km = area_sq_deg * km_per_deg_lat * km_per_deg_lon

    if area_sq_km < MIN_AOI_AREA_SQ_KM:
        raise ValidationError(f"AOI area is too small ({area_sq_km:.4f} km²). Minimum allowed is {MIN_AOI_AREA_SQ_KM} km².")

    if area_sq_km > MAX_AOI_AREA_SQ_KM:
        raise ValidationError(
            f"AOI area ({area_sq_km:.1f} km²) exceeds maximum on-demand processing limit of {MAX_AOI_AREA_SQ_KM} km²."
        )

    return geom, area_sq_km


def validate_observation_pair_suitability(
    obs_baseline: Dict[str, Any],
    obs_secondary: Dict[str, Any],
    analysis_type: str = "surface_change"
) -> Tuple[bool, Optional[str]]:
    """
    Scientifically verifies that two NISAR observations can legitimately be compared:
    1. Both must share the same radar track / path. Comparing different tracks introduces
       geometric mismatch and steep incidence-angle differences invalidating backscatter subtraction.
    2. Both must share the same flight direction (Ascending vs Descending).
    3. Product types must match (e.g. GCOV with GCOV).
    4. Frames must overlap or match.
    5. Observation dates must be distinct in time (temporal baseline > 0).
    """
    # 1. Product type
    pt1 = obs_baseline.get("product_type") or obs_baseline.get("processing_level")
    pt2 = obs_secondary.get("product_type") or obs_secondary.get("processing_level")
    if pt1 != pt2:
        return False, f"Incompatible product types: {pt1} vs {pt2}. Both observations must be identical product levels."

    # 2. Track number
    t1 = obs_baseline.get("track") or obs_baseline.get("track_number")
    t2 = obs_secondary.get("track") or obs_secondary.get("track_number")
    if t1 is not None and t2 is not None and t1 != t2:
        return False, f"Incompatible orbital tracks: Track {t1} vs Track {t2}. SAR change analysis requires matching repeat-pass tracks."

    # 3. Flight direction
    d1 = obs_baseline.get("flight_direction") or obs_baseline.get("direction")
    d2 = obs_secondary.get("flight_direction") or obs_secondary.get("direction")
    if d1 and d2 and d1.lower() != d2.lower():
        return False, f"Incompatible flight directions: {d1} vs {d2}. Cannot compare Ascending and Descending passes."

    # 4. Frame number
    f1 = obs_baseline.get("frame") or obs_baseline.get("frame_number")
    f2 = obs_secondary.get("frame") or obs_secondary.get("frame_number")
    if f1 is not None and f2 is not None and abs(f1 - f2) > 1:
        return False, f"Incompatible frames: Frame {f1} vs Frame {f2}. Frames do not spatially align."

    # 5. Temporal baseline
    time1 = obs_baseline.get("time_start") or obs_baseline.get("acquisition_time")
    time2 = obs_secondary.get("time_start") or obs_secondary.get("acquisition_time")
    if time1 and time2 and time1 == time2:
        return False, "Temporal baseline is zero. Cannot perform temporal change analysis on identical timestamps."

    return True, None
