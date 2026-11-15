import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_and_get_cities():
    res = client.get("/api/v1/regions/uttarakhand/cities")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) >= 30

    # Verify Joshimath is present with correct coordinates and elevation
    joshimath = next((c for c in cities if c["id"] == "joshimath"), None)
    assert joshimath is not None
    assert joshimath["name"] == "Joshimath"
    assert joshimath["district"] == "Chamoli"
    assert joshimath["elevation_m"] == 1890
    assert len(joshimath["geometry"]["coordinates"][0]) >= 5

    # Test single city retrieval
    res_single = client.get("/api/v1/regions/uttarakhand/cities/joshimath")
    assert res_single.status_code == 200
    assert res_single.json()["name"] == "Joshimath"

def test_create_analysis_with_city_location():
    payload = {
        "region": "Uttarakhand",
        "location": {
            "id": "joshimath",
            "name": "Joshimath"
        },
        "start_date": "2025-05-01",
        "end_date": "2025-06-01",
        "analysis_type": "surface_change"
    }
    res = client.post("/api/v1/analyses", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["district"] == "Chamoli"
    assert data["location"]["name"] == "Joshimath"
    assert data["status"] == "completed"
    assert "result" in data
