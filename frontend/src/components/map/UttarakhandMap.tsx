"use client";

import React, { useState, useRef, useMemo } from "react";
import { useJourney } from "@/context/JourneyContext";
import { ANALYSIS_SECTORS } from "@/lib/constants";
import {
  UTTARAKHAND_CITIES,
  UTTARAKHAND_CITIES_LIST,
  LocationDetail,
} from "@/data/uttarakhand_cities";
import { soundController } from "@/lib/audio";
import { AnalysisSector } from "@/types/journey";
import {
  ArrowLeft,
  MapPin,
  Satellite,
  Calendar,
  Layers,
  Play,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Sparkles,
  ShieldCheck,
  Activity,
  Sliders,
  CheckCircle2,
  Volume2,
  VolumeX,
  Search,
  Mountain,
  Navigation,
  X,
} from "lucide-react";

interface UttarakhandMapProps {
  showResultLayer?: boolean;
}

export default function UttarakhandMap({ showResultLayer = false }: UttarakhandMapProps) {
  const {
    selectedLocation,
    setSelectedLocation,
    currentLocationDetail,
    selectedSector,
    setSelectedSector,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    comparisonStrategy,
    setComparisonStrategy,
    executeAnalysis,
    isAnalyzing,
    setStage,
    isMockMode,
    toggleMockMode,
    isMuted,
    toggleAudio,
  } = useJourney();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [divisionFilter, setDivisionFilter] = useState<"all" | "Garhwal" | "Kumaon">("all");
  const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Filtered cities based on search and division tabs
  const filteredCities = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return UTTARAKHAND_CITIES_LIST.filter((city) => {
      const matchDivision = divisionFilter === "all" || city.division === divisionFilter;
      const matchSearch =
        !q ||
        city.name.toLowerCase().includes(q) ||
        city.district.toLowerCase().includes(q) ||
        city.division.toLowerCase().includes(q);
      return matchDivision && matchSearch;
    });
  }, [searchQuery, divisionFilter]);

  // Pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Smoothly center and zoom toward selected city
  const handleSelectCity = (city: LocationDetail) => {
    soundController.playPing(880, 0.12);
    setSelectedLocation(city.id);

    // Smoothly pan camera to center city on canvas (canvas center is 735, 615)
    // Offset is dampened for comfortable view
    const targetX = (735 - city.mapX) * 0.4;
    const targetY = (615 - city.mapY) * 0.4;
    setPanOffset({ x: targetX, y: targetY });
    setZoomLevel(1.4);
  };

  const handleSelectSector = (sector: AnalysisSector) => {
    soundController.playPing(750, 0.1);
    setSelectedSector(sector);
    setStage("sector_selected");
  };

  const handleRunAnalysis = () => {
    soundController.playRadarSweep();
    executeAnalysis();
  };

  // Compute bounding box pixels for selected city AOI
  // min_lon: 77.46, max_lon: 81.19, min_lat: 28.50, max_lat: 31.61
  const aoiPixelRect = useMemo(() => {
    const bbox = currentLocationDetail.bbox; // [min_lon, min_lat, max_lon, max_lat]
    const minX = ((bbox[0] - 77.46) / (81.19 - 77.46)) * 1470;
    const maxX = ((bbox[2] - 77.46) / (81.19 - 77.46)) * 1470;
    const minY = ((31.61 - bbox[3]) / (31.61 - 28.50)) * 1230;
    const maxY = ((31.61 - bbox[1]) / (31.61 - 28.50)) * 1230;
    return {
      x: Math.min(minX, maxX),
      y: Math.min(minY, maxY),
      width: Math.abs(maxX - minX),
      height: Math.abs(maxY - minY),
    };
  }, [currentLocationDetail]);

  return (
    <div className="relative w-full h-full bg-space-950 overflow-hidden select-none flex flex-col font-sans">
      {/* =========================================================================
          BACKGROUND: SOFTLY BLURRED 3D MAP OF INDIA
          ========================================================================= */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <img
          src="/india_3d_relief_glowing.png"
          alt="India 3D Map Blurred Background"
          className="w-full h-full object-contain filter blur-[14px] opacity-35 brightness-60 scale-125 transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${panOffset.x * 0.08}px, ${panOffset.y * 0.08}px) scale(${
              1.25 + (zoomLevel - 1) * 0.08
            })`,
          }}
        />
        {/* Soft cosmic dark gradient vignette overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(2,6,23,0.75)_70%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
      </div>

      {/* =========================================================================
          1. TOP FIELD: COMMAND HUD & OBSERVATION DOMAIN STATUS
          ========================================================================= */}
      <header className="relative z-20 h-16 px-6 flex items-center justify-between bg-space-900/85 backdrop-blur-xl border-b border-sky-500/25 shadow-2xl">
        {/* Left: Back to India Map & Domain Title */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              soundController.playPing(650, 0.1);
              setStage("india");
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-space-950/80 hover:bg-space-900 border border-slate-700/60 hover:border-sky-400 text-slate-300 hover:text-white text-xs font-mono transition-all shadow-md cursor-pointer"
            title="Return to 3D India Map"
          >
            <ArrowLeft className="w-4 h-4 text-sky-400" />
            <span className="hidden sm:inline">Back to India</span>
          </button>

          <div className="h-6 w-px bg-slate-800 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <h1 className="text-sm font-bold tracking-wider text-white uppercase font-mono">
                UTTARAKHAND RADAR OBSERVATION DOMAIN
              </h1>
            </div>
            <p className="text-[10px] text-sky-400/80 font-mono tracking-tight hidden sm:block">
              Physical Topographic Relief • NISAR Track 106 • UTM Zone 44N
            </p>
          </div>
        </div>

        {/* Center: Selected City / Area Active Reticle Badge */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-400/50 text-sky-200 text-xs font-mono shadow-[0_0_15px_rgba(56,189,248,0.25)]">
          <MapPin className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
          <span className="font-semibold text-white">
            {currentLocationDetail.name}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-sky-300">
            {currentLocationDetail.district}, {currentLocationDetail.division}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Mountain className="w-3 h-3 inline" />
            {currentLocationDetail.elevation_m.toLocaleString()}m
          </span>
        </div>

        {/* Right: Orbit Telemetry Status & Utility Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-space-950/80 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
            <Satellite className="w-3.5 h-3.5 text-indigo-400" />
            <span>Track {currentLocationDetail.default_nisar_track} • Frame 0{currentLocationDetail.default_nisar_frame}</span>
          </div>

          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-space-950/80 border border-slate-700/60 hover:border-sky-500/40 text-slate-400 hover:text-white transition-all cursor-pointer"
            title={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {!isMuted ? (
              <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>

          {/* Mock mode toggle */}
          <button
            onClick={toggleMockMode}
            className={`px-2.5 py-1 rounded-xl border text-[10px] font-mono transition-all cursor-pointer ${
              isMockMode
                ? "bg-amber-950/80 border-amber-500/60 text-amber-300"
                : "bg-emerald-950/80 border-emerald-500/60 text-emerald-300"
            }`}
          >
            {isMockMode ? "Mock Mode" : "API Live"}
          </button>
        </div>
      </header>

      {/* =========================================================================
          MIDDLE WORKSPACE: LEFT FIELD + CENTER MAP + RIGHT FIELD
          ========================================================================= */}
      <div className="relative flex-1 w-full h-[calc(100vh-8rem)] flex overflow-hidden">
        {/* ---------------------------------------------------------------------
            2. LEFT FIELD: SEARCHABLE CITY / AREA SELECTOR & HAZARD SECTORS
            --------------------------------------------------------------------- */}
        <aside className="relative z-10 w-84 2xl:w-92 h-full p-4 overflow-y-auto space-y-4 pointer-events-auto shrink-0 hidden md:block">
          {/* Card 1: City / Area Selector */}
          <div className="rounded-2xl bg-space-900/85 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>City / Area</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Uttarakhand
              </span>
            </div>

            {/* Search Input Box */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search city or area..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 hover:border-slate-600 focus:border-sky-400 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400/50 font-sans transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Division Filter Tabs */}
            <div className="flex gap-1 p-1 rounded-xl bg-space-950 border border-slate-800 text-[11px] font-mono">
              <button
                onClick={() => setDivisionFilter("all")}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  divisionFilter === "all"
                    ? "bg-sky-500/25 border border-sky-400/50 text-sky-200 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All ({UTTARAKHAND_CITIES_LIST.length})
              </button>
              <button
                onClick={() => setDivisionFilter("Garhwal")}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  divisionFilter === "Garhwal"
                    ? "bg-sky-500/25 border border-sky-400/50 text-sky-200 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Garhwal
              </button>
              <button
                onClick={() => setDivisionFilter("Kumaon")}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  divisionFilter === "Kumaon"
                    ? "bg-sky-500/25 border border-sky-400/50 text-sky-200 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Kumaon
              </button>
            </div>

            {/* Scrollable City / Area Chips */}
            <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {filteredCities.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-400 font-mono">
                  No cities found matching "{searchQuery}".
                </div>
              ) : (
                filteredCities.map((city) => {
                  const isSelected = selectedLocation === city.id;
                  const isHovered = hoveredCityId === city.id;

                  return (
                    <div
                      key={city.id}
                      onClick={() => handleSelectCity(city)}
                      onMouseEnter={() => setHoveredCityId(city.id)}
                      onMouseLeave={() => setHoveredCityId(null)}
                      className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        isSelected
                          ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50"
                          : isHovered
                          ? "bg-slate-800/80 border-slate-600 text-slate-100"
                          : "bg-space-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full shrink-0 ${
                            isSelected ? "bg-sky-400 animate-pulse" : "bg-slate-500"
                          }`}
                        />
                        <div>
                          <div className="font-medium text-white flex items-center gap-1.5">
                            <span>{city.name}</span>
                            {isSelected && (
                              <span className="text-[9px] font-mono px-1 rounded bg-sky-400/20 text-sky-300 border border-sky-400/40">
                                ACTIVE AOI
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {city.district}, Uttarakhand
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-[10px] font-mono text-emerald-300">
                          {city.elevation_m.toLocaleString()}m
                        </div>
                        <div className="text-[9px] font-mono text-slate-500">
                          {city.division}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Card 2: Observation Sectors */}
          <div className="rounded-2xl bg-space-900/85 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>Observation Sector</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                {selectedSector.code}
              </span>
            </div>

            <div className="space-y-2">
              {ANALYSIS_SECTORS.map((sector) => {
                const isSelected = selectedSector.id === sector.id;

                return (
                  <div
                    key={sector.id}
                    onClick={() => handleSelectSector(sector)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_14px_rgba(56,189,248,0.25)]"
                        : "bg-space-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{sector.icon}</span>
                        <span className="text-xs font-semibold text-white">
                          {sector.name}
                        </span>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 line-clamp-2">
                      {sector.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* ---------------------------------------------------------------------
            3. CENTER FIELD: UTTARAKHAND PHYSICAL TOPOGRAPHIC RELIEF MAP
            --------------------------------------------------------------------- */}
        <main
          className="relative flex-1 h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={(e) => {
            if (e.deltaY < 0) {
              setZoomLevel((z) => Math.min(z + 0.15, 3.5));
            } else {
              setZoomLevel((z) => Math.max(z - 0.15, 0.8));
            }
          }}
        >
          {/* Map Controls Floating Pill */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl bg-space-900/90 border border-slate-700/60 backdrop-blur-xl shadow-xl">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3.5))}
              className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.8))}
              className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={resetView}
              className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Map Topographic Legend Floating Badge */}
          <div className="absolute bottom-4 left-4 z-20 hidden sm:flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-space-900/90 border border-slate-700/60 backdrop-blur-xl text-[10px] font-mono text-slate-300 shadow-xl pointer-events-none">
            <span className="text-sky-400 font-bold">PHYSICAL RELIEF:</span>
            <span>200m (Terai) ➔ 7,816m (Nanda Devi)</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400">EPSG:32644 (UTM 44N)</span>
          </div>

          {/* Interactive SVG Canvas */}
          <div
            className="w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center transition-transform duration-300 ease-out"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: "center center",
            }}
          >
            <svg
              viewBox="0 0 1470 1230"
              className="w-full h-full max-h-[85vh] filter-[drop-shadow(0_15px_35px_rgba(0,0,0,0.85))] select-none"
            >
              <defs>
                {/* Luminous Glow for Active Reticle */}
                <filter id="activeLocationGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Drop shadow for 3D state projection */}
                <radialGradient id="physicalStateShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0, 0, 0, 0.85)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>

                {/* Scientific Change Gradient for Result Layer */}
                <linearGradient id="changeHeatGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
                </linearGradient>
              </defs>

              {/* 3D Drop Shadow Underneath Uttarakhand */}
              <ellipse cx="735" cy="1160" rx="430" ry="55" fill="url(#physicalStateShadow)" opacity="0.9" />

              {/* AUTHENTIC PHYSICAL TOPOGRAPHIC RELIEF MAP OF UTTARAKHAND */}
              <image
                href="/uttarakhand_physical_map_glowing.png"
                x="0"
                y="0"
                width="1470"
                height="1230"
                preserveAspectRatio="xMidYMid meet"
                className="pointer-events-none"
              />

              {/* Diagonal NISAR Ground Track 106 Descending Corridor */}
              <g opacity="0.45" className="pointer-events-none">
                <polygon
                  points="250,-50 850,-50 1250,1280 650,1280"
                  fill="#38bdf8"
                  opacity="0.06"
                />
                <line
                  x1="550"
                  y1="-50"
                  x2="950"
                  y2="1280"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeDasharray="10,8"
                />
                <text
                  x="800"
                  y="45"
                  fill="#38bdf8"
                  fontSize="16"
                  fontFamily="monospace"
                  letterSpacing="3"
                  transform="rotate(18, 800, 45)"
                >
                  NISAR FLIGHT GROUND TRACK 106 ➔
                </text>
              </g>

              {/* SELECTED CITY AOI BOUNDING BOX / POLYGON FOOTPRINT */}
              {aoiPixelRect && (
                <g className="pointer-events-none">
                  {/* Outer glowing AOI polygon rectangle */}
                  <rect
                    x={aoiPixelRect.x}
                    y={aoiPixelRect.y}
                    width={aoiPixelRect.width}
                    height={aoiPixelRect.height}
                    fill="rgba(56, 189, 248, 0.08)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="6,4"
                    rx="4"
                  />
                  {/* Corner Reticles */}
                  <path
                    d={`M ${aoiPixelRect.x} ${aoiPixelRect.y + 12} L ${aoiPixelRect.x} ${aoiPixelRect.y} L ${aoiPixelRect.x + 12} ${aoiPixelRect.y}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  <path
                    d={`M ${aoiPixelRect.x + aoiPixelRect.width - 12} ${aoiPixelRect.y} L ${aoiPixelRect.x + aoiPixelRect.width} ${aoiPixelRect.y} L ${aoiPixelRect.x + aoiPixelRect.width} ${aoiPixelRect.y + 12}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  <path
                    d={`M ${aoiPixelRect.x} ${aoiPixelRect.y + aoiPixelRect.height - 12} L ${aoiPixelRect.x} ${aoiPixelRect.y + aoiPixelRect.height} L ${aoiPixelRect.x + 12} ${aoiPixelRect.y + aoiPixelRect.height}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                  <path
                    d={`M ${aoiPixelRect.x + aoiPixelRect.width - 12} ${aoiPixelRect.y + aoiPixelRect.height} L ${aoiPixelRect.x + aoiPixelRect.width} ${aoiPixelRect.y + aoiPixelRect.height} L ${aoiPixelRect.x + aoiPixelRect.width} ${aoiPixelRect.y + aoiPixelRect.height - 12}`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                  />
                </g>
              )}

              {/* RESULT LAYER: SCIENTIFIC RADAR SURFACE CHANGE HEATMAP OVER AOI */}
              {showResultLayer && aoiPixelRect && (
                <g className="pointer-events-none" filter="url(#activeLocationGlow)">
                  <ellipse
                    cx={currentLocationDetail.mapX}
                    cy={currentLocationDetail.mapY}
                    rx={Math.max(aoiPixelRect.width * 0.45, 24)}
                    ry={Math.max(aoiPixelRect.height * 0.45, 20)}
                    fill="url(#changeHeatGradient)"
                    opacity="0.8"
                  />
                  {/* Localized Change Anomaly Contours */}
                  <circle
                    cx={currentLocationDetail.mapX - 8}
                    cy={currentLocationDetail.mapY - 6}
                    r="12"
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="2"
                    strokeDasharray="3,2"
                  />
                  <circle
                    cx={currentLocationDetail.mapX + 10}
                    cy={currentLocationDetail.mapY + 8}
                    r="10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="3,2"
                  />
                  <text
                    x={currentLocationDetail.mapX + 22}
                    y={currentLocationDetail.mapY - 14}
                    fill="#fbbf24"
                    fontSize="13"
                    fontFamily="monospace"
                    fontWeight="bold"
                    letterSpacing="1"
                  >
                    Δγ⁰: -3.8 dB
                  </text>
                </g>
              )}

              {/* CITY & AREA BEACONS / HOTSPOTS */}
              {UTTARAKHAND_CITIES_LIST.map((city) => {
                const isSelected = selectedLocation === city.id;
                const isHovered = hoveredCityId === city.id;

                return (
                  <g
                    key={city.id}
                    transform={`translate(${city.mapX}, ${city.mapY})`}
                    onClick={() => handleSelectCity(city)}
                    onMouseEnter={() => setHoveredCityId(city.id)}
                    onMouseLeave={() => setHoveredCityId(null)}
                    className="cursor-pointer"
                  >
                    {/* Generous invisible hit-box */}
                    <circle cx="0" cy="0" r="32" className="fill-transparent" />

                    {/* Active Selected Concentric Target Reticle */}
                    {isSelected && (
                      <g filter="url(#activeLocationGlow)">
                        <circle
                          cx="0"
                          cy="0"
                          r="34"
                          className="fill-none stroke-sky-400/80 stroke-[2] animate-ping"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r="24"
                          className="fill-none stroke-sky-300 stroke-[1.8] stroke-dasharray-[4,4]"
                        />
                        <line x1="-38" y1="0" x2="-10" y2="0" className="stroke-sky-300 stroke-[2]" />
                        <line x1="10" y1="0" x2="38" y2="0" className="stroke-sky-300 stroke-[2]" />
                        <line x1="0" y1="-38" x2="0" y2="-10" className="stroke-sky-300 stroke-[2]" />
                        <line x1="0" y1="10" x2="0" y2="38" className="stroke-sky-300 stroke-[2]" />
                      </g>
                    )}

                    {/* Anchor Dot */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 7 : isHovered ? 6 : 4}
                      fill={isSelected ? "#38bdf8" : isHovered ? "#facc15" : "#e2e8f0"}
                      stroke="#020617"
                      strokeWidth="2"
                      className="transition-all duration-200"
                    />
                    <circle cx="0" cy="0" r={isSelected ? 3 : 1.5} fill="#ffffff" />

                    {/* Label Tag on Hover or Select */}
                    {(isSelected || isHovered) && (
                      <g transform="translate(14, -14)" className="pointer-events-none">
                        <rect
                          x="-4"
                          y="-16"
                          width={city.name.length * 8 + 65}
                          height="24"
                          rx="6"
                          fill="rgba(2, 6, 23, 0.92)"
                          stroke={isSelected ? "#38bdf8" : "#94a3b8"}
                          strokeWidth="1.2"
                        />
                        <text
                          x="4"
                          y="0"
                          fill="#ffffff"
                          fontSize="11"
                          fontFamily="sans-serif"
                          fontWeight="bold"
                        >
                          {city.name}
                        </text>
                        <text
                          x={city.name.length * 8 + 8}
                          y="0"
                          fill="#38bdf8"
                          fontSize="9"
                          fontFamily="monospace"
                        >
                          {city.elevation_m}m
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </main>

        {/* ---------------------------------------------------------------------
            4. RIGHT FIELD: SAR TELEMETRY & PARAMETER CONFIGURATION
            --------------------------------------------------------------------- */}
        <aside className="relative z-10 w-80 2xl:w-88 h-full p-4 overflow-y-auto space-y-4 pointer-events-auto shrink-0 hidden lg:block">
          {/* Card 1: SAR Observable & Strategy */}
          <div className="rounded-2xl bg-space-900/85 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <Sliders className="w-3.5 h-3.5 text-sky-400" />
                <span>Observable Strategy</span>
              </div>
              <span className="text-[10px] font-mono text-sky-300">
                Level-2 SAR
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                onClick={() => setComparisonStrategy("first_vs_last")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  comparisonStrategy === "first_vs_last"
                    ? "bg-sky-500/20 border-sky-400 text-white font-semibold"
                    : "bg-space-950/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-bold text-sky-300">GCOV-RTC</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Backscatter Δγ⁰ (dB)
                </div>
              </button>

              <button
                onClick={() => setComparisonStrategy("consecutive_pairs")}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  comparisonStrategy === "consecutive_pairs"
                    ? "bg-sky-500/20 border-sky-400 text-white font-semibold"
                    : "bg-space-950/60 border-slate-800 text-slate-400 hover:text-white"
                }`}
              >
                <div className="font-bold text-sky-300">GUNW-InSAR</div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  Displacement (cm)
                </div>
              </button>
            </div>
          </div>

          {/* Card 2: 12-Day Orbit Repeat Window */}
          <div className="rounded-2xl bg-space-900/85 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                <span>Temporal Window</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400">
                12-day Cycle
              </span>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Pre-Event Baseline Date:
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-space-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">
                  Post-Event Observation Date:
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-space-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:ring-1 focus:ring-sky-400 cursor-pointer"
                />
              </div>

              {/* Quick 12-day Preset Passes */}
              <div className="pt-1 space-y-1.5">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider">
                  Verified 12-Day Repeat Passes
                </div>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    onClick={() => {
                      setStartDate("2025-11-15");
                      setEndDate("2025-12-05");
                      soundController.playPing(750, 0.08);
                    }}
                    className="p-1.5 rounded-lg bg-space-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/50 text-[11px] text-left text-slate-300 hover:text-sky-200 transition-colors"
                  >
                    Nov 17 ➔ Nov 29, 2025 (Pair A)
                  </button>
                  <button
                    onClick={() => {
                      setStartDate("2025-12-05");
                      setEndDate("2025-12-28");
                      soundController.playPing(750, 0.08);
                    }}
                    className="p-1.5 rounded-lg bg-space-950 hover:bg-sky-950/60 border border-slate-800 hover:border-sky-500/50 text-[11px] text-left text-slate-300 hover:text-sky-200 transition-colors"
                  >
                    Dec 11 ➔ Dec 23, 2025 (Pair B)
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Instrument & Radar Specs */}
          <div className="rounded-2xl bg-space-900/85 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl space-y-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider pb-1.5 border-b border-slate-800">
              <Satellite className="w-3.5 h-3.5 text-sky-400" />
              <span>NISAR Specs</span>
            </div>
            <div className="space-y-1 text-[11px] text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Area:</span>
                <span className="text-sky-300">{currentLocationDetail.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">District:</span>
                <span>{currentLocationDetail.district}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Elevation:</span>
                <span>{currentLocationDetail.elevation_m}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Frequency:</span>
                <span className="text-sky-300">L-Band (1.25 GHz)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Polarization:</span>
                <span>Dual-Pol (HH + HV)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Resolution:</span>
                <span>10m x 10m GSD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Orbit:</span>
                <span>747 km Sun-Synch</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================================================
          5. BOTTOM FIELD: TELEMETRY ACTION & ANALYSIS EXECUTION BAR
          ========================================================================= */}
      <footer className="relative z-20 h-16 px-6 flex items-center justify-between bg-space-900/85 backdrop-blur-xl border-t border-sky-500/25 shadow-2xl">
        {/* Left: Selected Mission Summary */}
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 hidden sm:flex items-center justify-center text-lg">
            {selectedSector.icon}
          </span>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span>Target: {currentLocationDetail.name}</span>
              <span className="text-slate-500">•</span>
              <span className="text-sky-400">{selectedSector.name}</span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Temporal Pair: {startDate} ➔ {endDate} • Product: {selectedSector.code}
            </div>
          </div>
        </div>

        {/* Center: Sensitivity Anomaly Threshold */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Anomaly Threshold: |Δγ⁰| ≥ 3.0 dB • High Confidence Detection</span>
        </div>

        {/* Right: PRIMARY ACTION BUTTON */}
        <button
          onClick={handleRunAnalysis}
          disabled={isAnalyzing}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-sky-400 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.85)] transition-all transform hover:scale-[1.02] cursor-pointer disabled:opacity-50"
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>CALIBRATING RADAR...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-slate-950" />
              <span>EXECUTE NISAR ANALYSIS</span>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}
