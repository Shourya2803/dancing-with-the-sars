import { AnalysisSector, PlanetData } from "@/types/journey";
import { DistrictDetail } from "@/types/api";

export const UTTARAKHAND_DISTRICTS: Record<string, DistrictDetail> = {
  chamoli: {
    id: "chamoli",
    name: "Chamoli",
    division: "Garhwal",
    headquarters: "Gopeshwar",
    area_km2: 8030.0,
    centroid: { lat: 30.41, lon: 79.43 },
    bbox: [79.05, 30.01, 80.08, 31.05],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [79.05, 30.20], [79.40, 30.01], [79.95, 30.25],
        [80.08, 30.85], [79.65, 31.05], [79.15, 30.70],
        [79.05, 30.20]
      ]]
    }
  },
  rudraprayag: {
    id: "rudraprayag",
    name: "Rudraprayag",
    division: "Garhwal",
    headquarters: "Rudraprayag",
    area_km2: 1984.0,
    centroid: { lat: 30.45, lon: 79.05 },
    bbox: [78.80, 30.20, 79.35, 30.75],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [78.85, 30.25], [79.25, 30.20], [79.35, 30.55],
        [79.10, 30.75], [78.80, 30.50], [78.85, 30.25]
      ]]
    }
  },
  uttarkashi: {
    id: "uttarkashi",
    name: "Uttarkashi",
    division: "Garhwal",
    headquarters: "Uttarkashi",
    area_km2: 8016.0,
    centroid: { lat: 30.95, lon: 78.60 },
    bbox: [77.85, 30.45, 79.40, 31.45],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.85, 30.75], [78.40, 30.45], [79.00, 30.70],
        [79.40, 31.25], [78.75, 31.45], [78.10, 31.20],
        [77.85, 30.75]
      ]]
    }
  },
  tehri_garhwal: {
    id: "tehri_garhwal",
    name: "Tehri Garhwal",
    division: "Garhwal",
    headquarters: "New Tehri",
    area_km2: 3642.0,
    centroid: { lat: 30.38, lon: 78.48 },
    bbox: [78.15, 30.05, 78.95, 30.85],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [78.15, 30.35], [78.65, 30.05], [78.95, 30.40],
        [78.80, 30.85], [78.30, 30.65], [78.15, 30.35]
      ]]
    }
  },
  dehradun: {
    id: "dehradun",
    name: "Dehradun",
    division: "Garhwal",
    headquarters: "Dehradun",
    area_km2: 3088.0,
    centroid: { lat: 30.32, lon: 78.03 },
    bbox: [77.55, 29.95, 78.35, 30.95],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.60, 30.15], [78.15, 29.95], [78.35, 30.45],
        [78.05, 30.95], [77.55, 30.70], [77.60, 30.15]
      ]]
    }
  },
  pauri_garhwal: {
    id: "pauri_garhwal",
    name: "Pauri Garhwal",
    division: "Garhwal",
    headquarters: "Pauri",
    area_km2: 5329.0,
    centroid: { lat: 29.95, lon: 78.85 },
    bbox: [78.20, 29.40, 79.25, 30.30],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [78.25, 29.75], [78.75, 29.40], [79.25, 29.80],
        [79.10, 30.30], [78.45, 30.15], [78.25, 29.75]
      ]]
    }
  },
  pithoragarh: {
    id: "pithoragarh",
    name: "Pithoragarh",
    division: "Kumaon",
    headquarters: "Pithoragarh",
    area_km2: 7090.0,
    centroid: { lat: 29.90, lon: 80.30 },
    bbox: [79.80, 29.35, 81.05, 30.75],
    default_nisar_track: 156,
    default_nisar_frame: 16,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [79.85, 29.50], [80.35, 29.35], [80.85, 29.80],
        [81.05, 30.45], [80.45, 30.75], [79.80, 30.15],
        [79.85, 29.50]
      ]]
    }
  },
  bageshwar: {
    id: "bageshwar",
    name: "Bageshwar",
    division: "Kumaon",
    headquarters: "Bageshwar",
    area_km2: 2246.0,
    centroid: { lat: 29.85, lon: 79.80 },
    bbox: [79.45, 29.60, 80.15, 30.25],
    default_nisar_track: 106,
    default_nisar_frame: 73,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [79.50, 29.70], [79.95, 29.60], [80.15, 29.95],
        [79.85, 30.25], [79.45, 30.00], [79.50, 29.70]
      ]]
    }
  },
  almora: {
    id: "almora",
    name: "Almora",
    division: "Kumaon",
    headquarters: "Almora",
    area_km2: 3144.0,
    centroid: { lat: 29.60, lon: 79.65 },
    bbox: [79.15, 29.35, 80.00, 29.95],
    default_nisar_track: 106,
    default_nisar_frame: 74,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [79.20, 29.55], [79.65, 29.35], [80.00, 29.70],
        [79.75, 29.95], [79.15, 29.80], [79.20, 29.55]
      ]]
    }
  },
  champawat: {
    id: "champawat",
    name: "Champawat",
    division: "Kumaon",
    headquarters: "Champawat",
    area_km2: 1766.0,
    centroid: { lat: 29.33, lon: 80.10 },
    bbox: [79.80, 29.05, 80.35, 29.60],
    default_nisar_track: 156,
    default_nisar_frame: 16,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [79.85, 29.20], [80.20, 29.05], [80.35, 29.40],
        [80.05, 29.60], [79.80, 29.40], [79.85, 29.20]
      ]]
    }
  },
  nainital: {
    id: "nainital",
    name: "Nainital",
    division: "Kumaon",
    headquarters: "Nainital",
    area_km2: 4251.0,
    centroid: { lat: 29.38, lon: 79.45 },
    bbox: [78.95, 29.00, 79.85, 29.65],
    default_nisar_track: 106,
    default_nisar_frame: 74,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [79.00, 29.20], [79.45, 29.00], [79.85, 29.35],
        [79.65, 29.65], [78.95, 29.45], [79.00, 29.20]
      ]]
    }
  },
  udham_singh_nagar: {
    id: "udham_singh_nagar",
    name: "Udham Singh Nagar",
    division: "Kumaon",
    headquarters: "Rudrapur",
    area_km2: 2542.0,
    centroid: { lat: 28.98, lon: 79.52 },
    bbox: [78.75, 28.75, 80.10, 29.30],
    default_nisar_track: 106,
    default_nisar_frame: 74,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [78.80, 29.05], [79.45, 28.75], [80.10, 28.95],
        [79.85, 29.30], [79.15, 29.25], [78.80, 29.05]
      ]]
    }
  },
  haridwar: {
    id: "haridwar",
    name: "Haridwar",
    division: "Garhwal",
    headquarters: "Haridwar",
    area_km2: 2360.0,
    centroid: { lat: 29.95, lon: 78.16 },
    bbox: [77.85, 29.55, 78.40, 30.15],
    default_nisar_track: 106,
    default_nisar_frame: 74,
    geometry: {
      type: "Polygon",
      coordinates: [[
        [77.90, 29.75], [78.25, 29.55], [78.40, 29.95],
        [78.15, 30.15], [77.85, 29.95], [77.90, 29.75]
      ]]
    }
  }
};

export const ANALYSIS_SECTORS: AnalysisSector[] = [
  {
    id: "terrain_surface",
    name: "Terrain & Surface Change",
    code: "GCOV-RTC",
    analysisType: "terrain_surface",
    icon: "🏔",
    subtitle: "Radiometrically Terrain-Corrected Radar Backscatter",
    description: "Evaluates physical roughness, debris deposition, and mass-wasting using L-band calibrated radar backscatter ratio (Δγ⁰).",
    verifiedProduct: "NISAR Level-2 GCOV (C2854338529-ASF)",
    scientificMethod: "RTC Log-Ratio (Δγ⁰_dB = 10 · log10(γ⁰_t2 / γ⁰_t1)) with |Δγ⁰| ≥ 3.0 dB threshold",
    isBackendSupported: true,
    statusBadge: "VERIFIED"
  },
  {
    id: "forest_canopy",
    name: "Forest & Canopy Structure",
    code: "BIOMASS-SAR",
    analysisType: "forest_canopy",
    icon: "🌲",
    subtitle: "Volume Scattering Alterations",
    description: "Measures structural canopy loss and clearing via L-band cross-polarization (HV) penetration through vegetation layers.",
    verifiedProduct: "NISAR Level-2 GCOV (HV Channel)",
    scientificMethod: "Cross-pol ratio differential (Δγ⁰_HV) reflecting volume scattering change",
    isBackendSupported: true,
    statusBadge: "VERIFIED"
  }
];

export const SOLAR_SYSTEM_PLANETS: PlanetData[] = [
  {
    id: "mercury",
    name: "Mercury",
    size: 0.38,
    distance: 12,
    speed: 0.04,
    color: "#a39f97",
    textureType: "rock",
    description: "Closest planet to the Sun",
    details: "Barren rocky surface with extreme temperature fluctuations and no atmosphere."
  },
  {
    id: "venus",
    name: "Venus",
    size: 0.95,
    distance: 18,
    speed: 0.025,
    color: "#e3bb76",
    textureType: "dense_cloud",
    description: "Thick CO₂ atmosphere & volcanic plains",
    details: "Runaway greenhouse atmosphere hiding a volcanic surface under dense sulfuric clouds."
  },
  {
    id: "earth",
    name: "Earth",
    size: 1.0,
    distance: 26,
    speed: 0.015,
    color: "#2277bb",
    emissive: "#00b4d8",
    textureType: "earth",
    isTarget: true,
    description: "Primary Earth Observation Target",
    details: "Home planet. Host to the NISAR mission and the target study region of Uttarakhand, India."
  },
  {
    id: "mars",
    name: "Mars",
    size: 0.53,
    distance: 34,
    speed: 0.012,
    color: "#c1440e",
    textureType: "rust_rock",
    description: "The Red Planet",
    details: "Iron-oxide rich desert with ancient riverbeds. No active tectonic surface water cycle like Earth."
  },
  {
    id: "jupiter",
    name: "Jupiter",
    size: 2.4,
    distance: 46,
    speed: 0.007,
    color: "#d4a373",
    textureType: "gas_giant",
    description: "Largest gas giant with storm belts",
    details: "Massive gas giant with magnetic belts and the Great Red Spot. No solid radar surface."
  },
  {
    id: "saturn",
    name: "Saturn",
    size: 2.0,
    distance: 58,
    speed: 0.005,
    color: "#f4e2bb",
    textureType: "rings",
    description: "Famous ring system",
    details: "Stunning ringed planet composed of hydrogen and helium."
  },
  {
    id: "uranus",
    name: "Uranus",
    size: 1.4,
    distance: 68,
    speed: 0.003,
    color: "#72d6d9",
    textureType: "ice_giant",
    description: "Tilted ice giant",
    details: "Cold methane atmosphere tilted on its side by past cosmic collisions."
  },
  {
    id: "neptune",
    name: "Neptune",
    size: 1.35,
    distance: 78,
    speed: 0.002,
    color: "#3f67ba",
    textureType: "deep_blue",
    description: "Farthest giant",
    details: "Deep blue windswept ice giant at the outer edge of our planetary system."
  }
];

export const VERIFIED_NISAR_PASSES = [
  { track: 106, frame: 73, date: "2025-11-17", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2025-11-29", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2025-12-11", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2025-12-23", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2026-01-04", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2026-01-16", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2026-01-28", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2026-02-09", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2026-02-21", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" },
  { track: 106, frame: 73, date: "2026-03-05", direction: "descending", coverage: "Chamoli, Uttarkashi, Rudraprayag" }
];
