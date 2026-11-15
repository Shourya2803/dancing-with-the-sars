"use client";

import React, { useState } from "react";
import { useJourney } from "@/context/JourneyContext";
import { ANALYSIS_SECTORS } from "@/lib/constants";
import { AnalysisSector } from "@/types/journey";
import { soundController } from "@/lib/audio";
import { CheckCircle2, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function SectorSelector() {
  const { selectedSector, setSelectedSector, stage, setStage } = useJourney();
  const [hoveredSector, setHoveredSector] = useState<AnalysisSector | null>(null);

  const handleSelectSector = (sector: AnalysisSector) => {
    soundController.playPing(880, 0.15);
    setSelectedSector(sector);
    setStage("sector_selected");
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs font-mono uppercase tracking-widest mb-2 backdrop-blur-md">
          <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
          <span>Scientifically Verified NISAR Analysis Sectors</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Select an Observation Sector
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto mt-1">
          Explore measurable surface changes across Uttarakhand using calibrated
          NISAR Level-2 radar observables.
        </p>
      </div>

      {/* Floating Holographic Sector Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {ANALYSIS_SECTORS.map((sector) => {
          const isSelected = selectedSector.id === sector.id;
          const isHovered = hoveredSector?.id === sector.id;

          return (
            <div
              key={sector.id}
              onMouseEnter={() => setHoveredSector(sector)}
              onMouseLeave={() => setHoveredSector(null)}
              onClick={() => handleSelectSector(sector)}
              className={`relative rounded-2xl p-5 border cursor-pointer backdrop-blur-xl transition-all duration-300 select-none ${
                isSelected
                  ? "bg-space-900/90 border-sky-400 shadow-[0_0_25px_rgba(56,189,248,0.25)] ring-1 ring-sky-400/50"
                  : isHovered
                  ? "bg-space-900/80 border-slate-600 scale-[1.02] shadow-xl"
                  : "bg-space-900/60 border-slate-800/80 hover:border-slate-700"
              }`}
            >
              {/* Top Row: Icon & Status Badge */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center">
                    {sector.icon}
                  </span>
                  <div>
                    <h3 className="font-semibold text-white text-base flex items-center gap-2">
                      {sector.name}
                      {isSelected && (
                        <CheckCircle2 className="w-4 h-4 text-sky-400" />
                      )}
                    </h3>
                    <div className="text-xs text-sky-300/80 font-mono">
                      {sector.subtitle}
                    </div>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-800">
                  {sector.statusBadge}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                {sector.description}
              </p>

              {/* Scientific Methodology Meta */}
              <div className="pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400">
                  Product:{" "}
                  <span className="text-slate-200">
                    {sector.verifiedProduct.split(" ")[1] || "GCOV"}
                  </span>
                </span>
                <span className="text-sky-400 flex items-center gap-1 group">
                  <span>Configure Analysis</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
