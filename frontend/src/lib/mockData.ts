import { AnalysisResponse } from "@/types/api";

/**
 * Explicitly marked mock datasets used ONLY when mock mode is enabled.
 * Rule #2: Never present mock data as real NISAR analysis.
 */
export const MOCK_ANALYSIS_CHAMOLI_SURFACE: AnalysisResponse = {
  analysis_id: "mock-sim-chamoli-20251129",
  status: "completed",
  region: "Uttarakhand",
  district: "Chamoli",
  requested_period: {
    start: "2025-11-15",
    end: "2025-12-05"
  },
  observations_used: [
    {
      granule_id: "NISAR_L2_PR_GCOV_001_106_073_D_20251117T004218_20251117T004245_D00100_M_F_J_001",
      time: "2025-11-17T00:42:18Z",
      track: 106,
      frame: 73
    },
    {
      granule_id: "NISAR_L2_PR_GCOV_001_106_073_D_20251129T004219_20251129T004246_D00100_M_F_J_001",
      time: "2025-11-29T00:42:19Z",
      track: 106,
      frame: 73
    }
  ],
  result: {
    processor: "NISAR GCOV RTC Log-Ratio Change Engine",
    spatial_reference: "EPSG:32644 (UTM Zone 44N)",
    pixel_resolution_m: [20.0, 20.0],
    change_metric: "delta_gamma0_db",
    changed_area_km2: 14.8,
    change_percentage: 5.7,
    classification: "Moderate Localized Surface Change",
    statistics: {
      mean_db: -0.42,
      std_db: 1.84,
      median_db: -0.15,
      min_db: -11.2,
      max_db: 8.4,
      p10_db: -2.9,
      p90_db: 2.1,
      total_pixels: 647500,
      changed_pixels: 36900
    },
    scientific_limitations: [
      "Physical Scattering Mechanism: Radar backscatter measures geometry, physical roughness, and dielectric permittivity (water/moisture). It does not directly observe chemical composition or land titles.",
      "Terrain Distortion: Extreme Himalayan relief in Chamoli may create localized radar shadow or layover where no valid radar pulse returns.",
      "Event Causation: A measurable decrease or increase in backscatter is an indicator of physical surface change; it requires ground observation or optical confirmation before asserting specific event attribution."
    ]
  },
  map: {
    geotiff_url: "/storage/samples/chamoli_gcov_diff_mock.tif",
    geojson_url: "/storage/samples/chamoli_change_polygons_mock.geojson"
  },
  explanation: "✦ AI SCIENTIFIC INTERPRETATION (GEMINI):\n\nThe scientific analysis detected measurable radar backscatter changes across 14.8 km² (approximately 5.7% of the analyzed sector in Chamoli district) between the 12-day NISAR repeat passes on November 17 and November 29, 2025.\n\n• What happened: A distinct reduction in backscatter (Δγ⁰ ≤ -3.0 dB) was measured along localized valley segments, accompanied by localized positive backscatter increase (Δγ⁰ ≥ +3.0 dB) on steep talus flanks.\n• What this means: The measured radar response indicates physical alterations in surface roughness and dielectric moisture distribution. Areas with sharp decreases are consistent with surface smoothing, drainage ponding, or vegetative disruption; areas with increases suggest rock rubble movement or refrozen coarse debris.\n• Important limitation: This observation confirms measurable physical surface changes. It does not automatically diagnose a specific disaster event (e.g. landslide or rockfall) without corroborating geotechnical ground validation."
};

export const MOCK_INSUFFICIENT_DATA_RESPONSE: AnalysisResponse = {
  analysis_id: "mock-sim-insufficient-data",
  status: "insufficient_data",
  region: "Uttarakhand",
  district: "Haridwar",
  requested_period: {
    start: "2026-06-01",
    end: "2026-06-05"
  },
  observations_used: [],
  message: "We could not find enough suitable observations for a reliable comparison in the selected period. Try expanding the date range to match NISAR's 12-day repeat orbit schedule (Track 106) or selecting another area.",
  error: "INSUFFICIENT_OBSERVATIONS: Zero matching granules found on Track 106 within requested 4-day span. NISAR requires at least two temporal repeat passes separated by multiples of 12 days."
};
