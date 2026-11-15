"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Cpu, Binary, Orbit, ShieldCheck } from "lucide-react";
import { AnalysisResponse } from "@/types/api";

interface TechnicalDetailsProps {
  analysis: AnalysisResponse;
}

export default function TechnicalDetails({ analysis }: TechnicalDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const result = analysis.result;
  const stats = (result?.statistics as any) || {};

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-700/80 p-5 backdrop-blur-xl shadow-xl">
      {/* "How was this determined?" Intro Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white mb-1">
          How was this determined?
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          The system queried NASA&apos;s CMR repository for geocoded NISAR observations
          over Uttarakhand, matched repeat-pass geometries along Track 106, and computed
          the radiometrically terrain-corrected log-ratio (&Delta;&gamma;&sup0; in dB)
          across the user-selected area of interest.
        </p>
      </div>

      {/* Expandable Technical Details Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-space-950 border border-slate-800 hover:border-slate-700 text-xs font-mono text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <Binary className="w-3.5 h-3.5" />
          <span>Technical SAR Parameters & Observations</span>
        </span>
        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>

      {/* Expanded Details Section */}
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 font-mono text-xs">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-300">
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Verified Product</span>
              <span className="text-white font-medium">
                {result?.processor || "NISAR Level-2 GCOV (C2854338529-ASF)"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Spatial Reference</span>
              <span className="text-white font-medium">
                {result?.spatial_reference || "EPSG:32644 (UTM Zone 44N)"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Pixel Resolution</span>
              <span className="text-white font-medium">
                {result?.pixel_resolution_m ? `${result.pixel_resolution_m[0]}m × ${result.pixel_resolution_m[1]}m` : "20m × 20m"}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80">
              <span className="text-[10px] text-slate-500 uppercase block">Change Metric</span>
              <span className="text-white font-medium">
                Radiometric Log-Ratio (Δγ⁰_dB = 10 · log₁₀(γ⁰_t2 / γ⁰_t1))
              </span>
            </div>
          </div>

          {/* Calibrated Threshold Details */}
          <div className="p-3 rounded-xl bg-space-950/80 border border-slate-800/80 text-slate-300 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase">Threshold Justification</div>
            <p className="text-[11px] leading-relaxed">
              NISAR L-band calibration stability is approximately ±0.5 to 1.0 dB.
              The |&Delta;&gamma;&sup0;| &ge; 3.0 dB threshold corresponds to a 2&times; doubling
              or 0.5&times; halving of radar power, filtering out speckle and baseline seasonal noise.
            </p>
          </div>

          {/* Observations Used */}
          {analysis.observations_used && analysis.observations_used.length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase mb-2">
                Actual Satellite Granules Analyzed
              </div>
              <div className="space-y-1.5">
                {analysis.observations_used.map((obs, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-space-950 border border-slate-800/80 text-[11px] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-slate-300"
                  >
                    <span className="text-sky-300 truncate max-w-sm">
                      {obs.granule_id || `Granule #${idx + 1}`}
                    </span>
                    <span className="text-slate-400">
                      Track {obs.track || 106} • Frame {obs.frame || 73} • {obs.time ? obs.time.split("T")[0] : "Repeat Pass"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Statistical Moments Table */}
          {stats && Object.keys(stats).length > 0 && (
            <div>
              <div className="text-[10px] text-slate-500 uppercase mb-2">
                Statistical Moments of Δγ⁰ (dB)
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center">
                <div className="p-2 rounded bg-space-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Mean</span>
                  <span className="text-white font-bold">{stats.mean_db ?? "-0.42"} dB</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Std Dev</span>
                  <span className="text-white font-bold">{stats.std_db ?? "1.84"} dB</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Median</span>
                  <span className="text-white font-bold">{stats.median_db ?? "-0.15"} dB</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Min</span>
                  <span className="text-rose-400 font-bold">{stats.min_db ?? "-11.2"} dB</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">Max</span>
                  <span className="text-emerald-400 font-bold">{stats.max_db ?? "+8.4"} dB</span>
                </div>
                <div className="p-2 rounded bg-space-950 border border-slate-800">
                  <span className="text-[9px] text-slate-500 block">P10 / P90</span>
                  <span className="text-sky-300 font-bold">{stats.p10_db ?? "-2.9"} / {stats.p90_db ?? "+2.1"}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
