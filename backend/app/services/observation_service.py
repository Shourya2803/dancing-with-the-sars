"""
Observation Evaluation and Pairing Service.
Handles observation discovery, grouping by orbital geometry, suitability checks,
and date range decision logic (Cases A, B, C, D) strictly adhering to scientific rules.
"""

from typing import List, Dict, Any, Tuple, Optional
from datetime import datetime

from app.scientific.validation import validate_observation_pair_suitability


class ObservationEvaluationResult:
    def __init__(
        self,
        case: str,
        message: str,
        is_processable: bool,
        observations: List[Dict[str, Any]],
        selected_pairs: List[Tuple[Dict[str, Any], Dict[str, Any]]] = None,
        unsuitable_reasons: List[str] = None
    ):
        self.case = case  # "CASE_A", "CASE_B", "CASE_C", "CASE_D"
        self.message = message
        self.is_processable = is_processable
        self.observations = observations
        self.selected_pairs = selected_pairs or []
        self.unsuitable_reasons = unsuitable_reasons or []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "case": self.case,
            "is_processable": self.is_processable,
            "message": self.message,
            "observation_count": len(self.observations),
            "suitable_pair_count": len(self.selected_pairs),
            "unsuitable_reasons": self.unsuitable_reasons
        }


class ObservationService:
    """
    Evaluates discovered NISAR observations for temporal analysis suitability.
    """

    def evaluate_observations(
        self,
        observations: List[Dict[str, Any]],
        requested_start: str,
        requested_end: str,
        analysis_type: str = "surface_change",
        comparison_strategy: str = "first_vs_last" # "first_vs_last", "sequential", "all_pairs"
    ) -> ObservationEvaluationResult:
        """
        Applies strict scientific criteria to classify observations into Cases A, B, C, or D:
        - Case A: Sufficient suitable observations (matching track, frame, direction).
        - Case B: Exactly one observation (insufficient for temporal comparison).
        - Case C: Zero observations found in search window.
        - Case D: Multiple observations found, but mutually unsuitable (mismatched geometries).
        """
        # Case C: No observations
        if not observations:
            return ObservationEvaluationResult(
                case="CASE_C",
                message=f"No suitable NISAR observations were found for the selected area and date range ({requested_start} to {requested_end}).",
                is_processable=False,
                observations=[]
            )

        # Case B: Only one observation
        if len(observations) == 1:
            return ObservationEvaluationResult(
                case="CASE_B",
                message="Only one suitable NISAR observation was found. A minimum of two matching repeat-pass observations is required for temporal change analysis.",
                is_processable=False,
                observations=observations
            )

        # Sort observations chronologically
        sorted_obs = sorted(
            observations,
            key=lambda o: o.get("time_start") or o.get("acquisition_time") or ""
        )

        # Group observations by matching orbital geometry: (track, flight_direction, frame)
        geometry_groups: Dict[Tuple[Any, Any, Any], List[Dict[str, Any]]] = {}
        for obs in sorted_obs:
            key = (
                obs.get("track"),
                (obs.get("flight_direction") or "").lower(),
                obs.get("frame")
            )
            geometry_groups.setdefault(key, []).append(obs)

        # Find the geometry group with the most repeat-pass observations
        best_group_key = None
        best_group = []
        for key, group in geometry_groups.items():
            if len(group) > len(best_group):
                best_group = group
                best_group_key = key

        # Case D check: If no single geometry group has >= 2 observations
        if len(best_group) < 2:
            reasons = [
                f"Found {len(observations)} observations, but they possess conflicting radar geometries (e.g. mixed tracks or ascending/descending passes) with no matching repeat-pass pairs.",
                f"Track distribution: {[o.get('track') for o in observations]}",
                f"Directions: {[o.get('flight_direction') for o in observations]}"
            ]
            return ObservationEvaluationResult(
                case="CASE_D",
                message="Observations exist in the requested timeframe but are geometrically unsuitable for repeat-pass interferometric/radiometric comparison.",
                is_processable=False,
                observations=observations,
                unsuitable_reasons=reasons
            )

        # Case A: We have at least 2 observations in a matching geometry group!
        # Select comparison pairs according to strategy
        selected_pairs = []
        if comparison_strategy == "first_vs_last":
            selected_pairs.append((best_group[0], best_group[-1]))
        elif comparison_strategy == "sequential":
            for i in range(len(best_group) - 1):
                selected_pairs.append((best_group[i], best_group[i + 1]))
        elif comparison_strategy == "all_pairs":
            for i in range(len(best_group)):
                for j in range(i + 1, len(best_group)):
                    selected_pairs.append((best_group[i], best_group[j]))
        else:
            selected_pairs.append((best_group[0], best_group[-1]))

        # Validate suitability of selected pair
        base_obs, sec_obs = selected_pairs[0]
        is_valid, reason = validate_observation_pair_suitability(base_obs, sec_obs, analysis_type)
        if not is_valid:
            return ObservationEvaluationResult(
                case="CASE_D",
                message=f"Observations could not be paired: {reason}",
                is_processable=False,
                observations=observations,
                unsuitable_reasons=[reason]
            )

        time1 = base_obs.get("time_start", "")[:10]
        time2 = sec_obs.get("time_start", "")[:10]
        track = best_group_key[0]
        direction = best_group_key[1].capitalize()

        return ObservationEvaluationResult(
            case="CASE_A",
            message=f"Discovered {len(best_group)} suitable repeat-pass observations on Track {track} ({direction}). Selected baseline ({time1}) and secondary ({time2}) for change analysis.",
            is_processable=True,
            observations=best_group,
            selected_pairs=selected_pairs
        )
