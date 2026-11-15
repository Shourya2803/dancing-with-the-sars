"""
Unit and integration tests for the scientific processing pipeline.
Verifies GCOV and GUNW processors using deterministic, CF-compliant synthetic NISAR files.
"""

import os
import tempfile
import pytest
import numpy as np
import rasterio

from app.scientific.gcov_processor import GCOVProcessor
from app.scientific.gunw_processor import GUNWProcessor
from app.scientific.validation import validate_aoi_geometry, validate_observation_pair_suitability, ValidationError


@pytest.fixture
def chamoli_aoi():
    # Polygon around Chamoli area (WGS84 degrees)
    # Coordinates inside the test synthetic bounding box:
    # Easting 720000 - 740000, Northing 3360000 - 3380000 in UTM 44N corresponds to ~79.3°E, 30.4°N
    return {
        "type": "Polygon",
        "coordinates": [[
            [79.25, 30.35],
            [79.45, 30.35],
            [79.45, 30.55],
            [79.25, 30.55],
            [79.25, 30.35]
        ]]
    }


def test_aoi_validation_valid(chamoli_aoi):
    geom, area_km2 = validate_aoi_geometry(chamoli_aoi)
    assert geom.is_valid
    assert area_km2 > 0.0
    assert area_km2 < 25000.0


def test_aoi_validation_invalid():
    with pytest.raises(ValidationError):
        validate_aoi_geometry({"type": "Point", "coordinates": [79.0, 30.0]})


def test_observation_pair_suitability():
    obs1 = {"product_type": "GCOV", "track": 106, "direction": "Descending", "frame": 73, "time_start": "2025-11-17T13:30:57Z"}
    obs2 = {"product_type": "GCOV", "track": 106, "direction": "Descending", "frame": 73, "time_start": "2025-11-29T13:30:57Z"}
    
    # Valid pair
    valid, msg = validate_observation_pair_suitability(obs1, obs2)
    assert valid is True
    assert msg is None

    # Mismatched tracks
    obs_diff_track = dict(obs2, track=156)
    valid, msg = validate_observation_pair_suitability(obs1, obs_diff_track)
    assert valid is False
    assert "Incompatible orbital tracks" in msg

    # Mismatched flight directions
    obs_diff_dir = dict(obs2, direction="Ascending")
    valid, msg = validate_observation_pair_suitability(obs1, obs_diff_dir)
    assert valid is False
    assert "Incompatible flight directions" in msg


def test_gcov_processor():
    test_dir = os.path.join(os.path.dirname(__file__), "data")
    p1 = os.path.join(test_dir, "NISAR_L2_PR_GCOV_005_106_D_073_4005_DHDH_A_20251117T133057.h5")
    p2 = os.path.join(test_dir, "NISAR_L2_PR_GCOV_006_106_D_073_2005_QPDH_A_20251129T133057.h5")

    assert os.path.exists(p1), f"Sample file missing: {p1}"
    assert os.path.exists(p2), f"Sample file missing: {p2}"

    with tempfile.TemporaryDirectory() as tmp_out:
        processor = GCOVProcessor()
        result = processor.process_temporal_pair(
            baseline_h5_path=p1,
            secondary_h5_path=p2,
            aoi_geojson=None, # Test full extent first
            output_dir=tmp_out
        )

        assert result["processor"] == "NISAR_L2_GCOV_Processor"
        metrics = result["metrics"]
        assert "valid_pixels" in metrics
        assert metrics["valid_pixels"] > 0
        assert "change_distribution" in metrics
        
        # Check exported GeoTIFF
        tif_path = result["artifacts"]["geotiff_path"]
        assert os.path.exists(tif_path)
        with rasterio.open(tif_path) as src:
            assert src.count == 1
            assert src.crs.to_epsg() == 32644

        # Check exported vector GeoJSON
        geojson_path = result["artifacts"]["geojson_path"]
        assert os.path.exists(geojson_path)


def test_gunw_processor():
    test_dir = os.path.join(os.path.dirname(__file__), "data")
    pg = os.path.join(test_dir, "NISAR_L2_PR_GUNW_005_106_D_073_006_2000_SH_20251117T133057_20251129T133057.h5")
    assert os.path.exists(pg), f"Sample file missing: {pg}"

    with tempfile.TemporaryDirectory() as tmp_out:
        processor = GUNWProcessor()
        result = processor.process_granule(gunw_h5_path=pg, output_dir=tmp_out)

        assert result["processor"] == "NISAR_L2_GUNW_Processor"
        metrics = result["metrics"]
        assert "displacement_statistics_cm" in metrics
        assert "coherence_statistics" in metrics
        assert os.path.exists(result["artifacts"]["geotiff_path"])
