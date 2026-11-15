"use client";

import React from "react";
import { useJourney } from "@/context/JourneyContext";
import { AlertTriangle, Calendar, RotateCcw, Satellite } from "lucide-react";
import { soundController } from "@/lib/audio";

export default function InsufficientDataView() {
  const { analysisResult, setStage, setStartDate, setEndDate } = useJourney();

  const todayStr = new Date().toISOString().split("T")[0];
  const isFutureDate = Boolean(
    (analysisResult?.error && /future/i.test(analysisResult.error)) ||
    (analysisResult?.message && /future/i.test(analysisResult.message)) ||
    (analysisResult?.requested_period?.start && analysisResult.requested_period.start > todayStr) ||
    (analysisResult?.requested_period?.end && analysisResult.requested_period.end > todayStr)
  );

  const handleResetValidDates = () => {
    soundController.playPing(750, 0.1);
    setStartDate("2025-11-15");
    setEndDate("2025-12-05");
    setStage("sector_selected");
  };

  const handleExpandDates = () => {
    soundController.playPing(750, 0.1);
    // Expand date search window
    setStartDate("2025-11-15");
    setEndDate("2025-12-05");
    setStage("uttarakhand");
  };

  return (
    <div className={`w-full max-w-xl mx-auto rounded-2xl p-6 backdrop-blur-2xl shadow-2xl text-center select-none ${
      isFutureDate
        ? "bg-space-900/95 border border-rose-500/50 shadow-[0_0_35px_rgba(244,63,94,0.15)]"
        : "bg-space-900/95 border border-amber-500/40"
    }`}>
      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl border flex items-center justify-center ${
        isFutureDate
          ? "bg-rose-950/80 border-rose-500/60 text-rose-400"
          : "bg-amber-950/80 border-amber-500/50 text-amber-400"
      }`}>
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className={`inline-block px-3 py-1 rounded-full text-xs font-mono tracking-widest uppercase mb-3 border ${
        isFutureDate
          ? "bg-rose-950/70 border-rose-500/50 text-rose-300"
          : "bg-amber-950/60 border-amber-500/40 text-amber-300"
      }`}>
        {isFutureDate ? "INVALID DATA • FUTURE ACQUISITION" : "Scientifically Constrained Observation Status"}
      </div>

      <h2 className="text-xl font-bold text-white mb-2">
        {isFutureDate ? "INVALID OBSERVATION DATA" : "ANALYSIS UNAVAILABLE"}
      </h2>

      <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto mb-5">
        {isFutureDate
          ? "The requested acquisition period contains future dates. Earth observation satellites cannot acquire radar backscatter ahead of time."
          : "We could not find enough suitable repeat-pass observations for a reliable temporal comparison in the selected period."}
      </p>

      {/* Orbital / Scientific Explanation Box */}
      <div className="p-4 rounded-xl bg-space-950 border border-slate-800 text-left font-mono text-xs space-y-2 mb-6">
        <div className={`flex items-center gap-2 font-semibold ${
          isFutureDate ? "text-rose-300" : "text-amber-300"
        }`}>
          <Satellite className="w-4 h-4" />
          <span>{isFutureDate ? "Physical Sensor Constraint" : "Why does this happen?"}</span>
        </div>
        <p className="text-slate-400 leading-relaxed">
          {isFutureDate
            ? "Synthetic Aperture Radar (SAR) is an active microwave instrument that must physically illuminate the Earth's surface during an orbital pass. No satellite data exists for future dates."
            : "A valid temporal change analysis requires at least two suitable satellite radar observations over the target area on matching flight geometry and look direction."}
        </p>
        {analysisResult?.error && (
          <div className={`p-2 rounded text-[11px] break-words border ${
            isFutureDate
              ? "bg-rose-950/40 border-rose-900/60 text-rose-200"
              : "bg-amber-950/30 border-amber-900/50 text-amber-200/90"
          }`}>
            {analysisResult.error}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        {isFutureDate ? (
          <button
            onClick={handleResetValidDates}
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>RESET TO VALID HISTORICAL DATES</span>
          </button>
        ) : (
          <button
            onClick={handleExpandDates}
            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Calendar className="w-4 h-4" />
            <span>EXPAND DATE RANGE</span>
          </button>
        )}
        <button
          onClick={() => setStage("uttarakhand")}
          className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs tracking-wide transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>CHANGE AREA OR DATES</span>
        </button>
      </div>
    </div>
  );
}
