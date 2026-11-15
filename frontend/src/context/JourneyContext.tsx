"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { JourneyStage, AnalysisSector } from "@/types/journey";
import { AnalysisResponse, DistrictDetail, LocationDetail } from "@/types/api";
import { ANALYSIS_SECTORS, UTTARAKHAND_DISTRICTS } from "@/lib/constants";
import { UTTARAKHAND_CITIES, DEFAULT_CITY_ID, getCityById } from "@/data/uttarakhand_cities";
import { api } from "@/lib/api";
import { soundController } from "@/lib/audio";

interface JourneyContextType {
  stage: JourneyStage;
  setStage: (stage: JourneyStage) => void;
  selectedLocation: string;
  setSelectedLocation: (locationId: string) => void;
  currentLocationDetail: LocationDetail;
  selectedDistrict: string;
  setSelectedDistrict: (districtId: string) => void;
  currentDistrictDetail: DistrictDetail;
  selectedSector: AnalysisSector;
  setSelectedSector: (sector: AnalysisSector) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  comparisonStrategy: string;
  setComparisonStrategy: (strategy: string) => void;
  analysisResult: AnalysisResponse | null;
  isAnalyzing: boolean;
  analysisStep: string;
  error: string | null;
  isMockMode: boolean;
  toggleMockMode: () => void;
  backendOnline: boolean;
  isMuted: boolean;
  toggleAudio: () => void;
  reducedMotion: boolean;
  toggleReducedMotion: () => void;
  executeAnalysis: () => Promise<void>;
  resetToStart: () => void;
  selectedPlanet: string | null;
  setSelectedPlanet: (planetId: string | null) => void;
  isGalaxyZooming: boolean;
  setIsGalaxyZooming: (zooming: boolean) => void;
  replayGalaxyIntro: () => void;
  solarSpeedMultiplier: number;
  setSolarSpeedMultiplier: (mult: number) => void;
  showPolarAxes: boolean;
  setShowPolarAxes: (show: boolean) => void;
}

const JourneyContext = createContext<JourneyContextType | undefined>(undefined);

export const STAGES_ORDER: JourneyStage[] = [
  "space",
  "solar_system",
  "earth",
  "india",
  "uttarakhand",
  "sector_selected",
  "analyzing",
  "result",
];

export function JourneyProvider({ children }: { children: ReactNode }) {
  const [stage, setStage] = useState<JourneyStage>("space");
  const [selectedLocation, setSelectedLocation] = useState<string>(DEFAULT_CITY_ID);
  const [selectedSector, setSelectedSector] = useState<AnalysisSector>(ANALYSIS_SECTORS[0]);
  const [startDate, setStartDate] = useState<string>("2025-11-15");
  const [endDate, setEndDate] = useState<string>("2025-12-05");
  const [comparisonStrategy, setComparisonStrategy] = useState<string>("first_vs_last");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState<boolean>(false);
  const [backendOnline, setBackendOnline] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isGalaxyZooming, setIsGalaxyZooming] = useState<boolean>(false);
  const [solarSpeedMultiplier, setSolarSpeedMultiplier] = useState<number>(1.0);
  const [showPolarAxes, setShowPolarAxes] = useState<boolean>(false);

  const replayGalaxyIntro = () => {
    setIsGalaxyZooming(false);
    setStage("space");
  };

  // Check health on load
  useEffect(() => {
    api.checkHealth().then((health) => {
      if (health && (health.status === "ok" || health.status === "healthy")) {
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    });
  }, []);

  const toggleMockMode = () => {
    setIsMockMode((prev) => !prev);
  };

  const toggleAudio = () => {
    const muted = soundController.toggleMute();
    setIsMuted(muted);
  };

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev);
  };

  // Resolved Current Location
  const currentLocationDetail: LocationDetail =
    getCityById(selectedLocation) || UTTARAKHAND_CITIES[DEFAULT_CITY_ID];

  // Backward compatibility: Derive district from selected city
  const districtKey = currentLocationDetail.district.toLowerCase().replace(/\s+/g, "_");
  const currentDistrictDetail =
    UTTARAKHAND_DISTRICTS[districtKey] || UTTARAKHAND_DISTRICTS["chamoli"];

  const setSelectedDistrict = (distId: string) => {
    // When district is selected, find first matching city in that district only if not already in it
    const normDist = distId.toLowerCase().replace(/_/g, " ");
    if (currentLocationDetail.district.toLowerCase() === normDist) {
      return;
    }
    const matchingCity = Object.values(UTTARAKHAND_CITIES).find(
      (c) => c.district.toLowerCase() === normDist || c.id === distId
    );
    if (matchingCity) {
      setSelectedLocation(matchingCity.id);
    }
  };

  const executeAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    setStage("analyzing");
    soundController.playRadarSweep();

    try {
      setAnalysisStep("Querying NASA Earthdata CMR Granule Registry...");
      await new Promise((r) => setTimeout(r, 600));

      setAnalysisStep(`Evaluating Track ${currentLocationDetail.default_nisar_track} & Frame 0${currentLocationDetail.default_nisar_frame} Orbital Geometry...`);
      await new Promise((r) => setTimeout(r, 700));

      setAnalysisStep(`Slicing Geocoded RTC Backscatter Matrix over ${currentLocationDetail.name} AOI...`);
      await new Promise((r) => setTimeout(r, 800));

      setAnalysisStep("Computing Calibrated Δγ⁰ Log-Ratio & Threshold Contours...");

      const payload = {
        region: "Uttarakhand",
        location: {
          id: currentLocationDetail.id,
          name: currentLocationDetail.name,
          district: currentLocationDetail.district,
        },
        district: currentLocationDetail.district,
        aoi_geometry: currentLocationDetail.geometry,
        start_date: startDate,
        end_date: endDate,
        analysis_type: selectedSector.analysisType,
        comparison_strategy: comparisonStrategy,
      };

      const result = await api.createAnalysis(payload, isMockMode || !backendOnline);
      setAnalysisResult(result);
      setAnalysisStep("Analysis complete. Transitioning to observation result.");
      soundController.playPing(1100, 0.2);

      setTimeout(() => {
        setIsAnalyzing(false);
        setStage("result");
      }, 500);
    } catch (err: any) {
      setIsAnalyzing(false);
      setError(err?.message || "Failed to execute scientific analysis.");
      setStage("sector_selected");
    }
  };

  const resetToStart = () => {
    setStage("space");
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <JourneyContext.Provider
      value={{
        stage,
        setStage,
        selectedLocation,
        setSelectedLocation,
        currentLocationDetail,
        selectedDistrict: districtKey,
        setSelectedDistrict,
        currentDistrictDetail,
        selectedSector,
        setSelectedSector,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        comparisonStrategy,
        setComparisonStrategy,
        analysisResult,
        isAnalyzing,
        analysisStep,
        error,
        isMockMode,
        toggleMockMode,
        backendOnline,
        isMuted,
        toggleAudio,
        reducedMotion,
        toggleReducedMotion,
        executeAnalysis,
        resetToStart,
        selectedPlanet,
        setSelectedPlanet,
        isGalaxyZooming,
        setIsGalaxyZooming,
        replayGalaxyIntro,
        solarSpeedMultiplier,
        setSolarSpeedMultiplier,
        showPolarAxes,
        setShowPolarAxes,
      }}
    >
      {children}
    </JourneyContext.Provider>
  );
}

export function useJourney() {
  const context = useContext(JourneyContext);
  if (!context) {
    throw new Error("useJourney must be used within a JourneyProvider");
  }
  return context;
}
