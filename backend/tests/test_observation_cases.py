"""
Unit and integration tests for Observation Date-Range Logic (Cases A, B, C, D).
Verifies that the backend never fabricates results and handles sparse/incompatible observations scientifically.
"""

import sys
import os
import pytest

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.services.observation_service import ObservationService


def test_case_c_zero_observations():
    """Case C: No observations found in search window."""
    obs_service = ObservationService()
    res = obs_service.evaluate_observations(
        observations=[],
        requested_start="2026-10-01",
        requested_end="2026-10-30"
    )
    assert res.case == "CASE_C"
    assert res.is_processable is False
    assert "No suitable NISAR observations were found" in res.message


def test_case_b_single_observation():
    """Case B: Only one suitable observation exists (cannot compare temporally)."""
    obs_service = ObservationService()
    single_obs = [{
        "granule_id": "NISAR_L2_PR_GCOV_005_106_D_073_4005_DHDH_A_20251117T133057",
        "product_type": "GCOV",
        "track": 106,
        "frame": 73,
        "flight_direction": "Descending",
        "time_start": "2025-11-17T13:30:57Z"
    }]
    res = obs_service.evaluate_observations(
        observations=single_obs,
        requested_start="2025-11-01",
        requested_end="2025-11-20"
    )
    assert res.case == "CASE_B"
    assert res.is_processable is False
    assert "Only one suitable NISAR observation was found" in res.message


def test_case_d_incompatible_geometries():
    """Case D: Multiple observations exist, but from different tracks or directions."""
    obs_service = ObservationService()
    mismatched_obs = [
        {
            "granule_id": "NISAR_L2_PR_GCOV_005_106_D_073_4005_DHDH_A_20251117T133057",
            "product_type": "GCOV",
            "track": 106,
            "frame": 73,
            "flight_direction": "Descending",
            "time_start": "2025-11-17T13:30:57Z"
        },
        {
            "granule_id": "NISAR_L2_PR_GCOV_005_156_A_016_4005_DHDH_A_20251121T001237",
            "product_type": "GCOV",
            "track": 156,
            "frame": 16,
            "flight_direction": "Ascending",
            "time_start": "2025-11-21T00:12:37Z"
        }
    ]
    res = obs_service.evaluate_observations(
        observations=mismatched_obs,
        requested_start="2025-11-01",
        requested_end="2025-11-30"
    )
    assert res.case == "CASE_D"
    assert res.is_processable is False
    assert "geometrically unsuitable" in res.message


def test_case_a_sufficient_observations():
    """Case A: Sufficient observations on matching repeat-pass geometry."""
    obs_service = ObservationService()
    matching_obs = [
        {
            "granule_id": "NISAR_L2_PR_GCOV_005_106_D_073_4005_DHDH_A_20251117T133057",
            "product_type": "GCOV",
            "track": 106,
            "frame": 73,
            "flight_direction": "Descending",
            "time_start": "2025-11-17T13:30:57Z"
        },
        {
            "granule_id": "NISAR_L2_PR_GCOV_006_106_D_073_2005_QPDH_A_20251129T133057",
            "product_type": "GCOV",
            "track": 106,
            "frame": 73,
            "flight_direction": "Descending",
            "time_start": "2025-11-29T13:30:57Z"
        }
    ]
    res = obs_service.evaluate_observations(
        observations=matching_obs,
        requested_start="2025-11-01",
        requested_end="2025-11-30"
    )
    assert res.case == "CASE_A"
    assert res.is_processable is True
    assert len(res.selected_pairs) == 1
