"use client";

import React from "react";
import { PlanetData } from "@/types/journey";
import { SOLAR_SYSTEM_PLANETS } from "@/lib/constants";
import { useJourney } from "@/context/JourneyContext";
import { soundController } from "@/lib/audio";
import { X, ArrowRight, Globe2, Sparkles, Orbit } from "lucide-react";

interface PlanetModalProps {
  planet: PlanetData | null;
  onClose: () => void;
}

export default function PlanetModal({ planet, onClose }: PlanetModalProps) {
  const { setStage } = useJourney();

  if (!planet) return null;

  const handleGuideToEarth = () => {
    soundController.playPing(900, 0.15);
    onClose();
    setStage("earth");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm select-none animate-fadeIn">
      <div className="relative w-full max-w-md bg-space-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 text-slate-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white border shadow-lg"
            style={{
              backgroundColor: planet.color,
              borderColor: `${planet.color}88`,
            }}
          >
            <Orbit className="w-5 h-5 drop-shadow" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">{planet.name}</h3>
            <span className="text-xs text-sky-400 font-mono">
              Solar System Planetary Body
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {planet.details}
        </p>

        <div className="p-3 rounded-xl bg-space-950 border border-slate-800 text-xs space-y-1 mb-5">
          <div className="text-slate-400 font-mono text-[10px] uppercase">
            Radar Observation Scope
          </div>
          <p className="text-slate-300 leading-relaxed text-[11px]">
            The NISAR observatory is dedicated exclusively to monitoring dynamic
            changes on <strong>Earth</strong>, specifically focused on cryosphere,
            tectonics, and ecosystems like Uttarakhand, India.
          </p>
        </div>

        <button
          onClick={handleGuideToEarth}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-semibold text-xs tracking-wide transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
        >
          <Globe2 className="w-4 h-4" />
          <span>CONTINUE JOURNEY TO EARTH</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
