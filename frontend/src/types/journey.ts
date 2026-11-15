import { LocationDetail } from "./api";

export type { LocationDetail };

export type JourneyStage =
  | "space"            // 1. Milky Way / Deep Space landing
  | "solar_system"     // 2. 3D Solar system navigation
  | "earth"            // 3. 3D Earth globe focus
  | "india"            // 4. India National Map focus
  | "uttarakhand"      // 5. Uttarakhand Geospatial / District view
  | "sector_selected"  // 6. Analysis sector chosen & parameters panel
  | "analyzing"        // 7. Scientific pipeline execution telemetry
  | "result";          // 8. Change map, AI interpretation & metrics

export interface AnalysisSector {
  id: string;
  name: string;
  code: string;
  analysisType: string;
  icon: string;
  subtitle: string;
  description: string;
  verifiedProduct: string;
  scientificMethod: string;
  isBackendSupported: boolean;
  statusBadge: "VERIFIED" | "EXPERIMENTAL";
}

export interface PlanetData {
  id: string;
  name: string;
  size: number;
  distance: number;
  speed: number;
  color: string;
  emissive?: string;
  textureType: string;
  isTarget?: boolean;
  description: string;
  details: string;
}
