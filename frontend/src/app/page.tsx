"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useJourney } from "@/context/JourneyContext";
import SpaceLandingHero from "@/components/space/SpaceLandingHero";
import SolarSystemHUD from "@/components/space/SolarSystemHUD";
import EarthHUD from "@/components/space/EarthHUD";
import PlanetModal from "@/components/space/PlanetModal";
import IndiaMap from "@/components/map/IndiaMap";
import UttarakhandMap from "@/components/map/UttarakhandMap";
import SectorSelector from "@/components/analysis/SectorSelector";
import AnalysisPanel from "@/components/analysis/AnalysisPanel";
import AnalysisProgress from "@/components/analysis/AnalysisProgress";
import ResultDashboard from "@/components/results/ResultDashboard";
import { SOLAR_SYSTEM_PLANETS } from "@/lib/constants";
import { PlanetData } from "@/types/journey";

// Dynamic import for WebGL Three.js Canvas to guarantee zero SSR mismatch
const SpaceJourneyCanvas = dynamic(
  () => import("@/components/space/SpaceJourneyCanvas"),
  {
    ssr: false,
    loading: () => (
      <div className="absolute inset-0 bg-space-950 flex items-center justify-center">
        <div className="text-center space-y-3 font-mono text-xs text-sky-400">
          <div className="w-8 h-8 mx-auto rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
          <div className="tracking-widest uppercase">
            INITIALIZING EARTH OBSERVATION JOURNEY
          </div>
        </div>
      </div>
    ),
  }
);

export default function HomePage() {
  const { stage, setStage, selectedPlanet, setSelectedPlanet } = useJourney();
  const [clickedPlanet, setClickedPlanet] = useState<PlanetData | null>(null);

  const is3DStage = stage === "space" || stage === "solar_system" || stage === "earth";

  const handlePlanetSelect = () => {
    // Any planet click smoothly transitions directly into the Earth Globe
    setStage("earth");
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-space-950 select-none">
      {/* 3D WebGL Space & Earth Canvas Layer */}
      {is3DStage && (
        <div className="absolute inset-0 z-0">
          <SpaceJourneyCanvas onPlanetSelect={handlePlanetSelect} />
        </div>
      )}

      {/* 1. Landing Stage — Milky Way / Deep Space */}
      {stage === "space" && <SpaceLandingHero />}

      {/* 2. Solar System Stage — Pure text-free 3D cosmos; clicking any planet navigates to Earth */}
      {stage === "solar_system" && null}

      {/* 3. Earth Globe Stage HUD */}
      {stage === "earth" && <EarthHUD />}

      {/* 4. India National Map Stage */}
      {stage === "india" && (
        <div className="relative w-full h-full flex flex-col">
          <IndiaMap />
        </div>
      )}

      {/* 5. Uttarakhand Exploration & Telemetry Command Center Stage */}
      {(stage === "uttarakhand" || stage === "sector_selected") && (
        <div className="relative w-full h-full">
          <UttarakhandMap showResultLayer={false} />
        </div>
      )}

      {/* 6. Active Telemetry Analysis Stage */}
      {stage === "analyzing" && (
        <div className="relative w-full h-full flex items-center justify-center pt-16 px-4">
          <div className="absolute inset-0 z-0 opacity-25 blur-sm">
            <UttarakhandMap showResultLayer={false} />
          </div>
          <div className="relative z-10 w-full max-w-lg">
            <AnalysisProgress />
          </div>
        </div>
      )}

      {/* 7. Final Scientific Result Experience */}
      {stage === "result" && (
        <div className="relative w-full h-full pt-16">
          <ResultDashboard />
        </div>
      )}
    </div>
  );
}
