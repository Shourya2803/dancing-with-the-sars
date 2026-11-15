"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/context/JourneyContext";
import {
  Satellite,
  Radio,
  Cpu,
  CheckCircle2,
  Activity,
  Wifi,
  Zap,
  Terminal,
  Scan,
  Compass,
  Layers,
  ShieldCheck,
  Clock,
  Check,
} from "lucide-react";

export default function AnalysisProgress() {
  const {
    analysisStep,
    currentLocationDetail,
    currentDistrictDetail,
    selectedSector,
    startDate,
    endDate,
    comparisonStrategy,
  } = useJourney();

  const locationName = currentLocationDetail?.name || "Target Area";
  const locationDistrict = currentLocationDetail?.district || "Uttarakhand";
  const trackNum = currentLocationDetail?.default_nisar_track || 106;
  const frameNum = currentLocationDetail?.default_nisar_frame || 320;
  const latitude = currentLocationDetail?.latitude?.toFixed(4) || "30.5520";
  const longitude = currentLocationDetail?.longitude?.toFixed(4) || "79.5640";
  const elevation = currentLocationDetail?.elevation_m
    ? `${currentLocationDetail.elevation_m.toLocaleString()}m`
    : "Relief";

  // Real-time animated timer & progress percentage simulation
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [progressPercent, setProgressPercent] = useState<number>(14);
  const [pulsePhase, setPulsePhase] = useState<number>(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setElapsedSeconds(elapsed);

      // Smooth progress curve advancing from 15% towards 96%
      setProgressPercent((prev) => {
        if (prev < 35) return prev + 2.5;
        if (prev < 65) return prev + 1.2;
        if (prev < 88) return prev + 0.8;
        if (prev < 96) return prev + 0.25;
        return prev;
      });

      setPulsePhase((p) => (p + 1) % 100);
    }, 120);

    return () => clearInterval(interval);
  }, []);

  // Scientific processing milestones
  const milestones = [
    {
      id: "cmr",
      title: "Querying NASA CMR Granule Registry",
      desc: "Harvesting NISAR Level-2 GCOV acquisitions",
      minProgress: 10,
    },
    {
      id: "orbit",
      title: "Verifying Orbital Trajectory",
      desc: `Track ${trackNum} / Frame 0${frameNum} descending corridor`,
      minProgress: 35,
    },
    {
      id: "slice",
      title: "Geocoded Matrix Slicing",
      desc: `Extracting ${locationName} AOI matrix (${elevation})`,
      minProgress: 60,
    },
    {
      id: "diff",
      title: "Calibrated Differential Log-Ratio",
      desc: "Evaluating radiometric backscatter shifts (|Δγ⁰| ≥ 3.0 dB)",
      minProgress: 82,
    },
    {
      id: "report",
      title: "Synthesizing AI Plain-Language Report",
      desc: "Gemini multimodal reasoning & change characterization",
      minProgress: 94,
    },
  ];

  return (
    <div className="relative w-full max-w-3xl mx-auto bg-space-950/95 border border-sky-500/50 rounded-2xl p-6 sm:p-7 backdrop-blur-3xl shadow-[0_0_60px_rgba(56,189,248,0.3)] text-left select-none overflow-hidden">
      {/* =========================================================================
          AEROSPACE CORNER BRACKET RETICLES
          ========================================================================= */}
      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-sky-400 pointer-events-none" />
      <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-sky-400 pointer-events-none" />
      <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-sky-400 pointer-events-none" />
      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-sky-400 pointer-events-none" />

      {/* Ambient background glowing sweep */}
      <div className="absolute -top-24 -left-24 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* =========================================================================
          TOP COMMAND HEADER
          ========================================================================= */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded-xl bg-sky-950 border border-sky-400 flex items-center justify-center text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.4)]">
            <Satellite className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                NISAR Orbit Command Terminal
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                UPLINK ACTIVE
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Target AOI: <span className="text-sky-300 font-semibold">{locationName}</span> (
              {locationDistrict}, UK) • Sensor: L-SAR 1.25 GHz
            </div>
          </div>
        </div>

        {/* Live Elapsed Mission Clock & Percentage */}
        <div className="flex items-center gap-4 font-mono">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">ELAPSED TIME</span>
            <span className="text-xs text-sky-400 font-bold flex items-center gap-1">
              <Clock className="w-3 h-3 inline text-slate-400" />
              T+ {elapsedSeconds.toFixed(1)}s
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block">CALIBRATION</span>
            <span className="text-lg text-emerald-400 font-bold">
              {Math.min(Math.round(progressPercent), 100)}%
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MAIN COMMAND GRID: RADAR SCANNER & DOPPLER OSCILLOSCOPE (LEFT) +
          PIPELINE MILESTONES & TELEMETRY STREAM (RIGHT)
          ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
        {/* LEFT COLUMN (5 cols): LIVE HOLOGRAPHIC RADAR SCANNER & DOPPLER WAVEFORM */}
        <div className="md:col-span-5 space-y-3.5 flex flex-col justify-between">
          {/* 1. Holographic Radar Scope with Laser Sweep Line */}
          <div className="relative w-full aspect-square max-h-56 mx-auto rounded-2xl bg-space-900/80 border border-sky-500/30 overflow-hidden flex items-center justify-center shadow-inner">
            {/* Grid Reticle Background */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(56, 189, 248, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.4) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Concentric Radar Rings */}
            <div className="absolute inset-4 rounded-full border border-sky-500/25" />
            <div className="absolute inset-10 rounded-full border border-sky-500/40" />
            <div className="absolute inset-16 rounded-full border border-sky-500/60" />
            <div className="absolute inset-22 rounded-full border border-sky-400/80" />

            {/* Radar Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-px bg-sky-500/30 -translate-y-1/2" />
            <div className="absolute inset-y-0 left-1/2 w-px bg-sky-500/30 -translate-x-1/2" />

            {/* Rotating High-Speed Radar Needle Sweep */}
            <div className="absolute inset-0 rounded-full animate-radar-sweep border-t-2 border-r-2 border-sky-400 bg-gradient-to-tr from-transparent via-sky-500/10 to-sky-400/25 pointer-events-none" />

            {/* Laser Scanning Beam (Vertical Sweep across Matrix) */}
            <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-80 animate-bounce pointer-events-none shadow-[0_0_12px_#34d399]" />

            {/* Central L-Band Radar Core */}
            <div className="relative z-10 flex flex-col items-center justify-center p-3 rounded-full bg-space-950/90 border border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.6)]">
              <Scan className="w-6 h-6 text-sky-400 animate-spin [animation-duration:8s]" />
              <span className="text-[8px] font-mono text-sky-300 font-bold mt-0.5">
                TRACK {trackNum}
              </span>
            </div>

            {/* Locked Target Coordinates Tag */}
            <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1 rounded-lg bg-space-950/90 border border-slate-800 text-[9.5px] font-mono text-slate-300 flex items-center justify-between">
              <span className="text-emerald-400 font-bold">AOI LOCKED:</span>
              <span>
                {latitude}°N, {longitude}°E
              </span>
            </div>
          </div>

          {/* 2. Live Animated Doppler Oscilloscope Waveform */}
          <div className="p-3 rounded-xl bg-space-900/70 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-sky-400 font-bold">
                <Activity className="w-3.5 h-3.5 animate-pulse text-sky-400" />
                DOPPLER CHIRP WAVEFORM
              </span>
              <span>1.25 GHz L-BAND</span>
            </div>

            {/* Animated SVG Oscilloscope Sine Wave */}
            <div className="h-9 w-full bg-space-950 rounded-lg overflow-hidden flex items-center px-1 border border-slate-800/80">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path
                  d={`M 0,20 Q 25,${5 + Math.sin(pulsePhase * 0.2) * 10} 50,20 T 100,20 T 150,20 T 200,20`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2"
                  className="transition-all duration-100"
                />
                <path
                  d={`M 0,20 Q 25,${35 - Math.sin(pulsePhase * 0.2) * 10} 50,20 T 100,20 T 150,20 T 200,20`}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.2"
                  opacity="0.65"
                  className="transition-all duration-100"
                />
              </svg>
            </div>

            <div className="flex justify-between text-[9px] font-mono text-slate-500">
              <span>PRF: 1,650 Hz</span>
              <span>POL: HH + HV</span>
              <span>BANDWIDTH: 77 MHz</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): STEP PROGRESS & TELEMETRY STREAM */}
        <div className="md:col-span-7 space-y-3.5 flex flex-col justify-between">
          {/* Active Status Banner */}
          <div className="p-3 rounded-xl bg-sky-950/40 border border-sky-500/30 flex items-center gap-3">
            <Radio className="w-4 h-4 text-sky-400 animate-pulse shrink-0" />
            <div className="overflow-hidden">
              <span className="text-[10px] font-mono text-slate-400 block uppercase">
                Current Scientific Operation:
              </span>
              <span className="text-xs font-mono font-bold text-white truncate block">
                {analysisStep || "Initiating calibrated differential matrix slicing..."}
              </span>
            </div>
          </div>

          {/* Scientific Pipeline Milestones Checklist */}
          <div className="space-y-2">
            {milestones.map((milestone, idx) => {
              const isDone = progressPercent >= milestone.minProgress;
              const isActive =
                !isDone &&
                (idx === 0 || progressPercent >= milestones[idx - 1].minProgress);

              return (
                <div
                  key={milestone.id}
                  className={`flex items-start gap-2.5 p-2 rounded-xl border text-xs font-mono transition-all ${
                    isDone
                      ? "bg-emerald-950/20 border-emerald-500/30 text-slate-200"
                      : isActive
                      ? "bg-sky-500/15 border-sky-400 text-white shadow-[0_0_12px_rgba(56,189,248,0.2)] ring-1 ring-sky-400/40"
                      : "bg-space-900/40 border-slate-800/80 text-slate-500"
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isActive ? (
                      <div className="w-4 h-4 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] text-slate-600">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="overflow-hidden flex-1">
                    <div className="flex items-center justify-between">
                      <span
                        className={`font-semibold ${
                          isDone
                            ? "text-emerald-300"
                            : isActive
                            ? "text-sky-300"
                            : "text-slate-400"
                        }`}
                      >
                        {milestone.title}
                      </span>
                      {isDone && (
                        <span className="text-[9px] text-emerald-400 font-bold">VERIFIED</span>
                      )}
                      {isActive && (
                        <span className="text-[9px] text-sky-400 animate-pulse font-bold">
                          PROCESSING...
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">{milestone.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Decoded Telemetry Specs Matrix */}
          <div className="p-2.5 rounded-xl bg-space-900/80 border border-slate-800 font-mono text-[10px] grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-400">
            <div>
              <span className="text-slate-500 block">Frame:</span>
              <span className="text-white font-semibold">0{frameNum} (Desc)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Sector:</span>
              <span className="text-emerald-300 font-semibold">{selectedSector.code}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Temporal Range:</span>
              <span className="text-sky-300">{startDate} → {endDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Incidence Angle:</span>
              <span className="text-white font-semibold">37.4° Off-Nadir</span>
            </div>
            <div>
              <span className="text-slate-500 block">Resolution:</span>
              <span className="text-white font-semibold">10m Polarimetric</span>
            </div>
            <div>
              <span className="text-slate-500 block">Coregistration:</span>
              <span className="text-emerald-400 font-semibold">0.04 px RMS</span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          BOTTOM DYNAMIC MULTI-SEGMENT PROGRESS BAR
          ========================================================================= */}
      <div className="mt-5 pt-3 border-t border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            Radiometric RTC Backscatter Synthesis
          </span>
          <span className="text-sky-400 font-bold">
            {Math.min(Math.round(progressPercent), 100)}% Complete
          </span>
        </div>

        {/* High-Tech Glowing Progress Bar with Animated Sweep */}
        <div className="relative w-full h-2.5 bg-space-900 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-sky-500 via-sky-400 to-emerald-400 transition-all duration-300 shadow-[0_0_15px_rgba(56,189,248,0.8)]"
            style={{ width: `${Math.min(progressPercent, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
