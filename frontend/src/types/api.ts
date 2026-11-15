/**
 * Frontend <-> Backend API Contract for Dancing with the SARs.
 * Strictly mirrors backend/app/schemas/api_schemas.py
 */

export interface RequestedPeriod {
  start: string;
  end: string;
}

export interface ObservationSummary {
  granule_id?: string;
  time?: string;
  track?: number;
  frame?: number;
}

export interface ScientificResultStatistics {
  mean_db?: number;
  std_db?: number;
  median_db?: number;
  min_db?: number;
  max_db?: number;
  p10_db?: number;
  p90_db?: number;
  total_pixels?: number;
  changed_pixels?: number;
}

export interface ScientificResultPayload {
  processor?: string;
  spatial_reference?: string;
  pixel_resolution_m?: number[];
  change_metric?: string;
  changed_area_km2?: number;
  change_percentage?: number;
  classification?: string;
  statistics?: ScientificResultStatistics | Record<string, any>;
  change_distribution?: Record<string, any>;
  scientific_limitations?: string[];
}

export interface MapArtifacts {
  geotiff_url?: string;
  geojson_url?: string;
}

export interface LocationReference {
  id: string;
  name: string;
  district?: string;
}

export interface AnalysisCreateRequest {
  region: string;
  location?: LocationReference;
  district?: string;
  aoi_geometry?: Record<string, any>;
  start_date: string;
  end_date: string;
  analysis_type: string;
  sector?: string;
  sector_name?: string;
  comparison_strategy?: string;
}

export interface AnalysisResponse {
  analysis_id: string;
  status: "pending" | "searching" | "processing" | "storing" | "completed" | "failed" | "insufficient_data";
  region: string;
  location?: LocationReference;
  location_name?: string;
  district?: string;
  sector?: string;
  sector_name?: string;
  analysis_type?: string;
  requested_period: RequestedPeriod;
  observations_used: ObservationSummary[];
  result?: ScientificResultPayload;
  map?: MapArtifacts;
  explanation?: string;
  error?: string;
  message?: string;
}

export interface ObservationSearchRequest {
  district?: string;
  bbox?: number[];
  start_date?: string;
  end_date?: string;
  product_type?: string;
}

export interface ObservationSearchResponse {
  total_found: number;
  product_type: string;
  search_bbox: number[];
  granules: Array<Record<string, any>>;
}

export interface DistrictDetail {
  id: string;
  name: string;
  division: string;
  headquarters: string;
  area_km2: number;
  centroid: {
    lat: number;
    lon: number;
  };
  bbox: [number, number, number, number]; // [min_lon, min_lat, max_lon, max_lat]
  default_nisar_track?: number;
  default_nisar_frame?: number;
  geometry?: {
    type: "Polygon" | "MultiPolygon";
    coordinates: number[][][] | number[][][][];
  };
}

export interface LocationDetail {
  id: string;
  name: string;
  district: string;
  division: string;
  latitude: number;
  longitude: number;
  elevation_m: number;
  description: string;
  bbox: [number, number, number, number];
  geometry: {
    type: "Polygon";
    coordinates: number[][][];
  };
  default_nisar_track: number;
  default_nisar_frame: number;
  mapX: number;
  mapY: number;
}

export interface HealthResponse {
  status: string;
  service: string;
  version: string;
  environment: string;
  cmr_search_endpoint: string;
  storage_provider: string;
  supabase_configured: boolean;
  gemini_configured: boolean;
}
