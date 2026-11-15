"""
Integration and End-to-End API Tests for Dancing with the SARs backend.
Tests the FastAPI application, validation, routing, Cases A/B/C/D, and Gemini fallback.
"""

import sys
import os
import pytest
from fastapi.testclient import TestClient

# Ensure backend root is on sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert data["service"] == "Dancing with the SARs - Scientific NISAR Backend"


def test_list_regions_and_districts():
    # Regions
    res_regions = client.get("/api/v1/regions")
    assert res_regions.status_code == 200
    regions = res_regions.json()
    assert len(regions) > 0
    assert regions[0]["id"] == "uttarakhand"

    # Districts
    res_dist = client.get("/api/v1/regions/uttarakhand/districts")
    assert res_dist.status_code == 200
    districts = res_dist.json()
    assert len(districts) == 13
    district_names = [d["name"] for d in districts]
    assert "Chamoli" in district_names
    assert "Rudraprayag" in district_names
    assert "Uttarkashi" in district_names


def test_create_analysis_invalid_dates():
    # Start date >= End date
    payload = {
        "region": "Uttarakhand",
        "district": "Chamoli",
        "start_date": "2025-12-01",
        "end_date": "2025-11-01"
    }
    response = client.post("/api/v1/analyses?async_exec=false", json=payload)
    assert response.status_code == 400
    assert "must be earlier than end_date" in response.json()["detail"]


def test_create_and_execute_analysis_e2e_chamoli():
    """
    Tests end-to-end execution of a surface change analysis over Chamoli.
    Verifies full pipeline:
    Request -> Discovery -> GCOV Processing -> GeoTIFF -> Vector GeoJSON -> Gemini Fallback -> Structured Result
    """
    payload = {
        "region": "Uttarakhand",
        "district": "Chamoli",
        "start_date": "2025-11-01",
        "end_date": "2025-12-05",
        "analysis_type": "surface_change",
        "comparison_strategy": "first_vs_last"
    }
    response = client.post("/api/v1/analyses?async_exec=false", json=payload)
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "completed"
    assert data["region"] == "Uttarakhand"
    assert data["district"] == "Chamoli"
    assert len(data["observations_used"]) == 2
    
    # Verify scientific results
    res = data["result"]
    assert res is not None
    assert res["processor"] == "NISAR_L2_GCOV_Processor"
    assert res["change_metric"] is not None
    assert res["changed_area_km2"] is not None
    assert res["changed_area_km2"] > 0
    assert "statistics" in res
    assert "change_distribution" in res

    # Verify map artifacts
    m = data["map"]
    assert m is not None
    assert m["geotiff_url"] is not None
    assert m["geojson_url"] is not None

    # Verify human explanation is populated (via Gemini or fallback template)
    assert data["explanation"] is not None
    assert "Chamoli" in data["explanation"]
    assert "radar" in data["explanation"].lower()


def test_get_analysis_by_id():
    # Create analysis first
    payload = {
        "region": "Uttarakhand",
        "district": "Chamoli",
        "start_date": "2025-11-01",
        "end_date": "2025-12-05"
    }
    create_res = client.post("/api/v1/analyses?async_exec=false", json=payload)
    assert create_res.status_code == 200
    analysis_id = create_res.json()["analysis_id"]

    # Poll status
    get_res = client.get(f"/api/v1/analyses/{analysis_id}")
    assert get_res.status_code == 200
    assert get_res.json()["analysis_id"] == analysis_id
    assert get_res.json()["status"] == "completed"

    # Direct result lookup
    res_direct = client.get(f"/result/{analysis_id}")
    assert res_direct.status_code == 200
    assert res_direct.json()["analysis_id"] == analysis_id
