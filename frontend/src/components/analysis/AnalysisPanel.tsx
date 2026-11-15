"use client";

import React, { useState, useRef, useEffect } from "react";
import { useJourney } from "@/context/JourneyContext";
import {
  UTTARAKHAND_CITIES,
  UTTARAKHAND_CITIES_LIST,
  LocationDetail,
} from "@/data/uttarakhand_cities";
import { soundController } from "@/lib/audio";
import {
  Calendar,
  MapPin,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  Layers,
  ChevronDown,
  Satellite,
  Search,
  Mountain,
  Check,
  X,
} from "lucide-react";

export default function AnalysisPanel() {
  const {
    selectedSector,
    selectedLocation,
    setSelectedLocation,
    currentLocationDetail,
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
    backendOnline,
  } = useJourney();

  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const startDateRef = useRef<HTMLInputElement>(null);
  const endDateRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCityDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = UTTARAKHAND_CITIES_LIST.filter((city) => {
    const term = citySearchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      city.name.toLowerCase().includes(term) ||
      city.district.toLowerCase().includes(term) ||
      city.division.toLowerCase().includes(term)
    );
  });

  const handleSelectCity = (city: LocationDetail) => {
    setSelectedLocation(city.id);
    setIsCityDropdownOpen(false);
    setCitySearchTerm("");
    soundController.playPing(880, 0.1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-space-900/90 border border-slate-700/80 rounded-2xl p-6 backdrop-blur-xl shadow-2xl select-none">
      {/* Top Header with Selected Sector */}
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <span className="text-3xl p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
            {selectedSector.icon}
          </span>
          <div>
            <div className="text-[11px] font-mono text-sky-400 uppercase tracking-wider">
              Selected Sector
            </div>
            <h3 className="text-lg font-bold text-white">
              {selectedSector.name}
            </h3>
          </div>
        </div>

        <button
          onClick={() => setStage("uttarakhand")}
          className="text-xs text-slate-400 hover:text-sky-300 font-mono flex items-center gap-1 transition-colors px-2.5 py-1 rounded-lg border border-slate-800 hover:border-slate-700"
        >
          <RotateCcw className="w-3 h-3" /> Change Sector
        </button>
      </div>

      <div className="space-y-4">
        {/* City / Area Selector */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-400" />
              <span>City / Area</span>
            </div>
            <span className="text-[10px] text-slate-400 font-normal">
              Uttarakhand Only (36 Verified Locations)
            </span>
          </label>

          {/* Trigger Button */}
          <div
            onClick={() => setIsCityDropdownOpen((prev) => !prev)}
            className="w-full flex items-center justify-between bg-space-950 border border-slate-700 hover:border-sky-400/60 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all font-sans cursor-pointer shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shrink-0 animate-pulse" />
              <div className="text-left">
                <span className="font-semibold text-white">{currentLocationDetail.name}</span>
                <span className="text-slate-400 text-xs ml-2">
                  ({currentLocationDetail.district}, Uttarakhand)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-emerald-400 hidden sm:inline flex items-center gap-1">
                <Mountain className="w-3 h-3 inline" />
                {currentLocationDetail.elevation_m.toLocaleString()}m
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                  isCityDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </div>
          </div>

          {/* Searchable Dropdown Popover */}
          {isCityDropdownOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-space-950/95 border border-sky-500/40 rounded-2xl shadow-2xl backdrop-blur-2xl p-2.5 space-y-2 animate-in fade-in-0 zoom-in-95">
              {/* Search Box */}
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
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* City Results List */}
              <div className="max-h-60 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {filteredCities.length === 0 ? (
                  <div className="p-3 text-center text-xs text-slate-400 font-mono">
                    No verified locations matching "{citySearchTerm}".
                  </div>
                ) : (
                  filteredCities.map((city) => {
                    const isSelected = selectedLocation === city.id;
                    return (
                      <div
                        key={city.id}
                        onClick={() => handleSelectCity(city)}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs cursor-pointer transition-all ${
                          isSelected
                            ? "bg-sky-500/20 border border-sky-400 text-white font-medium shadow-sm"
                            : "hover:bg-slate-800/80 border border-transparent text-slate-300 hover:text-white"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isSelected ? "bg-sky-400" : "bg-slate-600"
                            }`}
                          />
                          <div>
                            <div className="font-semibold text-white">{city.name}</div>
                            <div className="text-[10px] text-slate-400">
                              {city.district}, Uttarakhand
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-emerald-300">
                            {city.elevation_m.toLocaleString()}m
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-sky-400" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Location Footprint Meta */}
          <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-mono">
            <span>
              Coordinates: {currentLocationDetail.latitude.toFixed(4)}°N, {currentLocationDetail.longitude.toFixed(4)}°E
            </span>
            <span>
              Primary Track: {currentLocationDetail.default_nisar_track} • Frame: 0{currentLocationDetail.default_nisar_frame}
            </span>
          </div>
        </div>

        {/* Date Range Selection with Calendar Trigger Buttons */}
        <div>
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-2">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            <span>Requested Temporal Window</span>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1 flex items-center justify-between">
                <span>Start Search Date</span>
                <span className="text-[9px] text-sky-400">Open calendar</span>
              </label>
              <div
                onClick={() => startDateRef.current?.showPicker?.()}
                className="flex items-center justify-between bg-space-950 border border-slate-700 hover:border-sky-400 rounded-xl px-3 py-2.5 cursor-pointer transition-colors group shadow-inner"
              >
                <input
                  ref={startDateRef}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-white font-mono focus:outline-none cursor-pointer [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    startDateRef.current?.showPicker?.();
                  }}
                  className="p-1 rounded-lg hover:bg-slate-800 text-sky-400 group-hover:text-sky-300 transition-colors cursor-pointer shrink-0 ml-2"
                  title="Click to open calendar"
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 font-mono block mb-1 flex items-center justify-between">
                <span>End Search Date</span>
                <span className="text-[9px] text-sky-400">Open calendar</span>
              </label>
              <div
                onClick={() => endDateRef.current?.showPicker?.()}
                className="flex items-center justify-between bg-space-950 border border-slate-700 hover:border-sky-400 rounded-xl px-3 py-2.5 cursor-pointer transition-colors group shadow-inner"
              >
                <input
                  ref={endDateRef}
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-transparent text-sm text-white font-mono focus:outline-none cursor-pointer [color-scheme:dark]"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    endDateRef.current?.showPicker?.();
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

        {/* Scientific Explanation Notice */}
        <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-sky-400 font-mono text-[11px]">
            <Info className="w-3.5 h-3.5" />
            <span>Search Constraint UX Principle</span>
          </div>
          <p className="leading-relaxed">
            The selected dates define your requested search range. The scientific backend
            discovers matching satellite radar acquisitions over the selected area and compares valid temporal pairs.
          </p>
        </div>

        {/* Comparison Strategy */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-sky-400" />
            <span>Temporal Comparison Strategy</span>
          </label>
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            {[
              { id: "first_vs_last", label: "First vs Last", desc: "Longest baseline" },
              { id: "sequential", label: "Sequential", desc: "Adjacent temporal pairs" },
              { id: "all_pairs", label: "All Pairs", desc: "Complete matrix" },
            ].map((strategy) => (
              <button
                key={strategy.id}
                onClick={() => setComparisonStrategy(strategy.id)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  comparisonStrategy === strategy.id
                    ? "bg-sky-950/80 border-sky-400 text-sky-200 ring-1 ring-sky-400/40"
                    : "bg-space-950 border-slate-800 text-slate-400 hover:border-slate-700"
                }`}
              >
                <div className="font-semibold text-white">{strategy.label}</div>
                <div className="text-[10px] text-slate-400">{strategy.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Start Analysis Button */}
        <div className="pt-3">
          <button
            onClick={executeAnalysis}
            disabled={isAnalyzing}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-sm tracking-wide transition-all duration-300 shadow-[0_0_25px_rgba(14,165,233,0.35)] flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-white group-hover:scale-110 transition-transform" />
            <span>ANALYZE NISAR OBSERVATIONS FOR {currentLocationDetail.name.toUpperCase()}</span>
          </button>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
            <span>
              Target AOI: {currentLocationDetail.name} ({currentLocationDetail.district}, UK)
            </span>
            <span>
              {backendOnline
                ? "Live FastAPI Backend"
                : isMockMode
                ? "Mock Mode Enabled"
                : "Backend Offline"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
