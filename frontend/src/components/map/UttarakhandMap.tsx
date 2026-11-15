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
  Box,
} from "lucide-react";

interface UttarakhandMapProps {
  showResultLayer?: boolean;
}

// ---------------------------------------------------------------------------
// 3D HIGH HIMALAYAN MOUNTAIN SUMMITS (FACETED RIDGES & SNOW ARÊTES)
// ---------------------------------------------------------------------------
interface HimalayanSummit {
  name: string;
  alt: string;
  x: number;
  y: number;
  size: number;
  major: boolean;
}

const HIMALAYAN_SUMMITS: HimalayanSummit[] = [
  { name: "Nanda Devi", alt: "7,816m", x: 945, y: 555, size: 28, major: true },
  { name: "Kamet", alt: "7,756m", x: 915, y: 415, size: 26, major: true },
  { name: "Trishul", alt: "7,120m", x: 915, y: 605, size: 24, major: true },
  { name: "Chaukhamba", alt: "7,138m", x: 795, y: 505, size: 24, major: true },
  { name: "Kedarnath Peak", alt: "6,940m", x: 745, y: 520, size: 22, major: true },
  { name: "Nilkantha / Badrinath", alt: "6,596m", x: 870, y: 505, size: 22, major: true },
  { name: "Panchachuli", alt: "6,904m", x: 1115, y: 645, size: 22, major: true },
  { name: "Bandarpoonch", alt: "6,316m", x: 565, y: 450, size: 20, major: false },
  { name: "Dunagiri", alt: "7,066m", x: 935, y: 535, size: 20, major: false },
  { name: "Shivling", alt: "6,543m", x: 730, y: 495, size: 19, major: false },
];

export default function UttarakhandMap({ showResultLayer = false }: UttarakhandMapProps) {
  const {
    selectedDistrict,
    setSelectedDistrict,
    currentDistrictDetail,
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

  // Active City / Location (Single Source of Truth from JourneyContext)
  const currentLocation = currentLocationDetail;
  const selectedLocationId = selectedLocation;

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

  // 3D Tabletop Relief & Visual Layers
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [mouseTilt, setMouseTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showPeaks, setShowPeaks] = useState<boolean>(true);
  const [showContours, setShowContours] = useState<boolean>(true);

  // DOM Container Refs
  const workspaceRef = useRef<HTMLElement>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
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

  // Handle selecting a city / area with smooth cinematic camera zoom-in & centering
  const handleSelectCity = (city: LocationDetail) => {
    soundController.playPing(1100, 0.15);
    setSelectedLocation(city.id);
    setIsCityDropdownOpen(false);

    // Calculate exact centering pan offset:
    // SVG coordinate space is 1470 x 1230, center is (735, 615).
    const container = mapContainerRef.current;
    const w = container?.clientWidth || 1100;
    const h = container?.clientHeight || 800;
    const k = Math.min(w / 1470, h / 1230);
    const targetZoom = 2.35;
    const targetPanX = -(city.mapX - 735) * k * targetZoom;
    const targetPanY = -(city.mapY - 615) * k * targetZoom;

    setZoomLevel(targetZoom);
    setPanOffset({ x: targetPanX, y: targetPanY });
  };

  // Handle selecting an observation sector
  const handleSelectSector = (sector: AnalysisSector) => {
    soundController.playPing(750, 0.1);
    setSelectedSector(sector);
    setIsSectorDropdownOpen(false);
  };

  // Pan controls & 3D Mouse Parallax
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (is3DMode && workspaceRef.current) {
      // Subtle 3D tabletop relief tilt responding to mouse cursor
      const rect = workspaceRef.current.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseTilt({ x: relX, y: relY });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    soundController.playPing(650, 0.1);
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
    setSelectedLocation(null);
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
        {/* Left Section: Back Button & Target Area Selector */}
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
                  : !currentLocation
                  ? "bg-amber-500/10 border-amber-400/60 hover:border-amber-400 text-amber-200 animate-pulse shadow-[0_0_14px_rgba(245,158,11,0.25)]"
                  : "bg-space-950/80 border-slate-700/70 hover:border-sky-400 text-slate-200 hover:text-white"
              }`}
            >
              <MapPin
                className={`w-3.5 h-3.5 ${
                  !currentLocation ? "text-amber-400 animate-bounce" : "text-sky-400 animate-pulse"
                }`}
              />
              <div className="text-left">
                {currentLocation ? (
                  <>
                    <span className="font-bold text-white">{currentLocation.name}</span>
                    <span className="text-slate-400 text-[10px] ml-1.5 hidden xl:inline">
                      ({currentLocation.district}) • {currentLocation.elevation_m.toLocaleString()}m
                    </span>
                  </>
                ) : (
                  <>
                    <span className="font-bold text-amber-300">Select City / Area</span>
                    <span className="text-slate-400 text-[10px] ml-1.5 hidden xl:inline">
                      (Click pin on map or select)
                    </span>
                  </>
                )}
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
                    <span>Target City / Area ({allCitiesList.length})</span>
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
      </header>

      {/* =========================================================================
          FULL-SCREEN CENTER WORKSPACE: 3D TABLETOP RELIEF & HIGH-DEF MAP
          ========================================================================= */}
      <main
        ref={workspaceRef}
        className="relative flex-1 w-full h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing p-4"
        onClick={closeAllDropdowns}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={(e) => {
          if (e.deltaY < 0) {
            setZoomLevel((z) => Math.min(z + 0.15, 3.5));
          } else {
            setZoomLevel((z) => Math.max(z - 0.15, 0.75));
          }
        }}
      >
        {/* Floating Quick Action Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 p-1 rounded-xl bg-space-900/90 border border-slate-700/60 backdrop-blur-xl shadow-2xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3.5))}
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
            title="Reset to Full Uttarakhand Overview"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <div className="h-px bg-slate-800 my-0.5" />

          {/* 3D Mode Toggle Button */}
          <button
            onClick={() => {
              soundController.playPing(800, 0.08);
              setIs3DMode((prev) => !prev);
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              is3DMode
                ? "bg-sky-500/25 text-sky-300 border border-sky-400/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title={is3DMode ? "3D Tabletop Relief (Active)" : "Switch to 3D Tabletop Relief"}
          >
            <Box className="w-4 h-4" />
          </button>

          {/* Topographic Contours Toggle */}
          <button
            onClick={() => {
              soundController.playPing(800, 0.08);
              setShowContours((prev) => !prev);
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showContours
                ? "bg-emerald-500/25 text-emerald-300 border border-emerald-400/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title={showContours ? "Elevation Contours: Visible" : "Elevation Contours: Hidden"}
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* 3D Mountain Summits Toggle */}
          <button
            onClick={() => {
              soundController.playPing(800, 0.08);
              setShowPeaks((prev) => !prev);
            }}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              showPeaks
                ? "bg-sky-500/25 text-sky-300 border border-sky-400/50"
                : "text-slate-400 hover:text-white hover:bg-slate-800"
            }`}
            title={showPeaks ? "3D Mountain Peaks: Visible" : "3D Mountain Peaks: Hidden"}
          >
            <Mountain className="w-4 h-4" />
          </button>
        </div>

        {/* Floating Physical Relief Legend Pill (Bottom Center) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-4 py-1.5 rounded-full bg-space-900/90 border border-sky-500/30 backdrop-blur-xl text-[11px] font-mono text-slate-300 shadow-xl flex items-center gap-2.5 pointer-events-none">
          <span className="text-sky-400 font-bold flex items-center gap-1.5">
            <Mountain className="w-3.5 h-3.5 text-sky-400" />
            3D PHYSICAL RELIEF:
          </span>
          <span>200m (Terai) → 7,816m (Nanda Devi)</span>
          <span className="text-slate-500">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-400" />
            UTM Zone 44N • Crisp Vector Network
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-sky-300 font-semibold">
            {is3DMode ? "3D Tabletop Tilt Active" : "Ortho Flat View"}
          </span>
        </div>

        {/* Selected City Optical Target Banner */}
        {currentLocation && (
          <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl bg-space-900/90 border border-sky-400/60 backdrop-blur-xl shadow-xl flex items-center gap-2.5 animate-in fade-in-0 slide-in-from-top-2">
            <div className="w-2.5 h-2.5 rounded-full bg-sky-400 animate-ping" />
            <div className="text-xs font-mono text-white">
              <span className="text-sky-400 font-bold uppercase">{currentLocation.name}</span>
              <span className="text-slate-400 ml-2">
                ({currentLocation.district}) • {currentLocation.elevation_m.toLocaleString()}m
              </span>
            </div>
            <button
              onClick={resetView}
              className="ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              Zoom Out
            </button>
          </div>
        )}

        {/* Interactive 3D SVG Stage Canvas */}
        <div
          ref={mapContainerRef}
          className="w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center select-none"
          style={{
            transform: is3DMode
              ? `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel}) perspective(1400px) rotateX(${
                  11 - mouseTilt.y * 6
                }deg) rotateY(${mouseTilt.x * 6}deg)`
              : `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
            transition: isDragging
              ? "none"
              : "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          <svg
            viewBox="0 0 1470 1230"
            className="w-full h-full max-h-[85vh] filter-[drop-shadow(0_25px_50px_rgba(0,0,0,0.95))] select-none"
          >
            <defs>
              {/* Luminous Glow for Active Location Reticle */}
              <filter id="locationReticleGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* 3D Drop Shadow Underneath Uttarakhand State Plinth */}
              <radialGradient id="stateShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 0, 0, 0.85)" />
                <stop offset="70%" stopColor="rgba(0, 0, 0, 0.45)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* 3D Geological Stratified Plinth Textures (Horst & Graben Fault-Block Architecture) */}
              <linearGradient id="siwalikSandstone" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#bca07e" />
                <stop offset="40%" stopColor="#8a6d4d" />
                <stop offset="100%" stopColor="#674f36" />
              </linearGradient>

              <linearGradient id="lesserHimalayanSlate" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#78777d" />
                <stop offset="50%" stopColor="#55545a" />
                <stop offset="100%" stopColor="#3d3b41" />
              </linearGradient>

              <linearGradient id="crystallineBasement" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#323038" />
                <stop offset="60%" stopColor="#1e1c22" />
                <stop offset="100%" stopColor="#121115" />
              </linearGradient>

              <linearGradient id="mantleThrustHeat" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ea580c" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#f97316" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#ea580c" stopOpacity="0.4" />
              </linearGradient>

              {/* High-Definition Unsharp Mask Filter: Keeps terrain razor-sharp and prevents blurring on zoom */}
              <filter id="crispTerrainFilter" x="-5%" y="-5%" width="110%" height="110%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" result="softBlur" />
                <feComposite
                  in="SourceGraphic"
                  in2="softBlur"
                  operator="arithmetic"
                  k1="0"
                  k2="2.4"
                  k3="-1.4"
                  k4="0"
                  result="sharpened"
                />
                <feColorMatrix
                  in="sharpened"
                  type="matrix"
                  values="1.12 0    0    0 -0.04
                          0    1.12 0    0 -0.04
                          0    0    1.12 0 -0.04
                          0    0    0    1  0"
                />
              </filter>
            </defs>

            {/* 3D Drop Shadow Underneath State */}
            <ellipse cx="735" cy="1160" rx="520" ry="75" fill="url(#stateShadow)" opacity="0.9" />

            {/* =========================================================================
                3D STRATIFIED GEOLOGICAL PLINTH / CRUSTAL BLOCK BASE
                (Horst & Graben Fault-Block Architecture directly from user reference)
                ========================================================================= */}
            {is3DMode && (
              <g className="pointer-events-none select-none">
                {/* Layer 1: Siwalik Molasse Sandstone Strata (Upper Sedimentary Bed) */}
                <path
                  d="M 280,920 Q 550,1020 735,1030 Q 980,1010 1190,920 L 1190,955 Q 980,1045 735,1065 Q 550,1055 280,955 Z"
                  fill="url(#siwalikSandstone)"
                  stroke="#a48460"
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Layer 2: Lesser Himalayan Carbonates & Slate (Middle Tectonic Unit) */}
                <path
                  d="M 280,955 Q 550,1055 735,1065 Q 980,1045 1190,955 L 1190,995 Q 980,1085 735,1105 Q 550,1095 280,995 Z"
                  fill="url(#lesserHimalayanSlate)"
                  stroke="#5d5b62"
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Layer 3: Indian Shield Crystalline Basement / Granite (Deep Footwall) */}
                <path
                  d="M 280,995 Q 550,1095 735,1105 Q 980,1085 1190,995 L 1190,1040 Q 980,1130 735,1150 Q 550,1140 280,1040 Z"
                  fill="url(#crystallineBasement)"
                  stroke="#222027"
                  strokeWidth="1.2"
                  opacity="0.95"
                />

                {/* Main Himalayan Thrust (MHT) Fault Plane & Mantle Heat Band */}
                <path
                  d="M 280,1040 Q 550,1140 735,1150 Q 980,1130 1190,1040 L 1190,1050 Q 980,1140 735,1160 Q 550,1150 280,1050 Z"
                  fill="url(#mantleThrustHeat)"
                  opacity="0.85"
                />

                {/* Stratigraphic Strata Text Labels on 3D Block Edge */}
                <text
                  x="735"
                  y="1052"
                  textAnchor="middle"
                  fill="#f1d6b8"
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="bold"
                  letterSpacing="2"
                  opacity="0.9"
                >
                  SIWALIK SANDSTONE & MOLASSE (200m - 1,200m)
                </text>
                <text
                  x="735"
                  y="1092"
                  textAnchor="middle"
                  fill="#cbd5e1"
                  fontSize="9.5"
                  fontFamily="monospace"
                  letterSpacing="2"
                  opacity="0.85"
                >
                  LESSER HIMALAYAN CARBONATES & SLATE (1,200m - 3,500m)
                </text>
                <text
                  x="735"
                  y="1135"
                  textAnchor="middle"
                  fill="#94a3b8"
                  fontSize="9.5"
                  fontFamily="monospace"
                  letterSpacing="2"
                  opacity="0.8"
                >
                  CRYSTALLINE BASEMENT • MAIN HIMALAYAN THRUST (MHT)
                </text>
              </g>
            )}

            {/* =========================================================================
                AUTHENTIC TOPOGRAPHIC RELIEF MAP OF UTTARAKHAND
                Filtered with Unsharp Mask to eliminate raster blurring on zoom!
                ========================================================================= */}
            <image
              href="/uttarakhand_physical_map_glowing.png"
              x="0"
              y="0"
              width="1470"
              height="1230"
              preserveAspectRatio="xMidYMid meet"
              filter="url(#crispTerrainFilter)"
              style={{
                imageRendering: "-webkit-optimize-contrast",
              }}
              className="pointer-events-none"
            />

            {/* =========================================================================
                CRISP VECTOR HIMALAYAN RIVER SYSTEM (NEVER BLURS AT ANY ZOOM LEVEL!)
                ========================================================================= */}
            <g className="pointer-events-none select-none" opacity="0.85">
              {/* Alaknanda / Ganga River Spine (Badrinath -> Devprayag -> Haridwar) */}
              <path
                d="M 870,505 Q 920,520 955,535 Q 920,560 880,580 Q 850,600 820,620 Q 790,615 760,610 Q 695,625 630,640 Q 550,635 480,630 Q 465,655 450,680 Q 430,750 410,850"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="drop-shadow(0 0 3px rgba(56, 189, 248, 0.6))"
              />
              <path
                d="M 870,505 Q 920,520 955,535 Q 920,560 880,580 Q 850,600 820,620 Q 790,615 760,610 Q 695,625 630,640 Q 550,635 480,630 Q 465,655 450,680 Q 430,750 410,850"
                fill="none"
                stroke="#e0f2fe"
                strokeWidth="0.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Bhagirathi River (Gangotri -> Uttarkashi -> Tehri -> Devprayag) */}
              <path
                d="M 760,440 Q 690,460 620,480 Q 600,530 580,580 Q 605,610 630,640"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Mandakini River (Kedarnath -> Guptkashi -> Rudraprayag) */}
              <path
                d="M 745,520 Q 748,560 750,575 Q 755,595 760,610"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Yamuna River (Yamunotri -> Barkot -> Doon) */}
              <path
                d="M 580,420 Q 550,445 520,470 Q 465,490 410,510 Q 370,540 330,600"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Kali / Sharda Eastern Border River (Pithoragarh -> Champawat -> Tanakpur) */}
              <path
                d="M 1220,580 Q 1200,625 1180,670 Q 1145,720 1110,770 Q 1095,800 1080,830 Q 1065,870 1050,910 Q 1030,960 1010,1020"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.0"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Kosi / Ramganga River (Almora -> Corbett -> Ramnagar) */}
              <path
                d="M 890,795 Q 830,830 770,860 Q 765,880 770,890 Q 760,940 740,1000"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>

            {/* =========================================================================
                CRISP TOPOGRAPHIC CONTOUR LINES (VECTOR DETAIL THAT NEVER BLURS)
                ========================================================================= */}
            {showContours && (
              <g className="pointer-events-none select-none" opacity="0.45">
                {/* 1,000m Shivalik Contour */}
                <path
                  d="M 320,680 Q 520,720 700,750 Q 880,870 1080,880"
                  fill="none"
                  stroke="#94a3b8"
                  strokeWidth="0.8"
                  strokeDasharray="4,4"
                />
                <text x="350" y="692" fill="#94a3b8" fontSize="8" fontFamily="monospace">
                  1,000m
                </text>

                {/* 2,500m Lesser Himalayan Contour */}
                <path
                  d="M 420,540 Q 620,600 800,640 Q 980,720 1140,730"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="0.9"
                  strokeDasharray="6,4"
                />
                <text x="450" y="552" fill="#38bdf8" fontSize="8" fontFamily="monospace">
                  2,500m
                </text>

                {/* 4,500m High Himalayan Snowline Contour */}
                <path
                  d="M 520,440 Q 720,490 900,510 Q 1050,570 1200,580"
                  fill="none"
                  stroke="#e0f2fe"
                  strokeWidth="1.0"
                  strokeDasharray="8,4"
                />
                <text x="540" y="452" fill="#e0f2fe" fontSize="8" fontFamily="monospace">
                  4,500m
                </text>

                {/* 6,000m Glacial Glaciation Crest Line */}
                <path
                  d="M 700,430 Q 840,460 960,480 Q 1080,540 1160,560"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="1.2"
                  strokeDasharray="10,5"
                />
                <text x="710" y="442" fill="#ffffff" fontSize="8" fontFamily="monospace">
                  6,000m
                </text>
              </g>
            )}

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

            {/* =========================================================================
                3D HIGH HIMALAYAN MOUNTAIN SUMMITS (FACETED RIDGES & ARÊTES)
                ========================================================================= */}
            {showPeaks && (
              <g className="pointer-events-none select-none">
                {HIMALAYAN_SUMMITS.map((summit, idx) => {
                  const s = summit.size / 24;
                  return (
                    <g
                      key={`summit-${idx}`}
                      transform={`translate(${summit.x}, ${summit.y})`}
                    >
                      {/* Mountain Cast Shadow towards SE */}
                      <polygon
                        points={`0,0 ${15 * s},${13 * s} ${30 * s},${18 * s} ${-5 * s},${9 * s}`}
                        fill="rgba(0, 0, 0, 0.55)"
                        filter="blur(2.5px)"
                      />

                      {/* NW Sunlit Snow Glaciation Face */}
                      <polygon
                        points={`0,${-15 * s} ${-15 * s},${9 * s} 0,${11 * s}`}
                        fill="#f8fafc"
                        stroke="#e2e8f0"
                        strokeWidth="0.8"
                      />
                      {/* SE Granite / Gneiss Leeward Shaded Face */}
                      <polygon
                        points={`0,${-15 * s} 0,${11 * s} ${15 * s},${9 * s}`}
                        fill="#475569"
                        stroke="#334155"
                        strokeWidth="0.8"
                      />
                      {/* Central Sharp Ridge Crest Arête */}
                      <line
                        x1="0"
                        y1={-15 * s}
                        x2="0"
                        y2={11 * s}
                        stroke="#38bdf8"
                        strokeWidth="1.2"
                        opacity="0.9"
                      />

                      {/* Summit Glint Pinhead */}
                      <circle
                        cx="0"
                        cy={-15 * s}
                        r="3.2"
                        fill="#ffffff"
                        filter="drop-shadow(0 0 5px #38bdf8)"
                      />

                      {/* Summit Elevation Badge */}
                      <g transform={`translate(0, ${20 * s})`}>
                        <rect
                          x={-(summit.name.length * 4.2 + 26)}
                          y="-11"
                          width={(summit.name.length * 4.2 + 26) * 2}
                          height="17"
                          rx="4.5"
                          fill="rgba(2, 6, 23, 0.92)"
                          stroke={summit.major ? "#38bdf8" : "#64748b"}
                          strokeWidth="0.9"
                        />
                        <text
                          x="0"
                          y="1"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="9.5"
                          fontFamily="monospace"
                          fontWeight="bold"
                        >
                          ▲ {summit.name}{" "}
                          <tspan fill="#38bdf8">{summit.alt}</tspan>
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            )}

            {/* =========================================================================
                PROMINENT CITY PINS (36 VERIFIED LOCATIONS)
                (Unchecked by default, smooth camera zoom-in upon click)
                ========================================================================= */}
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
                  <circle cx="0" cy="0" r="30" className="fill-transparent" />

                  {/* Active Selected Location Glowing Reticle (Only when selected) */}
                  {isSelected && (
                    <g filter="url(#locationReticleGlow)">
                      {/* Radar Pulse Concentric Waves */}
                      <circle
                        cx="0"
                        cy="0"
                        r="42"
                        className="fill-none stroke-sky-400/80 stroke-[2] animate-ping"
                      />
                      <circle
                        cx="0"
                        cy="0"
                        r="28"
                        className="fill-none stroke-sky-300 stroke-[1.8] stroke-dasharray-[4,4]"
                      />
                      {/* Crosshair Target Calibrators */}
                      <line
                        x1="-44"
                        y1="0"
                        x2="-10"
                        y2="0"
                        className="stroke-sky-300 stroke-[2]"
                      />
                      <line
                        x1="10"
                        y1="0"
                        x2="44"
                        y2="0"
                        className="stroke-sky-300 stroke-[2]"
                      />
                      <line
                        x1="0"
                        y1="-44"
                        x2="0"
                        y2="-10"
                        className="stroke-sky-300 stroke-[2]"
                      />
                      <line
                        x1="0"
                        y1="10"
                        x2="0"
                        y2="44"
                        className="stroke-sky-300 stroke-[2]"
                      />

                      {/* Bounding AOI Radius Footprint Ring */}
                      <circle
                        cx="0"
                        cy="0"
                        r="75"
                        className="fill-sky-500/5 stroke-sky-400/40 stroke-[1] stroke-dasharray-[6,6]"
                      />
                    </g>
                  )}

                  {/* Pin Dot */}
                  <circle
                    cx="0"
                    cy="0"
                    r={isSelected ? 8.5 : isHovered ? 6.5 : 4}
                    fill={isSelected ? "#38bdf8" : isHovered ? "#7dd3fc" : "#94a3b8"}
                    stroke="#020408"
                    strokeWidth="1.8"
                    className="transition-all duration-200"
                  />
                  <circle cx="0" cy="0" r={isSelected ? 3.5 : 1.5} fill="#ffffff" />

                  {/* City Label Badge */}
                  {(isSelected || isHovered) && (
                    <g transform="translate(14, -14)" className="pointer-events-none">
                      <rect
                        x="-4"
                        y="-15"
                        width={city.name.length * 8.5 + 46}
                        height="22"
                        rx="5"
                        fill="rgba(2, 6, 23, 0.94)"
                        stroke="#38bdf8"
                        strokeWidth="1.2"
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
                        fontSize="9.5"
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
                <span className="text-white font-semibold">
                  {currentLocation ? currentLocation.name : "None Selected"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">District:</span>
                <span className="text-white">
                  {currentLocation ? currentLocation.district : "Uttarakhand"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Elevation:</span>
                <span className="text-emerald-400 font-semibold">
                  {currentLocation ? `${currentLocation.elevation_m}m` : "Relief"}
                </span>
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
              {currentLocation ? (
                <>
                  <span>Target: {currentLocation.name}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-sky-400">{selectedSector.name}</span>
                </>
              ) : (
                <span className="text-amber-300 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Select a city or area on the map or menu to calibrate SAR telemetry
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              {currentLocation ? (
                <>
                  Temporal Pair: {startDate} ➔ {endDate} • Product: {selectedSector.code} ({comparisonStrategy})
                </>
              ) : (
                <>36 Verified High-Resolution AOIs Available in Uttarakhand</>
              )}
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
          disabled={isAnalyzing || !currentLocation}
          className={`px-6 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2.5 transition-all transform ${
            !currentLocation
              ? "bg-slate-800 text-slate-500 border border-slate-700/60 cursor-not-allowed opacity-60"
              : isAnalyzing
              ? "bg-sky-600 text-slate-900 cursor-wait opacity-80"
              : "bg-gradient-to-r from-sky-500 via-sky-400 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:shadow-[0_0_30px_rgba(56,189,248,0.85)] hover:scale-[1.02] cursor-pointer"
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-slate-950 border-t-transparent animate-spin" />
              <span>CALIBRATING RADAR...</span>
            </>
          ) : !currentLocation ? (
            <>
              <MapPin className="w-4 h-4 text-amber-400" />
              <span>SELECT CITY TO ANALYZE</span>
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
