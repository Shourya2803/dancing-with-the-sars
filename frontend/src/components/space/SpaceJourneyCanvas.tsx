"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import GalaxyScene from "./GalaxyScene";
import MilkyWayGalaxy from "./MilkyWayGalaxy";
import SolarSystem from "./SolarSystem";
import EarthGlobe from "./EarthGlobe";
import CameraTransitions from "./CameraTransitions";
import { useJourney } from "@/context/JourneyContext";
import { PlanetData } from "@/types/journey";

interface SpaceJourneyCanvasProps {
  onPlanetSelect?: (planet: PlanetData) => void;
}

export default function SpaceJourneyCanvas({
  onPlanetSelect,
}: SpaceJourneyCanvasProps) {
  const {
    stage,
    setStage,
    reducedMotion,
    setSelectedPlanet,
    isGalaxyZooming,
    setIsGalaxyZooming,
    solarSpeedMultiplier,
    showPolarAxes,
  } = useJourney();

  const handleSelectEarth = () => {
    setStage("earth");
  };

  const handleSelectOtherPlanet = () => {
    // Clicking any planet always opens Earth Globe per user request
    setStage("earth");
  };

  const handleZoomToIndia = () => {
    setStage("india");
  };

  const handleGalaxyZoomComplete = () => {
    setStage("solar_system");
  };

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-space-950 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 75], fov: 45, near: 0.1, far: 2000 }}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#020408"]} />
        <ambientLight intensity={0.4} />

        <Suspense fallback={null}>
          {/* Always-on Deep Space Background Stars */}
          <GalaxyScene reducedMotion={reducedMotion} />

          {/* 1. Barred Spiral Milky Way Galaxy (Slow 3s rotation + cinematic zoom into Solar System) */}
          {stage === "space" && (
            <MilkyWayGalaxy
              onZoomComplete={handleGalaxyZoomComplete}
              reducedMotion={reducedMotion}
            />
          )}

          {/* 2. Solar System Stage */}
          {stage === "solar_system" && (
            <SolarSystem
              onSelectEarth={handleSelectEarth}
              onSelectOtherPlanet={handleSelectOtherPlanet}
              reducedMotion={reducedMotion}
              speedMultiplier={solarSpeedMultiplier}
              showAxisLines={showPolarAxes}
            />
          )}

          {/* 3. Earth Globe Stage */}
          {stage === "earth" && (
            <EarthGlobe
              onZoomToIndia={handleZoomToIndia}
              reducedMotion={reducedMotion}
            />
          )}

          {/* GSAP Camera Animation Controller for post-space transitions */}
          {stage !== "space" && (
            <CameraTransitions stage={stage} reducedMotion={reducedMotion} />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
