import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_list_and_get_cities():
    res = client.get("/api/v1/regions/uttarakhand/cities")
    assert res.status_code == 200
    cities = res.json()
    assert len(cities) >= 70

    # Verify Joshimath is present with correct coordinates and elevation
    joshimath = next((c for c in cities if c["id"] == "joshimath"), None)
    assert joshimath is not None
    assert joshimath["name"] == "Joshimath"
    assert joshimath["district"] == "Chamoli"
    assert joshimath["elevation_m"] == 1890
    assert len(joshimath["geometry"]["coordinates"][0]) >= 5

    # Verify Bhimtal is present
    bhimtal = next((c for c in cities if c["id"] == "bhimtal"), None)
    assert bhimtal is not None
    assert bhimtal["name"] == "Bhimtal"
    assert bhimtal["district"] == "Nainital"
    assert bhimtal["elevation_m"] == 1370

    # Verify Mukteshwar is present
    mukteshwar = next((c for c in cities if c["id"] == "mukteshwar"), None)
    assert mukteshwar is not None
    assert mukteshwar["name"] == "Mukteshwar"
    assert mukteshwar["district"] == "Nainital"
    assert mukteshwar["elevation_m"] == 2171

    # Test single city retrieval
    res_bhimtal = client.get("/api/v1/regions/uttarakhand/cities/bhimtal")
    assert res_bhimtal.status_code == 200
    assert res_bhimtal.json()["name"] == "Bhimtal"

    res_mukteshwar = client.get("/api/v1/regions/uttarakhand/cities/mukteshwar")
    assert res_mukteshwar.status_code == 200
    assert res_mukteshwar.json()["name"] == "Mukteshwar"

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

    # Test Mukteshwar (same district as Bhimtal, but must resolve to Mukteshwar)
    mukteshwar_payload = {
        "region": "Uttarakhand",
        "location": {
            "id": "mukteshwar",
            "name": "Mukteshwar",
            "district": "Nainital"
        },
        "district": "Nainital",
        "start_date": "2025-05-01",
        "end_date": "2025-06-01",
        "analysis_type": "surface_change"
    }
    res_muk = client.post("/api/v1/analyses", json=mukteshwar_payload)
    assert res_muk.status_code == 200
    data_muk = res_muk.json()
    assert data_muk["district"] == "Nainital"
    assert data_muk["location"]["name"] == "Mukteshwar"
    assert data_muk["location"]["id"] == "mukteshwar"
    assert data_muk["status"] == "completed"
