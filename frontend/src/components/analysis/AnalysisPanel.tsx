"use client";

import React, { useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { UTTARAKHAND_DISTRICTS, VERIFIED_NISAR_PASSES } from "@/lib/constants";
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
} from "lucide-react";

export default function AnalysisPanel() {
  const {
    selectedSector,
    selectedDistrict,
    setSelectedDistrict,
    currentDistrictDetail,
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

  const [showOrbitPresets, setShowOrbitPresets] = useState(false);

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
    soundController.playPing(750, 0.1);
  };

  const handleApplyPreset = (passStart: string, passEnd: string) => {
    setStartDate(passStart);
    setEndDate(passEnd);
    setShowOrbitPresets(false);
    soundController.playPing(900, 0.12);
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
        {/* District Selector */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>Target District / Area of Interest</span>
          </label>
          <div className="relative">
            <select
              value={selectedDistrict}
              onChange={handleDistrictChange}
              className="w-full appearance-none bg-space-950 border border-slate-700 hover:border-slate-600 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all font-sans cursor-pointer"
            >
              {Object.values(UTTARAKHAND_DISTRICTS).map((district) => (
                <option key={district.id} value={district.id} className="bg-space-950 text-white">
                  {district.name} ({district.division} Division • {district.area_km2.toLocaleString()} km²)
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex justify-between items-center mt-1 text-[11px] text-slate-400 font-mono">
            <span>Centroid: {currentDistrictDetail.centroid.lat}°N, {currentDistrictDetail.centroid.lon}°E</span>
            <span>Primary Track: 106</span>
          </div>
        </div>

        {/* Date Range Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-sky-400" />
              <span>Requested Temporal Window</span>
            </label>
            <button
              onClick={() => setShowOrbitPresets(!showOrbitPresets)}
              className="text-[11px] text-sky-400 hover:text-sky-300 font-mono flex items-center gap-1 transition-colors"
            >
              <Satellite className="w-3 h-3" />
              <span>12-day Orbit Presets</span>
            </button>
          </div>

          {/* Quick 12-day Presets Dropdown */}
          {showOrbitPresets && (
            <div className="mb-3 p-2.5 rounded-xl bg-space-950 border border-sky-500/30 text-xs font-mono space-y-1.5">
              <div className="text-slate-400 text-[10px] uppercase tracking-wider pb-1 border-b border-slate-800">
                Verified 12-Day Repeat Passes (Track 106 / Frame 073)
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => handleApplyPreset("2025-11-15", "2025-12-05")}
                  className="px-2 py-1.5 text-left rounded bg-slate-900 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-200 transition-colors"
                >
                  Nov 17 ➔ Nov 29, 2025 (Pass Pair A)
                </button>
                <button
                  onClick={() => handleApplyPreset("2025-12-05", "2025-12-28")}
                  className="px-2 py-1.5 text-left rounded bg-slate-900 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-200 transition-colors"
                >
                  Dec 11 ➔ Dec 23, 2025 (Pass Pair B)
                </button>
                <button
                  onClick={() => handleApplyPreset("2026-01-01", "2026-01-20")}
                  className="px-2 py-1.5 text-left rounded bg-slate-900 hover:bg-sky-950/70 border border-slate-800 hover:border-sky-500/50 text-slate-300 hover:text-sky-200 transition-colors"
                >
                  Jan 04 ➔ Jan 16, 2026 (Winter Pair)
                </button>
                <button
                  onClick={() => handleApplyPreset("2026-06-01", "2026-06-05")}
                  className="px-2 py-1.5 text-left rounded bg-slate-900 hover:bg-rose-950/40 border border-slate-800 hover:border-rose-500/50 text-rose-300 transition-colors"
                >
                  Test Insufficient Data (&lt; 12 days)
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-[10px] text-slate-400 font-mono block mb-1">
                Start Search Date
              </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono cursor-pointer"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-mono block mb-1">
                End Search Date
              </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-space-950 border border-slate-700 hover:border-slate-600 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 font-mono cursor-pointer"
              />
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
            The selected dates define your requested search range. NISAR observations
            occur along scheduled 12-day orbital repeat cycles. The scientific backend
            discovers matching repeat passes on Track 106 and compares valid temporal pairs.
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
              { id: "sequential", label: "Sequential", desc: "Adjacent 12-day pairs" },
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
            <span>ANALYZE NISAR OBSERVATIONS</span>
          </button>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mt-2 px-1">
            <span>
              API Target:{" "}
              {backendOnline
                ? "Live FastAPI Backend (http://localhost:8000)"
                : isMockMode
                ? "Mock Mode Enabled (Offline Synthetic Data)"
                : "Backend Offline (Will fallback to Mock Simulation)"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
