"use client";

import React, { useState, useRef, useEffect } from "react";
import { useJourney } from "@/context/JourneyContext";
import { UTTARAKHAND_DISTRICTS, ANALYSIS_SECTORS } from "@/lib/constants";
import { UTTARAKHAND_CITIES, LocationDetail } from "@/data/uttarakhand_cities";
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
  Sliders,
  CheckCircle2,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
  X,
  Check,
  Mountain,
  Radio,
  Clock,
  Compass,
} from "lucide-react";

interface UttarakhandMapProps {
  showResultLayer?: boolean;
}

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

  // Active City / Location (defaults to Joshimath, Chamoli)
  const [selectedLocationId, setSelectedLocationId] = useState<string>("joshimath");
  const currentLocation: LocationDetail =
    UTTARAKHAND_CITIES[selectedLocationId] || UTTARAKHAND_CITIES["joshimath"];

  // Dropdown / Popup toggles
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState<boolean>(false);
  const [isSectorDropdownOpen, setIsSectorDropdownOpen] = useState<boolean>(false);
  const [isSarModalOpen, setIsSarModalOpen] = useState<boolean>(false);

  // Search & Filter within City Dropdown
  const [citySearchTerm, setCitySearchTerm] = useState<string>("");
  const [divisionFilter, setDivisionFilter] = useState<"all" | "Garhwal" | "Kumaon">("all");

  // Map Pan and Zoom states
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoveredPinId, setHoveredPinId] = useState<string | null>(null);

  // Date picker element refs for calendar popover
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const endDateInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsCityDropdownOpen(false);
        setIsSectorDropdownOpen(false);
        setIsSarModalOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter 36 cities
  const allCitiesList = Object.values(UTTARAKHAND_CITIES);
  const filteredCities = allCitiesList.filter((city) => {
    const matchesSearch =
      city.name.toLowerCase().includes(citySearchTerm.toLowerCase()) ||
      city.district.toLowerCase().includes(citySearchTerm.toLowerCase());
    const matchesDivision =
      divisionFilter === "all" || city.division === divisionFilter;
    return matchesSearch && matchesDivision;
  });

  // Handle selecting a city / area
  const handleSelectCity = (city: LocationDetail) => {
    soundController.playPing(880, 0.12);
    setSelectedLocationId(city.id);
    const matchingDistrictId = city.district.toLowerCase().replace(/\s+/g, "_");
    if (UTTARAKHAND_DISTRICTS[matchingDistrictId]) {
      setSelectedDistrict(matchingDistrictId);
    }
    setIsCityDropdownOpen(false);
  };

  // Handle selecting an observation sector
  const handleSelectSector = (sector: AnalysisSector) => {
    soundController.playPing(750, 0.1);
    setSelectedSector(sector);
    setIsSectorDropdownOpen(false);
  };

  // Pan controls
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

  const handleRunAnalysis = () => {
    soundController.playRadarSweep();
    executeAnalysis();
  };

  // Close all open dropdowns when clicking outside
  const closeAllDropdowns = () => {
    setIsCityDropdownOpen(false);
    setIsSectorDropdownOpen(false);
  };

  return (
    <div className="relative w-full h-full bg-space-950 overflow-hidden select-none flex flex-col font-sans">
      {/* =========================================================================
          BACKGROUND: BLURRED 3D MAP OF INDIA
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
          TOP COMMAND HUD: DROPDOWN & POPUP TRIGGERS (CLEAN & NON-INTRUSIVE)
          ========================================================================= */}
      <header className="relative z-30 h-16 px-6 flex items-center justify-between bg-space-900/85 backdrop-blur-xl border-b border-sky-500/25 shadow-2xl">
        {/* Left Section: Back Button & Title */}
        <div className="flex items-center gap-3">
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

          <div className="h-6 w-px bg-slate-800 hidden md:block" />

          {/* 1. CITY / AREA DROPDOWN TRIGGER */}
          <div className="relative">
            <button
              onClick={() => {
                soundController.playPing(750, 0.08);
                setIsCityDropdownOpen((prev) => !prev);
                setIsSectorDropdownOpen(false);
              }}
              className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-lg cursor-pointer ${
                isCityDropdownOpen
                  ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50"
                  : "bg-space-950/80 border-slate-700/70 hover:border-sky-400 text-slate-200 hover:text-white"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              <div className="text-left">
                <span className="font-bold text-white">{currentLocation.name}</span>
                <span className="text-slate-400 text-[10px] ml-1.5 hidden xl:inline">
                  ({currentLocation.district}) • {currentLocation.elevation_m.toLocaleString()}m
                </span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isCityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* POPUP / DROPDOWN: SEARCHABLE CITIES LIST */}
            {isCityDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 z-50 bg-space-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl p-3.5 space-y-3 animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-400" />
                    <span>Target City / Area (36)</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
                    Uttarakhand
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search city or area..."
                    value={citySearchTerm}
                    onChange={(e) => setCitySearchTerm(e.target.value)}
                    className="w-full bg-space-900 border border-slate-700 focus:border-sky-400 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-400 font-sans"
                  />
                  {citySearchTerm && (
                    <button
                      onClick={() => setCitySearchTerm("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Division Filter Tabs */}
                <div className="flex gap-1 p-1 rounded-xl bg-space-900 border border-slate-800 text-[11px] font-mono">
                  <button
                    onClick={() => setDivisionFilter("all")}
                    className={`flex-1 py-1 rounded-lg transition-all ${
                      divisionFilter === "all"
                        ? "bg-sky-500/25 border border-sky-400/50 text-sky-200 font-semibold"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    All ({allCitiesList.length})
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

                {/* Scrollable City Results */}
                <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {filteredCities.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-mono">
                      No locations found matching "{citySearchTerm}".
                    </div>
                  ) : (
                    filteredCities.map((city) => {
                      const isSelected = selectedLocationId === city.id;
                      return (
                        <div
                          key={city.id}
                          onClick={() => handleSelectCity(city)}
                          className={`flex items-center justify-between p-2.5 rounded-xl text-xs cursor-pointer transition-all ${
                            isSelected
                              ? "bg-sky-500/20 border border-sky-400 text-white font-medium shadow-[0_0_12px_rgba(56,189,248,0.25)]"
                              : "hover:bg-slate-800/80 border border-transparent text-slate-300 hover:text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                isSelected ? "bg-sky-400 animate-ping" : "bg-slate-500"
                              }`}
                            />
                            <div>
                              <div className="font-semibold text-white flex items-center gap-1.5">
                                <span>{city.name}</span>
                                {isSelected && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-sky-950 text-sky-300 border border-sky-800">
                                    ACTIVE AOI
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400">
                                {city.district}, Uttarakhand ({city.division})
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-emerald-300">
                              {city.elevation_m.toLocaleString()}m
                            </span>
                            {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Section: OBSERVATION SECTOR DROPDOWN & SAR PARAMETERS POPUP */}
        <div className="flex items-center gap-3">
          {/* 2. OBSERVATION SECTOR DROPDOWN TRIGGER */}
          <div className="relative">
            <button
              onClick={() => {
                soundController.playPing(750, 0.08);
                setIsSectorDropdownOpen((prev) => !prev);
                setIsCityDropdownOpen(false);
              }}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono transition-all shadow-lg cursor-pointer ${
                isSectorDropdownOpen
                  ? "bg-sky-500/20 border-sky-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/50"
                  : "bg-space-950/80 border-slate-700/70 hover:border-sky-400 text-slate-200 hover:text-white"
              }`}
            >
              <span>{selectedSector.icon}</span>
              <span className="font-bold text-white hidden sm:inline">
                {selectedSector.name}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                {selectedSector.code}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isSectorDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* POPUP / DROPDOWN: OBSERVATION SECTORS */}
            {isSectorDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 sm:w-96 z-50 bg-space-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl p-3.5 space-y-2.5 animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                    <span>Observation Sectors</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">
                    Verified Algorithms
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
                            : "bg-space-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{sector.icon}</span>
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
            )}
          </div>

          {/* 3. SAR TELEMETRY & PARAMETERS POPUP TRIGGER */}
          <button
            onClick={() => {
              soundController.playPing(750, 0.08);
              setIsSarModalOpen(true);
              closeAllDropdowns();
            }}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-space-950/80 hover:bg-space-900 border border-slate-700/70 hover:border-sky-400 text-slate-200 hover:text-white text-xs font-mono transition-all shadow-lg cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-sky-400" />
            <span>SAR Telemetry & Window</span>
          </button>
        </div>

        {/* Right Section: Orbit Status & Utility Controls */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-xl bg-space-950/80 border border-indigo-500/30 text-indigo-300 text-[11px] font-mono">
            <Satellite className="w-3.5 h-3.5 text-indigo-400" />
            <span>Track {currentLocation.default_nisar_track} • Frame 0{currentLocation.default_nisar_frame}</span>
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
          FULL-SCREEN CENTER WORKSPACE: MAP BREATHES UNCONSTRAINED
          ========================================================================= */}
      <main
        className="relative flex-1 w-full h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-4"
        onClick={closeAllDropdowns}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => {
          if (e.deltaY < 0) {
            setZoomLevel((z) => Math.min(z + 0.15, 3.2));
          } else {
            setZoomLevel((z) => Math.max(z - 0.15, 0.75));
          }
        }}
      >
        {/* Floating Zoom Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl bg-space-900/90 border border-slate-700/60 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3.2))}
            className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.75))}
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

        {/* Floating Physical Relief Legend Pill (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-space-900/90 border border-sky-500/30 backdrop-blur-xl text-[11px] font-mono text-slate-300 shadow-xl flex items-center gap-2 pointer-events-none">
          <span className="text-sky-400 font-bold">PHYSICAL RELIEF:</span>
          <span>200m (Terai) → 7,816m (Nanda Devi)</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400">EPSG:32644 (UTM 44N)</span>
        </div>

        {/* Interactive SVG Canvas */}
        <div
          className="w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center transition-transform duration-300 ease-out"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          <svg
            viewBox="0 0 1470 1230"
            className="w-full h-full max-h-[85vh] filter-[drop-shadow(0_20px_45px_rgba(0,0,0,0.85))] select-none"
          >
            <defs>
              {/* Luminous Glow for Active Location Reticle */}
              <filter id="locationReticleGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 3D Drop Shadow Underneath Uttarakhand */}
              <radialGradient id="stateShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 0, 0, 0.75)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* 3D Drop Shadow Underneath State */}
            <ellipse cx="735" cy="1160" rx="440" ry="65" fill="url(#stateShadow)" opacity="0.85" />

            {/* AUTHENTIC TOPOGRAPHIC RELIEF MAP OF UTTARAKHAND WITH GLOWING BLUE BORDER */}
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
            <g opacity="0.4" className="pointer-events-none">
              <polygon
                points="250,-50 850,-50 1250,1280 650,1280"
                fill="#38bdf8"
                opacity="0.05"
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

            {/* Prominent City Pins (36 Verified Locations) */}
            {allCitiesList.map((city) => {
              const isSelected = selectedLocationId === city.id;
              const isHovered = hoveredPinId === city.id;

              return (
                <g
                  key={city.id}
                  transform={`translate(${city.mapX}, ${city.mapY})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectCity(city);
                  }}
                  onMouseEnter={() => setHoveredPinId(city.id)}
                  onMouseLeave={() => setHoveredPinId(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible hit-target area */}
                  <circle cx="0" cy="0" r="28" className="fill-transparent" />

                  {/* Active Selected Location Glowing Reticle */}
                  {isSelected && (
                    <g filter="url(#locationReticleGlow)">
                      <circle
                        cx="0"
                        cy="0"
                        r="38"
                        className="fill-none stroke-sky-400/80 stroke-[2] animate-ping"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="26"
                        className="fill-none stroke-sky-300 stroke-[1.8] stroke-dasharray-[4,4]"
                      />
                      <line x1="-40" y1="0" x2="-10" y2="0" className="stroke-sky-300 stroke-[2]" />
                      <line x1="10" y1="0" x2="40" y2="0" className="stroke-sky-300 stroke-[2]" />
                      <line x1="0" y1="-40" x2="0" y2="-10" className="stroke-sky-300 stroke-[2]" />
                      <line x1="0" y1="10" x2="0" y2="40" className="stroke-sky-300 stroke-[2]" />
                    </g>
                  )}

                  {/* Pin Dot */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 8 : isHovered ? 6 : 4}
                    fill={isSelected ? "#38bdf8" : isHovered ? "#7dd3fc" : "#94a3b8"}
                    stroke="#020408"
                    strokeWidth="1.8"
                    className="transition-all duration-200"
                  />
                  <circle cx="0" cy="0" r={isSelected ? 3 : 1.5} fill="#ffffff" />

                  {/* City Label Badge */}
                  {(isSelected || isHovered) && (
                    <g transform="translate(14, -14)" className="pointer-events-none">
                      <rect
                        x="-4"
                        y="-14"
                        width={city.name.length * 8.5 + 40}
                        height="20"
                        rx="5"
                        fill="rgba(2, 6, 23, 0.92)"
                        stroke="#38bdf8"
                        strokeWidth="1"
                      />
                      <text
                        x="4"
                        y="0"
                        fill="#ffffff"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {city.name}
                      </text>
                      <text
                        x={city.name.length * 8.5 + 8}
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

      {/* =========================================================================
          POPUP MODAL: SAR TELEMETRY, TEMPORAL WINDOW & OBSERVATION STRATEGY
          ========================================================================= */}
      {isSarModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in-0">
          <div
            className="w-full max-w-2xl bg-space-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl p-6 space-y-5 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <Sliders className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white font-mono uppercase tracking-wider">
                  SAR Telemetry & Parameter Configuration
                </h3>
              </div>
              <button
                onClick={() => setIsSarModalOpen(false)}
                className="p-1.5 rounded-lg bg-space-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Field 1: Observable Strategy */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Radio className="w-3.5 h-3.5 text-sky-400" />
                  <span>Observable Strategy</span>
                </label>

                <div className="space-y-2 text-xs font-mono">
                  <button
                    onClick={() => {
                      soundController.playPing(750, 0.08);
                      setComparisonStrategy("first_vs_last");
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      comparisonStrategy === "first_vs_last"
                        ? "bg-sky-500/20 border-sky-400 text-white font-semibold shadow-md"
                        : "bg-space-900/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold text-sky-300">GCOV-RTC</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Radiometric Terrain Corrected Backscatter (Δγ⁰ in dB)
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      soundController.playPing(750, 0.08);
                      setComparisonStrategy("consecutive_pairs");
                    }}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      comparisonStrategy === "consecutive_pairs"
                        ? "bg-sky-500/20 border-sky-400 text-white font-semibold shadow-md"
                        : "bg-space-900/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <div className="font-bold text-sky-300">GUNW-InSAR</div>
                    <div className="text-[11px] text-slate-300 mt-0.5">
                      Interferometric Surface Displacement (Line-of-Sight cm)
                    </div>
                  </button>
                </div>
              </div>

              {/* Field 2: Temporal Window Dates with Interactive Calendar Pickers */}
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Requested Temporal Window</span>
                </label>

                <div className="space-y-3 text-xs font-mono">
                  {/* Pre-Event Baseline Date */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Pre-Event Baseline Date:</span>
                      <span className="text-[10px] text-sky-400 font-sans">Open calendar</span>
                    </label>
                    <div
                      onClick={() => startDateInputRef.current?.showPicker?.()}
                      className="flex items-center justify-between bg-space-900 border border-slate-700 hover:border-sky-400 rounded-xl px-3 py-2.5 cursor-pointer transition-colors group shadow-inner"
                    >
                      <input
                        ref={startDateInputRef}
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer [color-scheme:dark]"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          startDateInputRef.current?.showPicker?.();
                        }}
                        className="p-1 rounded-lg hover:bg-slate-800 text-sky-400 group-hover:text-sky-300 transition-colors cursor-pointer shrink-0 ml-2"
                        title="Click to open calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Post-Event Observation Date */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1 flex items-center justify-between">
                      <span>Post-Event Observation Date:</span>
                      <span className="text-[10px] text-sky-400 font-sans">Open calendar</span>
                    </label>
                    <div
                      onClick={() => endDateInputRef.current?.showPicker?.()}
                      className="flex items-center justify-between bg-space-900 border border-slate-700 hover:border-sky-400 rounded-xl px-3 py-2.5 cursor-pointer transition-colors group shadow-inner"
                    >
                      <input
                        ref={endDateInputRef}
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full bg-transparent text-white font-mono text-xs focus:outline-none cursor-pointer [color-scheme:dark]"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          endDateInputRef.current?.showPicker?.();
                        }}
                        className="p-1 rounded-lg hover:bg-slate-800 text-sky-400 group-hover:text-sky-300 transition-colors cursor-pointer shrink-0 ml-2"
                        title="Click to open calendar"
                      >
                        <Calendar className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Field 3: NISAR Telemetry Specs */}
            <div className="p-3 rounded-xl bg-space-900/80 border border-slate-800 text-xs font-mono grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-300">
              <div>
                <span className="text-slate-500 block text-[10px]">Target Area:</span>
                <span className="text-white font-semibold">{currentLocation.name}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">District:</span>
                <span className="text-white">{currentLocation.district}</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Elevation:</span>
                <span className="text-emerald-400 font-semibold">{currentLocation.elevation_m}m</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Frequency:</span>
                <span className="text-sky-400">L-Band (1.25 GHz)</span>
              </div>
            </div>

            {/* Close Button */}
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsSarModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold font-mono text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          BOTTOM HUD: MINIMAL ACTION & ANALYSIS EXECUTION BAR
          ========================================================================= */}
      <footer className="relative z-30 h-16 px-6 flex items-center justify-between bg-space-900/85 backdrop-blur-xl border-t border-sky-500/25 shadow-2xl">
        {/* Left: Active Mission Summary */}
        <div className="flex items-center gap-3">
          <span className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 hidden sm:flex items-center justify-center text-lg">
            {selectedSector.icon}
          </span>
          <div>
            <div className="text-xs font-semibold text-white flex items-center gap-2">
              <span>Target: {currentLocation.name}</span>
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