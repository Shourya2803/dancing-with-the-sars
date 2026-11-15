"use client";

import React from "react";
import { useJourney } from "@/context/JourneyContext";
import { AlertTriangle, Calendar, RotateCcw, Satellite } from "lucide-react";
import { soundController } from "@/lib/audio";

export default function InsufficientDataView() {
  const { analysisResult, setStage, setStartDate, setEndDate } = useJourney();

  const handleExpandDates = () => {
    soundController.playPing(750, 0.1);
    // Expand to verified 12-day repeat orbit pair
    setStartDate("2025-11-15");
    setEndDate("2025-12-05");
    setStage("sector_selected");
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-space-900/95 border border-amber-500/40 rounded-2xl p-6 backdrop-blur-2xl shadow-2xl text-center select-none">
      <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-950/80 border border-amber-500/50 flex items-center justify-center text-amber-400">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="inline-block px-3 py-1 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono tracking-widest uppercase mb-3">
        Scientifically Constrained Observation Status
      </div>

      <h2 className="text-xl font-bold text-white mb-2">
        ANALYSIS UNAVAILABLE
      </h2>

      <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-5">
        We could not find enough suitable repeat-pass observations for a reliable
        temporal comparison in the selected period.
      </p>

      {/* Orbital Explanation Box */}
      <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-left font-mono text-xs space-y-2 mb-6">
        <div className="flex items-center gap-2 text-amber-300 font-semibold">
          <Satellite className="w-4 h-4" />
          <span>Why does this happen?</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          NISAR operates on a strict 12-day orbital repeat cycle (Track 106 for
          Uttarakhand). A valid temporal change analysis requires at least two
          observations on the same flight track, frame, and look direction.
        </p>
        {analysisResult?.error && (
          <div className="p-2 rounded bg-amber-950/30 border border-amber-900/50 text-amber-200/90 text-[11px] break-words">
            {analysisResult.error}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleExpandDates}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Calendar className="w-4 h-4" />
          <span>EXPAND TO 12-DAY ORBIT PAIR</span>
        </button>
        <button
          onClick={() => setStage("sector_selected")}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>CHANGE AREA OR DATES</span>
        </button>
      </div>
    </div>
  );
}
