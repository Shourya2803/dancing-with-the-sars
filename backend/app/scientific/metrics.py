"""
Scientific Metrics and Statistical Computation Module.
Computes radar-derived physical change statistics, thresholds, and distributions
with explicit scientific documentation and honesty.
"""

from typing import Dict, Any, Optional
import numpy as np


# Scientifically established SAR backscatter threshold for L-band (in Decibels):
# Radiometric accuracy of NISAR is ~0.5 to 1.0 dB.
# A +/-3.0 dB change represents a doubling (2x) or halving (0.5x) of linear radar power,
# providing a statistically robust detection threshold beyond sensor noise and speckle fluctuations.
SIGNIFICANT_CHANGE_THRESHOLD_DB = 3.0


def compute_backscatter_metrics(
    delta_hh_db: np.ndarray,
    delta_hv_db: Optional[np.ndarray],
    pixel_area_m2: float,
    valid_mask: np.ndarray
) -> Dict[str, Any]:
    """
    Computes rigorous statistical metrics for radar backscatter change.
    
    Parameters:
        delta_hh_db: 2D array of backscatter difference (gamma0_t2 - gamma0_t1) in dB (Co-pol).
        delta_hv_db: Optional 2D array of backscatter difference in dB (Cross-pol).
        pixel_area_m2: Physical area of one grid pixel in square meters.
        valid_mask: Boolean mask of valid pixels (True = valid pixel within AOI).
    """
    valid_diff = delta_hh_db[valid_mask]
    
    # Remove any NaN or infinite values
    valid_diff = valid_diff[np.isfinite(valid_diff)]
    
    if len(valid_diff) == 0:
        return {
            "status": "no_valid_data",
            "message": "No valid non-masked pixels found within the selected AOI."
        }

    valid_pixel_count = int(len(valid_diff))
    valid_area_km2 = float(valid_pixel_count * pixel_area_m2 / 1_000_000.0)

    # Statistical Moments
    mean_val = float(np.mean(valid_diff))
    std_val = float(np.std(valid_diff))
    median_val = float(np.median(valid_diff))
    min_val = float(np.min(valid_diff))
    max_val = float(np.max(valid_diff))
    
    # Percentiles
    p10 = float(np.percentile(valid_diff, 10))
    p25 = float(np.percentile(valid_diff, 25))
    p75 = float(np.percentile(valid_diff, 75))
    p90 = float(np.percentile(valid_diff, 90))

    # Threshold Segmentation
    # Negative change: delta_gamma0 <= -3.0 dB
    neg_mask = valid_diff <= -SIGNIFICANT_CHANGE_THRESHOLD_DB
    neg_count = int(np.sum(neg_mask))
    neg_area_km2 = float(neg_count * pixel_area_m2 / 1_000_000.0)
    neg_percentage = float((neg_count / valid_pixel_count) * 100.0)

    # Positive change: delta_gamma0 >= +3.0 dB
    pos_mask = valid_diff >= SIGNIFICANT_CHANGE_THRESHOLD_DB
    pos_count = int(np.sum(pos_mask))
    pos_area_km2 = float(pos_count * pixel_area_m2 / 1_000_000.0)
    pos_percentage = float((pos_count / valid_pixel_count) * 100.0)

    # Stable: -3.0 dB < delta_gamma0 < +3.0 dB
    stable_count = valid_pixel_count - (neg_count + pos_count)
    stable_area_km2 = float(stable_count * pixel_area_m2 / 1_000_000.0)
    stable_percentage = float((stable_count / valid_pixel_count) * 100.0)

    total_changed_count = neg_count + pos_count
    total_changed_area_km2 = neg_area_km2 + pos_area_km2
    total_changed_percentage = neg_percentage + pos_percentage

    # Cross-pol metrics if available
    hv_metrics = None
    if delta_hv_db is not None:
        valid_hv = delta_hv_db[valid_mask]
        valid_hv = valid_hv[np.isfinite(valid_hv)]
        if len(valid_hv) > 0:
            hv_metrics = {
                "mean_hv_change_db": round(float(np.mean(valid_hv)), 3),
                "std_hv_change_db": round(float(np.std(valid_hv)), 3),
                "median_hv_change_db": round(float(np.median(valid_hv)), 3),
            }

    # Scientifically honest classification level
    if total_changed_percentage > 25.0:
        change_magnitude = "high_widespread_change"
    elif total_changed_percentage > 8.0:
        change_magnitude = "moderate_localized_change"
    elif total_changed_percentage > 2.0:
        change_magnitude = "low_isolated_change"
    else:
        change_magnitude = "minimal_nominal_fluctuation"

    return {
        "metric_name": "Radiometrically Terrain-Corrected Radar Backscatter Log-Ratio (Δγ⁰ in dB)",
        "unit": "decibels (dB)",
        "detection_threshold_db": SIGNIFICANT_CHANGE_THRESHOLD_DB,
        "valid_pixels": valid_pixel_count,
        "valid_area_km2": round(valid_area_km2, 4),
        "statistics": {
            "mean_db": round(mean_val, 3),
            "std_db": round(std_val, 3),
            "median_db": round(median_val, 3),
            "min_db": round(min_val, 3),
            "max_db": round(max_val, 3),
            "p10_db": round(p10, 3),
            "p25_db": round(p25, 3),
            "p75_db": round(p75, 3),
            "p90_db": round(p90, 3)
        },
        "change_distribution": {
            "total_significant_change": {
                "area_km2": round(total_changed_area_km2, 4),
                "percentage": round(total_changed_percentage, 2),
                "magnitude": change_magnitude
            },
            "negative_change": {
                "description": "Significant backscatter decrease (Δγ⁰ ≤ -3.0 dB), consistent with surface smoothing, water accumulation/inundation, wet snow, or canopy disturbance.",
                "area_km2": round(neg_area_km2, 4),
                "percentage": round(neg_percentage, 2)
            },
            "positive_change": {
                "description": "Significant backscatter increase (Δγ⁰ ≥ +3.0 dB), consistent with surface roughening, structural debris, soil moisture elevation, or refrozen snowpack.",
                "area_km2": round(pos_area_km2, 4),
                "percentage": round(pos_percentage, 2)
            },
            "stable": {
                "description": "Radar backscatter within nominal baseline fluctuation (|Δγ⁰| < 3.0 dB).",
                "area_km2": round(stable_area_km2, 4),
                "percentage": round(stable_percentage, 2)
            }
        },
        "cross_polarization_hv": hv_metrics,
        "scientific_limitations": [
            "SAR backscatter measures physical roughness, geometry, and dielectric permittivity (water/moisture).",
            "Radar backscatter changes cannot independently confirm disaster events (such as landslides or deforestation) without auxiliary ground truth or multi-source validation.",
            "Steep mountainous terrain may cause local radar shadowing and foreshortening despite Radiometric Terrain Correction (RTC)."
        ]
    }


def compute_insar_metrics(
    los_disp_m: np.ndarray,
    coherence: np.ndarray,
    pixel_area_m2: float,
    valid_mask: np.ndarray,
    wavelength_m: float = 0.24
) -> Dict[str, Any]:
    """
    Computes Line-Of-Sight (LOS) displacement and coherence metrics for GUNW products.
    """
    valid_disp = los_disp_m[valid_mask]
    valid_disp = valid_disp[np.isfinite(valid_disp)]

    valid_coh = coherence[valid_mask]
    valid_coh = valid_coh[np.isfinite(valid_coh)]

    if len(valid_disp) == 0:
        return {
            "status": "no_valid_data",
            "message": "No valid InSAR pixels found within the selected AOI."
        }

    # Convert LOS displacement to centimeters
    disp_cm = valid_disp * 100.0
    valid_area_km2 = float(len(valid_disp) * pixel_area_m2 / 1_000_000.0)

    # Significant deformation threshold: |LOS displacement| >= 2.0 cm
    sig_def_mask = np.abs(disp_cm) >= 2.0
    sig_def_count = int(np.sum(sig_def_mask))
    sig_def_km2 = float(sig_def_count * pixel_area_m2 / 1_000_000.0)
    sig_def_pct = float((sig_def_count / len(valid_disp)) * 100.0)

    return {
        "metric_name": "InSAR Line-of-Sight (LOS) Surface Displacement & Interferometric Coherence",
        "units": {"displacement": "centimeters (cm)", "coherence": "unitless [0-1]"},
        "radar_wavelength_m": wavelength_m,
        "valid_area_km2": round(valid_area_km2, 4),
        "displacement_statistics_cm": {
            "mean": round(float(np.mean(disp_cm)), 2),
            "std": round(float(np.std(disp_cm)), 2),
            "median": round(float(np.median(disp_cm)), 2),
            "min": round(float(np.min(disp_cm)), 2),
            "max": round(float(np.max(disp_cm)), 2)
        },
        "coherence_statistics": {
            "mean": round(float(np.mean(valid_coh)), 3),
            "median": round(float(np.median(valid_coh)), 3),
            "high_coherence_percentage": round(float(np.mean(valid_coh >= 0.6) * 100.0), 2)
        },
        "deformation_summary": {
            "significant_deformation_threshold_cm": 2.0,
            "significant_deformation_area_km2": round(sig_def_km2, 4),
            "significant_deformation_percentage": round(sig_def_pct, 2)
        },
        "scientific_limitations": [
            "LOS displacement represents relative range change along the satellite radar beam vector, not purely vertical or horizontal motion.",
            "Atmospheric delay variations in steep Himalayan relief can introduce phase ramps that require tropospheric correction.",
            "Phase unwrapping errors can occur across steep topography and decorrelated dense forests."
        ]
    }
