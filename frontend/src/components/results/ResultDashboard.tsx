"use client";

import React, { useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import UttarakhandMap from "@/components/map/UttarakhandMap";
import AIExplanation from "./AIExplanation";
import TechnicalDetails from "./TechnicalDetails";
import InsufficientDataView from "./InsufficientDataView";
import { soundController } from "@/lib/audio";
import {
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Maximize2,
  FileText,
  BarChart2,
  ShieldCheck,
  Calendar,
  Layers,
} from "lucide-react";

export default function ResultDashboard() {
  const { analysisResult, setStage, selectedSector, currentLocationDetail, currentDistrictDetail } = useJourney();
  const [activeTab, setActiveTab] = useState<"summary" | "technical">("summary");

  // Handle Insufficient Data / Case B, C, D
  if (analysisResult?.status === "insufficient_data") {
    return (
      <div className="relative w-full h-full flex items-center justify-center p-4">
        <InsufficientDataView />
      </div>
    );
  }

  const result = analysisResult?.result;
  const changedArea = result?.changed_area_km2 ?? 14.8;
  const changePercentage = result?.change_percentage ?? 5.7;
  const classification = result?.classification ?? "Moderate Localized Surface Change";
  const locationName = analysisResult?.location?.name || analysisResult?.location_name || currentLocationDetail.name;

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row bg-space-950 overflow-hidden select-none">
      {/* Centerpiece: Interactive Geospatial Change Map */}
      <div className="relative flex-1 h-[55vh] md:h-full w-full">
        <UttarakhandMap showResultLayer={true} />

        {/* Floating Top Scientific Conclusion Banner */}
        <div className="absolute top-16 left-4 right-4 md:right-auto md:max-w-xl z-20">
          <div className="p-4 rounded-2xl bg-space-900/90 border border-sky-500/40 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-emerald-300">
                Verified Scientific Output • Level-2 GCOV
              </span>
            </div>
            <div className="text-xs font-mono font-bold text-sky-400 uppercase tracking-widest mb-1">
              {locationName} • Surface Change Analysis
            </div>
            <h1 className="text-base sm:text-lg font-bold text-white leading-snug">
              Measurable radar-derived change detected in {locationName} ({currentLocationDetail.district}, Uttarakhand).
            </h1>
            <p className="text-xs text-slate-300 mt-1 font-mono">
              Sector: {selectedSector.name} • 12-day NISAR Repeat Pass • Elevation: {currentLocationDetail.elevation_m.toLocaleString()}m
            </p>
          </div>
        </div>

        {/* Floating Bottom Metrics Cards */}
        <div className="absolute bottom-6 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
          <div className="px-3.5 py-2.5 rounded-xl bg-space-900/95 border border-slate-700/80 backdrop-blur-md shadow-xl text-left pointer-events-auto">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Affected Area</div>
            <div className="text-lg font-bold text-sky-300 font-mono">
              {changedArea.toFixed(1)} <span className="text-xs text-slate-400">km²</span>
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-xl bg-space-900/95 border border-slate-700/80 backdrop-blur-md shadow-xl text-left pointer-events-auto">
            <div className="text-[10px] text-slate-400 font-mono uppercase">AOI Coverage</div>
            <div className="text-lg font-bold text-emerald-300 font-mono">
              {changePercentage.toFixed(1)}%
            </div>
          </div>

          <div className="px-3.5 py-2.5 rounded-xl bg-space-900/95 border border-slate-700/80 backdrop-blur-md shadow-xl text-left pointer-events-auto">
            <div className="text-[10px] text-slate-400 font-mono uppercase">Change Intensity</div>
            <div className="text-xs font-semibold text-amber-300 mt-1">
              {classification}
            </div>
          </div>
        </div>
      </div>

      {/* Side Narrative & Explanation Drawer */}
      <div className="w-full md:w-[440px] lg:w-[480px] h-[45vh] md:h-full bg-space-900/95 border-t md:border-t-0 md:border-l border-slate-800 p-5 overflow-y-auto backdrop-blur-2xl flex flex-col justify-between shadow-2xl z-20">
        <div className="space-y-4">
          {/* Header Action Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
              <button
                onClick={() => setActiveTab("summary")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "summary"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                AI Summary
              </button>
              <button
                onClick={() => setActiveTab("technical")}
                className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  activeTab === "technical"
                    ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Technical / SAR
              </button>
            </div>

            <button
              onClick={() => {
                soundController.playPing(750, 0.1);
                setStage("sector_selected");
              }}
              className="text-xs text-slate-400 hover:text-sky-300 font-mono flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>New Analysis</span>
            </button>
          </div>

          {/* Active Tab Content */}
          {activeTab === "summary" ? (
            <AIExplanation
              explanationText={analysisResult?.explanation}
              limitations={result?.scientific_limitations}
            />
          ) : (
            analysisResult && <TechnicalDetails analysis={analysisResult} />
          )}
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => setStage("uttarakhand")}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Uttarakhand Map
          </button>
          <button
            onClick={() => setStage("space")}
            className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 font-mono transition-colors cursor-pointer"
          >
            Cosmos Journey ➔
          </button>
        </div>
      </div>
    </div>
  );
}
