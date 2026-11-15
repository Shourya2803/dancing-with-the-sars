"""
Uttarakhand Administrative Boundaries and District Metadata.
Contains bounding boxes, centroids, and polygon geometries for all 13 districts of Uttarakhand.
"""

from typing import Dict, Any, List

UTTARAKHAND_DISTRICTS: Dict[str, Dict[str, Any]] = {
    "chamoli": {
        "name": "Chamoli",
        "division": "Garhwal",
        "headquarters": "Gopeshwar",
        "area_km2": 8030.0,
        "centroid": {"lat": 30.41, "lon": 79.43},
        "bbox": [79.05, 30.01, 80.08, 31.05],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.05, 30.20], [79.40, 30.01], [79.95, 30.25],
                [80.08, 30.85], [79.65, 31.05], [79.15, 30.70],
                [79.05, 30.20]
            ]]
        }
    },
    "rudraprayag": {
        "name": "Rudraprayag",
        "division": "Garhwal",
        "headquarters": "Rudraprayag",
        "area_km2": 1984.0,
        "centroid": {"lat": 30.45, "lon": 79.05},
        "bbox": [78.80, 30.20, 79.35, 30.75],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [78.85, 30.25], [79.25, 30.20], [79.35, 30.55],
                [79.10, 30.75], [78.80, 30.50], [78.85, 30.25]
            ]]
        }
    },
    "uttarkashi": {
        "name": "Uttarkashi",
        "division": "Garhwal",
        "headquarters": "Uttarkashi",
        "area_km2": 8016.0,
        "centroid": {"lat": 30.95, "lon": 78.60},
        "bbox": [77.85, 30.45, 79.40, 31.45],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.85, 30.75], [78.40, 30.45], [79.00, 30.70],
                [79.40, 31.25], [78.75, 31.45], [78.10, 31.20],
                [77.85, 30.75]
            ]]
        }
    },
    "tehri_garhwal": {
        "name": "Tehri Garhwal",
        "division": "Garhwal",
        "headquarters": "New Tehri",
        "area_km2": 3642.0,
        "centroid": {"lat": 30.38, "lon": 78.48},
        "bbox": [78.15, 30.05, 78.95, 30.85],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [78.15, 30.35], [78.65, 30.05], [78.95, 30.40],
                [78.80, 30.85], [78.30, 30.65], [78.15, 30.35]
            ]]
        }
    },
    "dehradun": {
        "name": "Dehradun",
        "division": "Garhwal",
        "headquarters": "Dehradun",
        "area_km2": 3088.0,
        "centroid": {"lat": 30.32, "lon": 78.03},
        "bbox": [77.55, 29.95, 78.35, 30.95],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.60, 30.15], [78.15, 29.95], [78.35, 30.45],
                [78.05, 30.95], [77.55, 30.70], [77.60, 30.15]
            ]]
        }
    },
    "pauri_garhwal": {
        "name": "Pauri Garhwal",
        "division": "Garhwal",
        "headquarters": "Pauri",
        "area_km2": 5329.0,
        "centroid": {"lat": 29.95, "lon": 78.85},
        "bbox": [78.20, 29.40, 79.25, 30.30],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [78.25, 29.75], [78.75, 29.40], [79.25, 29.80],
                [79.10, 30.30], [78.45, 30.15], [78.25, 29.75]
            ]]
        }
    },
    "pithoragarh": {
        "name": "Pithoragarh",
        "division": "Kumaon",
        "headquarters": "Pithoragarh",
        "area_km2": 7090.0,
        "centroid": {"lat": 29.90, "lon": 80.30},
        "bbox": [79.80, 29.35, 81.05, 30.75],
        "default_nisar_track": 156,
        "default_nisar_frame": 16,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.85, 29.50], [80.35, 29.35], [80.85, 29.80],
                [81.05, 30.45], [80.45, 30.75], [79.80, 30.15],
                [79.85, 29.50]
            ]]
        }
    },
    "bageshwar": {
        "name": "Bageshwar",
        "division": "Kumaon",
        "headquarters": "Bageshwar",
        "area_km2": 2246.0,
        "centroid": {"lat": 29.85, "lon": 79.80},
        "bbox": [79.45, 29.60, 80.15, 30.25],
        "default_nisar_track": 106,
        "default_nisar_frame": 73,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.50, 29.70], [79.95, 29.60], [80.15, 29.95],
                [79.85, 30.25], [79.45, 30.00], [79.50, 29.70]
            ]]
        }
    },
    "almora": {
        "name": "Almora",
        "division": "Kumaon",
        "headquarters": "Almora",
        "area_km2": 3144.0,
        "centroid": {"lat": 29.60, "lon": 79.65},
        "bbox": [79.15, 29.35, 80.00, 29.95],
        "default_nisar_track": 106,
        "default_nisar_frame": 74,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.20, 29.55], [79.65, 29.35], [80.00, 29.70],
                [79.75, 29.95], [79.15, 29.80], [79.20, 29.55]
            ]]
        }
    },
    "champawat": {
        "name": "Champawat",
        "division": "Kumaon",
        "headquarters": "Champawat",
        "area_km2": 1766.0,
        "centroid": {"lat": 29.33, "lon": 80.10},
        "bbox": [79.80, 29.05, 80.35, 29.60],
        "default_nisar_track": 156,
        "default_nisar_frame": 16,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.85, 29.20], [80.20, 29.05], [80.35, 29.40],
                [80.05, 29.60], [79.80, 29.40], [79.85, 29.20]
            ]]
        }
    },
    "nainital": {
        "name": "Nainital",
        "division": "Kumaon",
        "headquarters": "Nainital",
        "area_km2": 4251.0,
        "centroid": {"lat": 29.38, "lon": 79.45},
        "bbox": [78.95, 29.00, 79.85, 29.65],
        "default_nisar_track": 106,
        "default_nisar_frame": 74,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [79.00, 29.20], [79.45, 29.00], [79.85, 29.35],
                [79.65, 29.65], [78.95, 29.45], [79.00, 29.20]
            ]]
        }
    },
    "udham_singh_nagar": {
        "name": "Udham Singh Nagar",
        "division": "Kumaon",
        "headquarters": "Rudrapur",
        "area_km2": 2542.0,
        "centroid": {"lat": 28.98, "lon": 79.52},
        "bbox": [78.75, 28.75, 80.10, 29.30],
        "default_nisar_track": 106,
        "default_nisar_frame": 74,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [78.80, 29.05], [79.45, 28.75], [80.10, 28.95],
                [79.85, 29.30], [79.15, 29.25], [78.80, 29.05]
            ]]
        }
    },
    "haridwar": {
        "name": "Haridwar",
        "division": "Garhwal",
        "headquarters": "Haridwar",
        "area_km2": 2360.0,
        "centroid": {"lat": 29.95, "lon": 78.16},
        "bbox": [77.85, 29.55, 78.40, 30.15],
        "default_nisar_track": 106,
        "default_nisar_frame": 74,
        "geometry": {
            "type": "Polygon",
            "coordinates": [[
                [77.90, 29.75], [78.25, 29.55], [78.40, 29.95],
                [78.15, 30.15], [77.85, 29.95], [77.90, 29.75]
            ]]
        }
    }
}


def get_district_info(district_key: str) -> Optional[Dict[str, Any]]:
    key = district_key.strip().lower().replace(" ", "_")
    return UTTARAKHAND_DISTRICTS.get(key)


def get_all_districts() -> List[Dict[str, Any]]:
    return [
        {
            "id": k,
            "name": v["name"],
            "division": v["division"],
            "headquarters": v["headquarters"],
            "area_km2": v["area_km2"],
            "centroid": v["centroid"],
            "bbox": v["bbox"]
        }
        for k, v in UTTARAKHAND_DISTRICTS.items()
    ]
