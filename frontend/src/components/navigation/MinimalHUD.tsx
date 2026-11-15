"use client";

import React, { useState } from "react";
import { useJourney, STAGES_ORDER } from "@/context/JourneyContext";
import { JourneyStage } from "@/types/journey";
import { soundController } from "@/lib/audio";
import {
  Volume2,
  VolumeX,
  Orbit,
  Activity,
  Zap,
  Globe2,
  MapPin,
  Sparkles,
  Layers,
  ChevronRight,
} from "lucide-react";

export default function MinimalHUD() {
  const {
    stage,
    setStage,
    isMuted,
    toggleAudio,
    isMockMode,
    toggleMockMode,
    backendOnline,
    reducedMotion,
    toggleReducedMotion,
    replayGalaxyIntro,
  } = useJourney();

  const stageLabels: Record<JourneyStage, { label: string; icon: React.ReactNode }> = {
    space: { label: "Space", icon: <Sparkles className="w-3 h-3" /> },
    solar_system: { label: "Solar System", icon: <Orbit className="w-3 h-3" /> },
    earth: { label: "Earth", icon: <Globe2 className="w-3 h-3" /> },
    india: { label: "India", icon: <MapPin className="w-3 h-3" /> },
    uttarakhand: { label: "Uttarakhand", icon: <MapPin className="w-3 h-3" /> },
    sector_selected: { label: "Sectors", icon: <Layers className="w-3 h-3" /> },
    analyzing: { label: "Analyzing", icon: <Activity className="w-3 h-3 animate-spin" /> },
    result: { label: "Result", icon: <Zap className="w-3 h-3" /> },
  };

  const currentStageIdx = STAGES_ORDER.indexOf(stage);

  // Keep space, solar system, earth, india, and uttarakhand views completely pure and integrated
  if (
    stage === "space" ||
    stage === "solar_system" ||
    stage === "earth" ||
    stage === "india" ||
    stage === "uttarakhand" ||
    stage === "sector_selected"
  ) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3 flex items-center justify-between pointer-events-none select-none">
        {/* Brand & Project Identity */}
        <div className="flex items-center gap-3 pointer-events-auto">
          <button
            onClick={() => {
              soundController.playPing(600, 0.1);
              replayGalaxyIntro();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-space-900/80 hover:bg-space-900 border border-slate-700/60 hover:border-sky-500/50 backdrop-blur-md transition-all shadow-lg group cursor-pointer"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 group-hover:animate-ping" />
            <div className="text-left">
              <span className="text-xs font-bold text-white tracking-wider uppercase block font-sans">
                Dancing with the SARs
              </span>
              <span className="text-[9px] text-sky-400 font-mono tracking-tight block">
                NASA Space Apps • NISAR Observation
              </span>
            </div>
          </button>
        </div>

        {/* Minimal Cosmic Journey Breadcrumb Trail */}
        <nav className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-space-900/85 border border-slate-700/60 backdrop-blur-md shadow-xl pointer-events-auto text-xs font-mono">
          {STAGES_ORDER.filter((s) => s !== "analyzing").map((s, idx) => {
            const stepIdx = STAGES_ORDER.indexOf(s);
            const isActive = stage === s;
            const isCompleted = currentStageIdx >= stepIdx;

            return (
              <React.Fragment key={s}>
                {idx > 0 && (
                  <ChevronRight className="w-3 h-3 text-slate-600 mx-0.5" />
                )}
                <button
                  onClick={() => {
                    soundController.playPing(700, 0.1);
                    if (s === "space") {
                      replayGalaxyIntro();
                    } else {
                      setStage(s);
                    }
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? "bg-sky-500/25 border border-sky-400/60 text-sky-200 font-semibold shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                      : isCompleted
                      ? "text-slate-300 hover:text-white hover:bg-slate-800/50"
                      : "text-slate-600 hover:text-slate-400"
                  }`}
                >
                  {stageLabels[s].icon}
                  <span>{stageLabels[s].label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Utility Toolbar Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Backend Status / Mock Switch */}
          <button
            onClick={toggleMockMode}
            className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-mono flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              isMockMode
                ? "bg-amber-950/80 border-amber-500/60 text-amber-300 hover:bg-amber-900/80"
                : backendOnline
                ? "bg-emerald-950/80 border-emerald-500/60 text-emerald-300 hover:bg-emerald-900/80"
                : "bg-slate-900/80 border-slate-700 text-slate-400 hover:text-white"
            }`}
            title="Toggle Live Backend vs Mock Simulation"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isMockMode
                  ? "bg-amber-400 animate-pulse"
                  : backendOnline
                  ? "bg-emerald-400"
                  : "bg-slate-500"
              }`}
            />
            <span className="hidden sm:inline">
              {isMockMode
                ? "Mock Mode"
                : backendOnline
                ? "API Live"
                : "Backend Offline"}
            </span>
          </button>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-lg ${
              !isMuted
                ? "bg-sky-950/80 border-sky-500/50 text-sky-300"
                : "bg-space-900/80 border-slate-700/60 text-slate-400 hover:text-white"
            }`}
            title={isMuted ? "Unmute subtle ambient audio" : "Mute ambient audio"}
          >
            {!isMuted ? (
              <Volume2 className="w-4 h-4 text-sky-400 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Global Mock Mode Banner Warning (When Enabled) */}
      {isMockMode && (
        <div className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/50 backdrop-blur-md text-[10px] font-mono text-amber-200 tracking-wider shadow-2xl flex items-center gap-2 pointer-events-auto">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
          <span>DEVELOPMENT / MOCK DATA MODE — NOT REAL NISAR ANALYSIS</span>
        </div>
      )}
    </>
  );
}
