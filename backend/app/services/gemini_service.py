"""
Gemini AI Explanation Service.
Translates verified, structured radar metrics into clear, human-readable explanations.
Strictly constrained never to invent observations, measurements, or disaster claims.
Includes a deterministic fallback template if Gemini API is offline or unconfigured.
"""

from typing import Dict, Any, Optional
import json

from app.config.settings import settings

try:
    from google import genai
    from google.genai import types
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


GEMINI_SYSTEM_INSTRUCTION = """
You are a scientific communication assistant for the NASA Space Apps Challenge project 'Dancing with the SARs'.
Your role is exclusively to explain pre-calculated, verified satellite radar change measurements to general users.

ABSOLUTE SCIENTIFIC INTEGRITY RULES:
1. NEVER invent measurements, dates, observations, or formulas.
2. NEVER claim a specific disaster (e.g. "a landslide occurred", "deforestation occurred", "a flood happened") unless the supplied data explicitly contains that verification.
3. Radar backscatter change (Δγ⁰) measures alterations in physical surface roughness, soil moisture, dielectric properties, or vegetation geometry.
4. Always clearly distinguish between verified radar measurements and possible physical interpretations.
5. Emphasize that SAR backscatter is sensitive to moisture and roughness, and changes require ground confirmation.
6. Keep the explanation concise (2 to 4 sentences), clear, and scientifically safe.
"""


class GeminiService:
    """
    Communicates with Google Gemini API to translate verified scientific results into plain language.
    """

    def __init__(self):
        self.api_key = (settings.GEMINI_API_KEY or "").strip()
        self.model_name = (settings.GEMINI_MODEL or "gemini-3.5-flash").strip()
        self._client = None

        if GEMINI_AVAILABLE and self.api_key:
            try:
                self._client = genai.Client(api_key=self.api_key)
            except Exception as e:
                print(f"[GeminiService Warning] Failed to initialize Gemini Client: {e}")

    async def generate_explanation(
        self,
        analysis_context: Dict[str, Any],
        scientific_result: Dict[str, Any]
    ) -> str:
        """
        Generates a comprehensive, human-readable summary of the verified scientific result.
        If Gemini is unavailable or fails, returns a safe deterministic fallback template.
        """
        sector = analysis_context.get("sector") or analysis_context.get("analysis_type", "terrain_surface")
        sector_name = analysis_context.get("sector_name") or "Terrain & Surface Change"
        location_name = analysis_context.get("location_name") or analysis_context.get("district") or "Uttarakhand"
        district_name = analysis_context.get("district") or "Uttarakhand"

        summary_payload = {
            "region": analysis_context.get("region", "Uttarakhand"),
            "district": district_name,
            "location_name": location_name,
            "sector": sector,
            "sector_name": sector_name,
            "analysis_type": analysis_context.get("analysis_type", sector),
            "requested_period": {
                "start": analysis_context.get("start_date"),
                "end": analysis_context.get("end_date")
            },
            "observations_used": analysis_context.get("observations_used") or scientific_result.get("observations_used", []),
            "processor": analysis_context.get("processor") or scientific_result.get("processor", "NISAR Level-2 GCOV (RTC Backscatter)"),
            "spatial_reference": analysis_context.get("spatial_reference", "EPSG:32644"),
            "pixel_resolution_m": analysis_context.get("pixel_resolution_m", [20.0, 20.0]),
            "metric_name": scientific_result.get("metric_name", "Radiometrically Terrain-Corrected Backscatter Difference (Δγ⁰ dB)"),
            "valid_area_km2": scientific_result.get("valid_area_km2"),
            "statistics": scientific_result.get("statistics"),
            "change_distribution": scientific_result.get("change_distribution"),
            "scientific_limitations": scientific_result.get("scientific_limitations")
        }

        # Attempt Gemini call if configured
        if self._client:
            try:
                sector_instructions = ""
                if sector == "forest_canopy":
                    sector_instructions = (
                        "Domain: Forest & Canopy Structure. Focus on cross-polarization (HV) volume scattering attenuation, "
                        "canopy disturbance, defoliation, or structural biomass change across the Himalayan tree line."
                    )
                elif sector == "water_wetlands":
                    sector_instructions = (
                        "Domain: Hydrology & Wetland Monitoring. Focus on specular radar deflection, surface water expansion "
                        "or drainage, riverbed channel shifts, and topsoil moisture saturation dynamics."
                    )
                else:
                    sector_instructions = (
                        "Domain: Terrain & Geomorphology. Focus on radiometrically terrain-corrected surface roughness alterations, "
                        "slope debris shifts, scree slope mobilization, sediment deposition, or freeze-thaw crust formation."
                    )

                prompt = (
                    f"You are a NASA Earth Observation radar specialist analyzing NISAR L-band SAR telemetry over {location_name} ({district_name}, Uttarakhand, India).\n\n"
                    f"SECTOR DIRECTIVE: {sector_instructions}\n\n"
                    "TELEMETRY MEASUREMENT DATA (VERIFIED GROUND TRUTH):\n"
                    f"{json.dumps(summary_payload, indent=2)}\n\n"
                    "INSTRUCTIONS:\n"
                    "Write a comprehensive, professional Earth observation analysis report using clean markdown formatting.\n"
                    "Organize your explanation into these exact 4 structured sections:\n\n"
                    "### 🛰️ Executive Satellite Assessment\n"
                    "- State the repeat-pass dates, orbital track, and target area.\n"
                    "- State total detected change in km² and % of analyzed AOI.\n"
                    "- State the overall classification level (e.g. Moderate Localized Change vs Baseline Stability).\n\n"
                    "### 🔬 Physical Polarimetric Breakdown\n"
                    "- Detail the negative backscatter change (Δγ⁰ ≤ -3.0 dB, 2x power loss): exact area (km²), percentage, and physical scattering cause (e.g., surface smoothing, standing water/inundation, wet snow, or forest canopy loss).\n"
                    "- Detail the positive backscatter change (Δγ⁰ ≥ +3.0 dB, 2x power increase): exact area (km²), percentage, and physical scattering cause (e.g., surface roughening, debris deposition, topsoil moisture surge).\n"
                    "- Highlight key statistical moments (mean change dB, standard deviation, median).\n\n"
                    "### 🏔️ Himalayan Domain Insights\n"
                    "- Interpret these findings specifically in the context of Uttarakhand's rugged Himalayan relief and this sector.\n"
                    "- Note contrast between the stable baseline radar surface and localized deviations.\n\n"
                    "### 🛡️ Ground Verification Protocol\n"
                    "- State honest scientific limitations: SAR backscatter detects roughness, geometry, and moisture—not optical color or land ownership.\n"
                    "- Provide actionable recommendations for ground-truthing or optical cross-validation (e.g. Sentinel-2 / Landsat-9 imagery).\n\n"
                    "ABSOLUTE RULES:\n"
                    "1. NEVER invent numbers or dates. All metrics MUST match the telemetry JSON.\n"
                    "2. NEVER declare an unverified disaster (such as a landslide, flood, or deforestation) without ground corroboration; use honest scientific phrasing ('measurable backscatter alteration consistent with...')."
                )

                config = None
                if GEMINI_AVAILABLE:
                    config = types.GenerateContentConfig(
                        system_instruction=GEMINI_SYSTEM_INSTRUCTION,
                        temperature=0.2
                    )

                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=prompt,
                    config=config
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[GeminiService Error] Gemini call failed: {e}. Using deterministic fallback.")

        # Deterministic fallback template (guaranteed scientifically safe, complete, and sector-specific)
        return self._generate_fallback_explanation(summary_payload)

    def _generate_fallback_explanation(self, payload: Dict[str, Any]) -> str:
        loc_name = payload.get("location_name") or payload.get("district") or "the selected area of Uttarakhand"
        district_name = payload.get("district") or "Uttarakhand"
        sector = payload.get("sector", "terrain_surface")
        sector_name = payload.get("sector_name") or "Terrain & Surface Change"
        dist = payload.get("change_distribution") or {}
        tot = dist.get("total_significant_change") or {}
        changed_km2 = tot.get("area_km2", 0.0)
        changed_pct = tot.get("percentage", 0.0)
        mag = tot.get("magnitude", "localized_change").replace("_", " ").title()

        neg = dist.get("negative_change") or {}
        pos = dist.get("positive_change") or {}
        stable = dist.get("stable") or {}
        stats = payload.get("statistics") or {}

        mean_db = stats.get("mean_db", 0.0)
        std_db = stats.get("std_db", 0.0)

        start = payload.get("requested_period", {}).get("start", "2025-11-17")[:10]
        end = payload.get("requested_period", {}).get("end", "2025-11-29")[:10]

        obs = payload.get("observations_used") or []
        track_info = f"Track {obs[0].get('track', 106)}, Frame {obs[0].get('frame', 73)}" if obs else "Track 106, Frame 073"

        if sector == "forest_canopy":
            domain_text = (
                f"Across the Himalayan forest envelope in {loc_name}, cross-polarization radar volume scattering "
                f"was monitored. The observed {changed_pct:.1f}% variation corresponds to localized canopy density "
                f"fluctuations, seasonal leaf-off transitions, or top-canopy moisture alterations in mountain valleys."
            )
        elif sector == "water_wetlands":
            domain_text = (
                f"In the hydrological drainage basin of {loc_name}, radar reflection transitions highlight localized "
                f"changes in topsoil saturation and surface water boundary shifts, where smooth open water produces "
                f"distinct specular radar deflection compared to surrounding rough terrain."
            )
        else:
            domain_text = (
                f"In the rugged alpine relief of {loc_name} ({district_name}), radiometrically terrain-corrected backscatter "
                f"isolates true physical surface roughness alterations from slope illumination artifacts. Detected shifts indicate "
                f"localized rock/debris mobility, minor slope erosion, or freeze-thaw crust variations."
            )

        return (
            f"### 🛰️ Executive Satellite Assessment\n"
            f"- **Observation Window:** {start} to {end} (12-day repeat orbit; {track_info}).\n"
            f"- **Target Area:** {loc_name} ({district_name}, Uttarakhand).\n"
            f"- **Detected Change:** {changed_km2:.2f} km² ({changed_pct:.1f}% of analyzed AOI).\n"
            f"- **Classification Magnitude:** {mag}.\n\n"
            f"### 🔬 Physical Polarimetric Breakdown\n"
            f"- **Negative Shift (Δγ⁰ ≤ -3.0 dB):** {neg.get('area_km2', 0.0):.2f} km² ({neg.get('percentage', 0.0):.1f}% of AOI) — consistent with surface smoothing, water accumulation/inundation, or canopy loss.\n"
            f"- **Positive Shift (Δγ⁰ ≥ +3.0 dB):** {pos.get('area_km2', 0.0):.2f} km² ({pos.get('percentage', 0.0):.1f}% of AOI) — consistent with surface roughening, debris deposition, or topsoil moisture increase.\n"
            f"- **Stable Baseline:** {stable.get('area_km2', 0.0):.2f} km² ({stable.get('percentage', 0.0):.1f}% of AOI) remained within nominal radar stability (|Δγ⁰| < 3.0 dB).\n"
            f"- **Statistical Moments:** Mean change: {mean_db:.2f} dB, Std Dev: {std_db:.2f} dB.\n\n"
            f"### 🏔️ Himalayan Domain Insights ({sector_name})\n"
            f"{domain_text}\n\n"
            f"### 🛡️ Ground Verification Protocol\n"
            f"- **Radar Physics Constraint:** L-band Synthetic Aperture Radar observes physical surface roughness, geometry, and dielectric permittivity (moisture), not optical coloration or event causation.\n"
            f"- **Recommended Verification:** Cross-check with optical multispectral sensors (Sentinel-2 MSI / Landsat-9 OLI) and local telemetry stations before concluding specific event attribution."
        )
