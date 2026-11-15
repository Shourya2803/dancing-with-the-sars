"use client";

import React, { useState, useRef } from "react";
import { useJourney } from "@/context/JourneyContext";
import { UTTARAKHAND_DISTRICTS, ANALYSIS_SECTORS } from "@/lib/constants";
import { soundController } from "@/lib/audio";
import { DistrictDetail } from "@/types/api";
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
} from "lucide-react";

interface UttarakhandMapProps {
  showResultLayer?: boolean;
}

// 13 Districts hotspot coordinates on the authentic 1470x1230 map
const DISTRICT_HOTSPOTS: Record<
  string,
  { x: number; y: number; color: string; label: string }
> = {
  uttarkashi: { x: 500, y: 250, color: "#94a3b8", label: "Uttarkashi" },
  chamoli: { x: 750, y: 575, color: "#38bdf8", label: "Chamoli" },
  rudraprayag: { x: 650, y: 475, color: "#fb923c", label: "Rudraprayag" },
  tehri_garhwal: { x: 450, y: 525, color: "#4ade80", label: "Tehri Garhwal" },
  dehradun: { x: 275, y: 450, color: "#f472b6", label: "Dehradun" },
  haridwar: { x: 325, y: 700, color: "#fbbf24", label: "Haridwar" },
  pauri_garhwal: { x: 525, y: 700, color: "#c084fc", label: "Pauri Garhwal" },
  pithoragarh: { x: 1025, y: 600, color: "#f87171", label: "Pithoragarh" },
  bageshwar: { x: 850, y: 675, color: "#f472b6", label: "Bageshwar" },
  almora: { x: 750, y: 800, color: "#a3e635", label: "Almora" },
  champawat: { x: 950, y: 925, color: "#818cf8", label: "Champawat" },
  nainital: { x: 700, y: 950, color: "#facc15", label: "Nainital" },
  udham_singh_nagar: { x: 750, y: 1050, color: "#e879f9", label: "Udham Singh Nagar" },
};

export default function UttarakhandMap({ showResultLayer = false }: UttarakhandMapProps) {
  const {
    selectedDistrict,
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
    executeAnalysis,
    isAnalyzing,
    setStage,
    isMockMode,
    toggleMockMode,
    isMuted,
    toggleAudio,
  } = useJourney();

  const [divisionFilter, setDivisionFilter] = useState<"all" | "Garhwal" | "Kumaon">("all");
  const [hoveredDistrictId, setHoveredDistrictId] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const activeDistrictKey = selectedDistrict || "chamoli";
  const activeHotspot = DISTRICT_HOTSPOTS[activeDistrictKey] || DISTRICT_HOTSPOTS["chamoli"];

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

  const handleSelectDistrict = (distId: string) => {
    soundController.playPing(880, 0.12);
    setSelectedDistrict(distId);
  };

  const handleSelectSector = (sector: AnalysisSector) => {
    soundController.playPing(750, 0.1);
    setSelectedSector(sector);
  };

  const handleRunAnalysis = () => {
    soundController.playRadarSweep();
    executeAnalysis();
  };

  const filteredDistricts = Object.values(UTTARAKHAND_DISTRICTS).filter(
    (d) => divisionFilter === "all" || d.division === divisionFilter
  );

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
            transform: `translate(${panOffset.x * 0.08}px, ${panOffset.y * 0.08}px) scale(${1.25 + (zoomLevel - 1) * 0.08})`,
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
              Himalayan NISAR Sector • 13 Mountain Districts • UTM Zone 44N
            </p>
          </div>
        </div>

        {/* Center: Selected District Active Reticle Badge */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-950/80 border border-sky-400/50 text-sky-200 text-xs font-mono shadow-[0_0_15px_rgba(56,189,248,0.25)]">
          <MapPin className="w-3.5 h-3.5 text-sky-400 animate-bounce" />
          <span className="font-semibold text-white">
            {currentDistrictDetail.name}
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-sky-300">
            {currentDistrictDetail.division} Division
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-300">
            {currentDistrictDetail.area_km2.toLocaleString()} km²
          </span>
        </div>

        {/* Right: Orbit Telemetry Status & Utility Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-xl bg-space-950/80 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
            <Satellite className="w-3.5 h-3.5 text-indigo-400" />
            <span>Track 106 • Frame 073 • Descending</span>
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
            2. LEFT FIELD: DISTRICT NAVIGATOR & VERIFIED HAZARD SECTORS
            --------------------------------------------------------------------- */}
        <aside className="relative z-10 w-80 2xl:w-88 h-full p-4 overflow-y-auto space-y-4 pointer-events-auto shrink-0 hidden md:block">
          {/* Card 1: 13 Districts Navigator */}
          <div className="rounded-2xl bg-space-900/85 backdrop-blur-xl border border-slate-700/70 p-4 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-white uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>13 Districts</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                Uttarakhand
              </span>
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
                All (13)
              </button>
              <button
                onClick={() => setDivisionFilter("Garhwal")}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  divisionFilter === "Garhwal"
                    ? "bg-sky-500/25 border border-sky-400/50 text-sky-200 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Garhwal (7)
              </button>
              <button
                onClick={() => setDivisionFilter("Kumaon")}
                className={`flex-1 py-1 rounded-lg transition-all ${
                  divisionFilter === "Kumaon"
                    ? "bg-sky-500/25 border border-sky-400/50 text-sky-200 font-semibold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Kumaon (6)
              </button>
            </div>

            {/* Scrollable District Chips */}
            <div className="max-h-56 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
              {filteredDistricts.map((district) => {
                const isSelected = activeDistrictKey === district.id;
                const isHovered = hoveredDistrictId === district.id;
                const spot = DISTRICT_HOTSPOTS[district.id];

                return (
                  <div
                    key={district.id}
                    onClick={() => handleSelectDistrict(district.id)}
                    onMouseEnter={() => setHoveredDistrictId(district.id)}
                    onMouseLeave={() => setHoveredDistrictId(null)}
                    className={`flex items-center justify-between p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                      isSelected
                        ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50"
                        : isHovered
                        ? "bg-slate-800/80 border-slate-600 text-slate-100"
                        : "bg-space-950/60 border-slate-800/80 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: spot?.color || "#38bdf8" }}
                      />
                      <span className="font-medium">{district.name}</span>
                    </div>

                    <div className="text-[10px] font-mono text-slate-400">
                      {district.area_km2.toLocaleString()} km²
                    </div>
                  </div>
                );
              })}
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
            3. CENTER FIELD: UTTARAKHAND DISTRICT MAP (AUTHENTIC 13 DISTRICT ATLAS)
            --------------------------------------------------------------------- */}
        <main
          className="relative flex-1 h-full flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-2"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onWheel={(e) => {
            if (e.deltaY < 0) {
              setZoomLevel((z) => Math.min(z + 0.15, 3.0));
            } else {
              setZoomLevel((z) => Math.max(z - 0.15, 0.8));
            }
          }}
        >
          {/* Map Controls Floating Pill */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl bg-space-900/90 border border-slate-700/60 backdrop-blur-xl shadow-xl">
            <button
              onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3.0))}
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
                <filter id="activeDistrictGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="8" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Drop shadow for 3D state projection */}
                <radialGradient id="stateShadow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(0, 0, 0, 0.75)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>

              {/* 3D Drop Shadow Underneath Uttarakhand */}
              <ellipse cx="735" cy="1150" rx="420" ry="60" fill="url(#stateShadow)" opacity="0.85" />

              {/* AUTHENTIC 13-DISTRICT UTTARAKHAND MAP (Matching User Reference) */}
              <image
                href="/uttarakhand_district_map_glowing.png"
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

              {/* 13 District Hotspot Touchpoints & Interactive Zones */}
              {Object.entries(DISTRICT_HOTSPOTS).map(([distId, spot]) => {
                const isSelected = activeDistrictKey === distId;
                const isHovered = hoveredDistrictId === distId;

                return (
                  <g
                    key={distId}
                    transform={`translate(${spot.x}, ${spot.y})`}
                    onClick={() => handleSelectDistrict(distId)}
                    onMouseEnter={() => setHoveredDistrictId(distId)}
                    onMouseLeave={() => setHoveredDistrictId(null)}
                    className="cursor-pointer"
                  >
                    {/* Outer invisible hover hit-box (radius 60px) */}
                    <circle cx="0" cy="0" r="60" className="fill-transparent" />

                    {/* Active Selected Concentric Target Reticle */}
                    {isSelected && (
                      <g filter="url(#activeDistrictGlow)">
                        <circle
                          cx="0"
                          cy="0"
                          r="45"
                          className="fill-none stroke-sky-400/80 stroke-[2] animate-ping"
                        />
                        <circle
                          cx="0"
                          cy="0"
                          r="32"
                          className="fill-none stroke-sky-300 stroke-[1.8] stroke-dasharray-[4,4]"
                        />
                        <line x1="-48" y1="0" x2="-14" y2="0" className="stroke-sky-300 stroke-[2]" />
                        <line x1="14" y1="0" x2="48" y2="0" className="stroke-sky-300 stroke-[2]" />
                        <line x1="0" y1="-48" x2="0" y2="-14" className="stroke-sky-300 stroke-[2]" />
                        <line x1="0" y1="14" x2="0" y2="48" className="stroke-sky-300 stroke-[2]" />
                      </g>
                    )}

                    {/* Centroid Anchor Beacon */}
                    <circle
                      cx="0"
                      cy="0"
                      r={isSelected ? 10 : isHovered ? 8 : 6}
                      fill={isSelected ? "#38bdf8" : spot.color}
                      stroke="#020408"
                      strokeWidth="2.5"
                      className="transition-all duration-200"
                    />
                    <circle cx="0" cy="0" r={isSelected ? 4 : 2.5} fill="#ffffff" />
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
              <span>Target: {currentDistrictDetail.name}</span>
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