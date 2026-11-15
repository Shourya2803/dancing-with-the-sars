import {
  AnalysisCreateRequest,
  AnalysisResponse,
  DistrictDetail,
  HealthResponse,
  ObservationSearchRequest,
  ObservationSearchResponse,
} from "@/types/api";
import { UTTARAKHAND_DISTRICTS } from "@/lib/constants";
import { MOCK_ANALYSIS_CHAMOLI_SURFACE, MOCK_INSUFFICIENT_DATA_RESPONSE } from "@/lib/mockData";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE) {
    this.baseUrl = baseUrl;
  }

  /**
   * Health check to detect whether FastAPI backend is running
   */
  async checkHealth(): Promise<HealthResponse | null> {
    try {
      const res = await fetch(`${this.baseUrl}/health`, {
        cache: "no-store",
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * Fetch all 13 Uttarakhand districts
   */
  async getDistricts(): Promise<DistrictDetail[]> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/regions/uttarakhand/districts`, {
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to verified local district constants if backend is offline
    }
    return Object.values(UTTARAKHAND_DISTRICTS);
  }

  /**
   * Fetch specific district details
   */
  async getDistrictDetails(districtId: string): Promise<DistrictDetail | null> {
    try {
      const res = await fetch(`${this.baseUrl}/api/v1/regions/uttarakhand/districts/${districtId}`, {
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }
    return UTTARAKHAND_DISTRICTS[districtId] || null;
  }

  /**
   * Search NASA CMR for NISAR observations
   */
  async searchObservations(request: ObservationSearchRequest): Promise<ObservationSearchResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/observations/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      throw new Error(`Observation search failed with status ${res.status}`);
    }
    return await res.json();
  }

  /**
   * Submit an analysis request to the scientific processing pipeline
   */
  async createAnalysis(
    payload: AnalysisCreateRequest,
    isMockMode: boolean = false
  ): Promise<AnalysisResponse> {
    if (isMockMode) {
      // Simulate realistic telemetry processing delay
      await new Promise((resolve) => setTimeout(resolve, 2400));
      // If user selected dates that are too short (< 12 days), simulate honest insufficient_data
      const startDate = new Date(payload.start_date);
      const endDate = new Date(payload.end_date);
      const diffDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays < 12) {
        return {
          ...MOCK_INSUFFICIENT_DATA_RESPONSE,
          location: payload.location,
          location_name: payload.location?.name,
          district: payload.district || "Chamoli",
          requested_period: {
            start: payload.start_date,
            end: payload.end_date,
          },
        };
      }

      return {
        ...MOCK_ANALYSIS_CHAMOLI_SURFACE,
        location: payload.location,
        location_name: payload.location?.name,
        district: payload.district || "Chamoli",
        requested_period: {
          start: payload.start_date,
          end: payload.end_date,
        },
      };
    }

    const res = await fetch(`${this.baseUrl}/api/v1/analyses?async_exec=false`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorJson = await res.json().catch(() => ({}));
      throw new Error(errorJson.detail || `Analysis request failed with status ${res.status}`);
    }

    return await res.json();
  }

  /**
   * Poll status of an asynchronous analysis
   */
  async getAnalysisStatus(analysisId: string): Promise<AnalysisResponse> {
    const res = await fetch(`${this.baseUrl}/api/v1/analyses/${analysisId}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch status for analysis ${analysisId}`);
    }
    return await res.json();
  }
}

export const api = new ApiClient();
