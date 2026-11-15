"use client";

import React from "react";
import { useJourney } from "@/context/JourneyContext";
import { Satellite, Radio, Cpu, CheckCircle2, ShieldAlert } from "lucide-react";

export default function AnalysisProgress() {
  const { analysisStep, currentLocationDetail, currentDistrictDetail, selectedSector } = useJourney();

  const steps = [
    { title: "Querying CMR Granule Registry", desc: "Discovering NISAR Level-2 acquisitions" },
    { title: "Verifying Orbital Geometry", desc: `Matching Track ${currentLocationDetail.default_nisar_track} / Frame 0${currentLocationDetail.default_nisar_frame} passes` },
    { title: "Geocoded Matrix Slicing", desc: `Extracting ${currentLocationDetail.name} AOI slice (${currentLocationDetail.elevation_m}m)` },
    { title: "Calibrated Differential Processing", desc: "Evaluating radar backscatter shifts (Δγ⁰)" },
    { title: "Synthesizing AI Plain-Language Report", desc: "Generating plain-language summary" },
  ];

  return (
    <div className="w-full max-w-lg mx-auto bg-space-900/95 border border-sky-500/40 rounded-2xl p-6 backdrop-blur-2xl shadow-[0_0_50px_rgba(56,189,248,0.2)] text-center select-none">
      {/* Animated Radar Scanning Element */}
      <div className="relative w-28 h-28 mx-auto mb-6 flex items-center justify-center">
        {/* Radar Concentric Rings */}
        <div className="absolute inset-0 rounded-full border border-sky-500/20" />
        <div className="absolute inset-2 rounded-full border border-sky-500/40" />
        <div className="absolute inset-6 rounded-full border border-sky-500/60" />

        {/* Rotating Radar Sweep Needle */}
        <div className="absolute inset-0 rounded-full animate-radar-sweep border-t-2 border-r-2 border-sky-400 bg-gradient-to-tr from-transparent via-sky-500/10 to-sky-400/20" />

        {/* Central Satellite Icon */}
        <div className="relative z-10 w-12 h-12 rounded-full bg-sky-950 border border-sky-400 flex items-center justify-center text-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]">
          <Satellite className="w-6 h-6 animate-pulse" />
        </div>
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/50 text-sky-300 text-xs font-mono tracking-widest uppercase mb-2">
        Earth Observation Analysis in Progress
      </div>

      <h3 className="text-xl font-bold text-white mb-0.5">
        Analyzing {currentLocationDetail.name}
      </h3>
      <p className="text-xs text-sky-300/80 font-mono mb-6">
        {currentLocationDetail.district}, Uttarakhand • Sector: {selectedSector.name} ({selectedSector.code})
      </p>

      {/* Progress Telemetry Readout */}
      <div className="p-3 rounded-xl bg-space-950 border border-slate-800 text-left font-mono text-xs space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sky-400">
          <Radio className="w-3.5 h-3.5 animate-pulse" />
          <span className="truncate">{analysisStep || "Initiating analysis..."}</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-gradient-to-r from-sky-400 to-emerald-400 h-full w-3/4 animate-pulse" />
        </div>
      </div>

      <div className="text-[11px] text-slate-400 font-mono">
        Please wait while calibrated satellite radar matrices are processed.
      </div>
    </div>
  );
}
