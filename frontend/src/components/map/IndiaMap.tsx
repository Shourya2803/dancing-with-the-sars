"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/context/JourneyContext";
import { soundController } from "@/lib/audio";
import {
  MapPin,
  ArrowRight,
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Satellite,
  Compass,
  Radio,
  Sparkles,
  Layers,
} from "lucide-react";

export default function IndiaMap() {
  const { setStage } = useJourney();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [entryAnimated, setEntryAnimated] = useState<boolean>(false);

  // Cinematic smooth arrival animation from Earth orbit
  useEffect(() => {
    const timer = setTimeout(() => {
      setEntryAnimated(true);
    }, 40);
    return () => clearTimeout(timer);
  }, []);

  const handleDescendToUttarakhand = () => {
    soundController.playPing(950, 0.25);
    setStage("uttarakhand");
  };

  const handleBackToEarth = () => {
    soundController.playPing(750, 0.15);
    setStage("earth");
  };

  // Mouse pan and drag handling
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      // Zoom in
      setZoomLevel((z) => {
        const next = Math.min(z + 0.16, 3.2);
        if (next > 2.6) {
          handleDescendToUttarakhand();
        }
        return next;
      });
    } else {
      setZoomLevel((z) => Math.max(z - 0.16, 0.8));
    }
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className="relative w-full h-full bg-space-950 overflow-hidden select-none font-sans"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* 1. DEEP SPACE / SATELLITE ORBITAL BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-space-950 to-black pointer-events-none" />

      {/* Atmospheric Cloud Entry Mist (dissolves in 800ms on arrival) */}
      <div
        className={`absolute inset-0 bg-sky-900/20 backdrop-blur-sm pointer-events-none transition-opacity duration-1000 ${
          entryAnimated ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. TOP CONTEXT HEADER & TELEMETRY */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-3 pointer-events-auto">
        <button
          onClick={handleBackToEarth}
          className="px-3.5 py-1.5 rounded-xl bg-space-900/90 border border-slate-700/80 hover:border-sky-400 text-xs font-mono text-slate-300 hover:text-white flex items-center gap-1.5 backdrop-blur-xl shadow-xl transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />
          <span>EARTH GLOBE</span>
        </button>

        <div className="px-3.5 py-1.5 rounded-xl bg-space-900/90 border border-sky-500/40 backdrop-blur-xl text-xs font-mono text-sky-300 flex items-center gap-2 shadow-xl">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold text-white tracking-wide">REPUBLIC OF INDIA</span>
          <span className="hidden sm:inline text-slate-400">• Topographic Satellite Relief</span>
        </div>

        {/* Observation Status */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-950/70 border border-sky-500/40 backdrop-blur-xl text-[11px] font-mono text-sky-300">
          <Satellite className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
          <span>TARGET LOCK: UTTARAKHAND</span>
          <span className="text-emerald-400 font-bold">• NISAR TRACK 106</span>
        </div>
      </div>

      {/* 3. FLOATING VIEW CONTROLS (TOP RIGHT) */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2.5 pointer-events-auto">
        {/* Zoom & Reset Toolbar */}
        <div className="bg-space-900/90 border border-slate-700/80 rounded-xl backdrop-blur-xl p-1 flex items-center gap-1 shadow-2xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3.2))}
            className="p-1.5 text-slate-300 hover:text-sky-300 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.8))}
            className="p-1.5 text-slate-300 hover:text-sky-300 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 text-slate-300 hover:text-sky-300 hover:bg-slate-800/80 rounded-lg transition-colors cursor-pointer"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Observation Mission Card */}
        <div className="p-3 rounded-xl bg-space-900/90 border border-sky-500/40 backdrop-blur-xl shadow-2xl text-xs space-y-1.5 max-w-[220px]">
          <div className="text-[11px] font-mono text-sky-400 uppercase tracking-widest flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
            <span>Target Acquisition</span>
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Target sector: <strong className="text-sky-300 font-semibold">Uttarakhand</strong>. Click highlighted region or zoom in to enter 13-district radar analysis.
          </p>
        </div>
      </div>

      {/* 4. MAIN 3D TOPOGRAPHIC RELIEF MAP CANVAS (VIEWBOX: 0 0 1524 1335) */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          className={`w-full h-full max-w-5xl max-h-[85vh] transition-all duration-700 ease-out flex items-center justify-center ${
            entryAnimated ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          <svg
            viewBox="0 0 1524 1335"
            className="w-full h-full max-h-[85vh] filter-[drop-shadow(0_20px_45px_rgba(0,0,0,0.85))] select-none"
          >
            <defs>
              {/* Outer Ambient Atmosphere Aura */}
              <filter id="indiaAura" x="-10%" y="-10%" width="120%" height="120%">
                <feGaussianBlur stdDeviation="16" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.05
                          0 0 0 0 0.45
                          0 0 0 0 0.85
                          0 0 0 0.45 0"
                  result="coloredBlur"
                />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Luminous Glow for Uttarakhand Sector */}
              <filter id="ukGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.05
                          0 0 0 0 0.85
                          0 0 0 0 0.95
                          0 0 0 0.8 0"
                  result="coloredBlur"
                />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Radiant Gradient for Uttarakhand */}
              <linearGradient id="ukGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.5" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.45" />
              </linearGradient>

              {/* Shadow gradient for 3D bottom projection */}
              <radialGradient id="reliefShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 0, 0, 0.65)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* Ambient Maritime Coordinate Labels in Water Area */}
            <g className="pointer-events-none opacity-30">
              <text x="140" y="850" fill="#38bdf8" fontSize="18" fontFamily="monospace" letterSpacing="0.4em" fontWeight="bold">
                ARABIAN SEA
              </text>
              <text x="1100" y="870" fill="#38bdf8" fontSize="18" fontFamily="monospace" letterSpacing="0.4em" fontWeight="bold">
                BAY OF BENGAL
              </text>
              <text x="620" y="1300" fill="#38bdf8" fontSize="18" fontFamily="monospace" letterSpacing="0.4em" fontWeight="bold">
                INDIAN OCEAN
              </text>
            </g>

            {/* 3D Drop Shadow Underneath the Relieved Model */}
            <ellipse cx="650" cy="1160" rx="380" ry="90" fill="url(#reliefShadow)" opacity="0.8" />

            {/* REALISTIC 3D TOPOGRAPHIC RELIEF MAP OF INDIA (Matching User Reference Image) */}
            <image
              href="/india_3d_relief_hd.png"
              x="0"
              y="0"
              width="1524"
              height="1335"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none"
            />

            {/* ONLY UTTARAKHAND HIGHLIGHTED: Northern Himalayan Ridge Sector */}
            <g
              id="uttarakhand-sector"
              onClick={handleDescendToUttarakhand}
              onMouseEnter={() => {
                setIsHovered(true);
                soundController.playPing(750, 0.08);
              }}
              onMouseLeave={() => setIsHovered(false)}
              className="cursor-pointer"
            >
              {/* Highlighted Uttarakhand Boundary Shape */}
              <path
                d="M 535 245 L 585 230 L 630 265 L 635 330 L 595 345 L 530 325 L 525 275 Z"
                fill="url(#ukGradient)"
                stroke="#38bdf8"
                strokeWidth={isHovered ? "3.5" : "2.4"}
                strokeLinejoin="round"
                filter="url(#ukGlow)"
                className="transition-all duration-300"
              />

              {/* Pulsing Target Radar Beacon Rings over Center (580, 285) */}
              <g transform="translate(580, 285)" className="pointer-events-none">
                {/* Concentric Pulsing Radar Rings */}
                <circle cx="0" cy="0" r="22" className="fill-none stroke-sky-300 stroke-[2] opacity-85 animate-ping" />
                <circle cx="0" cy="0" r="38" className="fill-none stroke-sky-400/80 stroke-[1.5] stroke-dasharray-[4,4]" />
                <circle cx="0" cy="0" r="54" className="fill-none stroke-emerald-400/60 stroke-[1] stroke-dasharray-[5,5]" />
                <circle cx="0" cy="0" r="7" className="fill-emerald-400 shadow-[0_0_12px_#10b981]" />
                <circle cx="0" cy="0" r="3" className="fill-white" />

                {/* Target Reticle Crosshairs */}
                <line x1="-65" y1="0" x2="-16" y2="0" className="stroke-sky-300 stroke-[1.8]" />
                <line x1="16" y1="0" x2="65" y2="0" className="stroke-sky-300 stroke-[1.8]" />
                <line x1="0" y1="-65" x2="0" y2="-16" className="stroke-sky-300 stroke-[1.8]" />
                <line x1="0" y1="16" x2="0" y2="65" className="stroke-sky-300 stroke-[1.8]" />

                {/* Tactical Callout HUD Pin */}
                <g transform="translate(68, -48)">
                  <rect
                    x="0"
                    y="0"
                    width="235"
                    height="48"
                    rx="10"
                    className="fill-space-900/95 stroke-sky-400 stroke-[1.4] filter-[drop-shadow(0_4px_16px_rgba(0,0,0,0.9))]"
                  />
                  <text x="14" y="21" fill="#38bdf8" fontSize="13" fontFamily="monospace" fontWeight="bold">
                    🎯 UTTARAKHAND
                  </text>
                  <text x="14" y="38" fill="#94a3b8" fontSize="10" fontFamily="monospace">
                    HIMALAYAN NISAR SECTOR • CLICK TO DIVE
                  </text>
                  {/* Connecting Leader Line */}
                  <line x1="0" y1="24" x2="-68" y2="48" className="stroke-sky-400 stroke-[1.6]" />
                </g>
              </g>
            </g>
          </svg>
        </div>
      </div>

      {/* 5. ACTIVE TARGET TELEMETRY CARD (BOTTOM LEFT) */}
      <div className="absolute bottom-6 left-6 z-20 max-w-sm pointer-events-auto hidden sm:block">
        <div className="p-4 rounded-2xl bg-space-900/90 border border-sky-500/40 backdrop-blur-2xl shadow-[0_0_30px_rgba(15,23,42,0.95)] space-y-2.5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">
                Uttarakhand (उत्तराखण्ड)
              </h3>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950/80 border border-sky-500/40 text-sky-300">
              Himalayas
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] block font-mono">CAPITAL</span>
              <span className="text-slate-200 font-semibold">Dehradun / Gairsain</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] block font-mono">NISAR ORBIT</span>
              <span className="text-emerald-400 font-mono font-semibold">Track 106 Target</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-300 bg-space-950/60 p-2 rounded-lg border border-slate-800/80 leading-relaxed">
            <strong className="text-sky-300 font-mono">OBSERVATION:</strong> Active L-band & S-band SAR monitoring for glacial lake outburst floods (GLOF), landslide slip rates, and Chamoli hazard zones.
          </div>
        </div>
      </div>

      {/* 6. BOTTOM ACTION & DIVE CALL-TO-ACTION CARD (CENTER BOTTOM) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4 pointer-events-auto">
        <div className="p-3.5 sm:p-4 rounded-2xl bg-space-900/95 border border-sky-500/60 backdrop-blur-2xl shadow-[0_0_35px_rgba(14,165,233,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3.5 w-3.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500" />
            </span>
            <div className="text-left">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-400" />
                <span>Uttarakhand Target Sector</span>
              </div>
              <div className="text-[11px] text-slate-300">
                13 Himalayan Districts • High-Res SAR
              </div>
            </div>
          </div>

          <button
            onClick={handleDescendToUttarakhand}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 via-blue-600 to-emerald-500 hover:from-sky-400 hover:to-emerald-400 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.5)] flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>ENTER UTTARAKHAND MAP</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
