"""
Integration test for custom polygon Area of Interest (AOI) analysis.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)


def test_custom_polygon_aoi():
    # Polygon in Chamoli region
    custom_geom = {
        "type": "Polygon",
        "coordinates": [[
            [79.35, 30.38],
            [79.48, 30.38],
            [79.48, 30.50],
            [79.35, 30.50],
            [79.35, 30.38]
        ]]
    }

    payload = {
        "region": "Uttarakhand",
        "aoi_geometry": custom_geom,
        "start_date": "2025-11-01",
        "end_date": "2025-12-05",
        "analysis_type": "surface_change"
    }

    response = client.post("/api/v1/analyses?async_exec=false", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "completed"
    assert data["result"] is not None
    assert data["result"]["changed_area_km2"] is not None
    assert data["map"]["geotiff_url"] is not None
    assert data["map"]["geojson_url"] is not None
