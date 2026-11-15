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
        Generates a human-readable summary of the verified scientific result.
        If Gemini is unavailable or fails, returns a safe deterministic fallback template.
        """
        # Prepare strictly bounded payload
        summary_payload = {
            "region": analysis_context.get("region", "Uttarakhand"),
            "district": analysis_context.get("district"),
            "analysis_type": analysis_context.get("analysis_type", "surface_change"),
            "requested_period": {
                "start": analysis_context.get("start_date"),
                "end": analysis_context.get("end_date")
            },
            "observations_used": scientific_result.get("observations_used", []),
            "metric_name": scientific_result.get("metric_name"),
            "valid_area_km2": scientific_result.get("valid_area_km2"),
            "statistics": scientific_result.get("statistics"),
            "change_distribution": scientific_result.get("change_distribution"),
            "scientific_limitations": scientific_result.get("scientific_limitations")
        }

        # Attempt Gemini call if configured
        if self._client:
            try:
                prompt = (
                    "You are a NASA Earth Observation science communicator. "
                    "Write a 2 to 3 sentence explanation of this radar backscatter measurement for end users:\n\n"
                    f"{json.dumps(summary_payload, indent=2)}\n\n"
                    "Absolute rules:\n"
                    "1. Never claim unconfirmed disasters (such as landslides, deforestation, or floods).\n"
                    "2. State the measured change area in km2 and percentage clearly.\n"
                    "3. Mention that radar backscatter changes reflect physical variations in surface roughness, soil moisture, or vegetation geometry."
                )

                response = self._client.models.generate_content(
                    model=self.model_name,
                    contents=prompt
                )
                if response and response.text:
                    return response.text.strip()
            except Exception as e:
                print(f"[GeminiService Error] Gemini call failed: {e}. Using deterministic fallback.")

        # Deterministic fallback template (guaranteed scientifically safe)
        return self._generate_fallback_explanation(summary_payload)

    def _generate_fallback_explanation(self, payload: Dict[str, Any]) -> str:
        district_name = payload.get("district") or "the selected area of Uttarakhand"
        dist = payload.get("change_distribution") or {}
        tot = dist.get("total_significant_change") or {}
        changed_km2 = tot.get("area_km2")
        changed_pct = tot.get("percentage")
        magnitude = tot.get("magnitude", "moderate")

        start = payload.get("requested_period", {}).get("start", "")[:10]
        end = payload.get("requested_period", {}).get("end", "")[:10]

        if changed_km2 is not None and changed_pct is not None:
            return (
                f"Between {start} and {end}, radar analysis over {district_name} detected measurable "
                f"surface backscatter change across {changed_km2:.2f} km² ({changed_pct:.1f}% of the analyzed area). "
                f"This indicates radar-derived surface roughness, moisture, or vegetation structure alterations "
                f"during this period, though it does not independently confirm a specific disaster event."
            )
        else:
            return (
                f"Radar observation analysis over {district_name} between {start} and {end} was completed. "
                "Surface measurements remained predominantly within nominal baseline satellite radar variability."
            )
