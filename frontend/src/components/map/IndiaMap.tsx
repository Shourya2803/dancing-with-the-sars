"use client";

import React, { useState, useEffect } from "react";
import { useJourney } from "@/context/JourneyContext";
import { soundController } from "@/lib/audio";
import { ArrowLeft } from "lucide-react";

export default function IndiaMap() {
  const { setStage } = useJourney();
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [entryAnimated, setEntryAnimated] = useState<boolean>(false);

  // Smooth arrival animation from Earth orbit
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
        if (next > 2.5) {
          handleDescendToUttarakhand();
        }
        return next;
      });
    } else {
      setZoomLevel((z) => Math.max(z - 0.16, 0.8));
    }
  };

  return (
    <div
      className="relative w-full h-full bg-space-950 overflow-hidden select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      style={{ cursor: isDragging ? "grabbing" : "grab" }}
    >
      {/* 1. DEEP SPACE BACKDROP */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-space-950 to-black pointer-events-none" />

      {/* Atmospheric Cloud Entry Mist (dissolves on arrival) */}
      <div
        className={`absolute inset-0 bg-sky-900/20 backdrop-blur-sm pointer-events-none transition-opacity duration-1000 ${
          entryAnimated ? "opacity-0" : "opacity-100"
        }`}
      />

      {/* 2. MINIMALIST BACK TO EARTH ICON BUTTON (Pure icon, zero text clutter) */}
      <button
        onClick={handleBackToEarth}
        className="absolute top-4 left-4 z-30 p-2.5 rounded-xl bg-space-900/70 hover:bg-space-900/95 border border-slate-700/60 hover:border-sky-400 text-slate-300 hover:text-white backdrop-blur-xl transition-all shadow-xl cursor-pointer"
        aria-label="Back to Earth"
      >
        <ArrowLeft className="w-4 h-4 text-sky-400" />
      </button>

      {/* 3. 3D TOPOGRAPHIC RELIEF MAP CANVAS (100% PURE & TEXT-FREE) */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <div
          className={`w-full h-full max-w-5xl max-h-[90vh] transition-all duration-700 ease-out flex items-center justify-center ${
            entryAnimated ? "opacity-100 scale-100" : "opacity-0 scale-110"
          }`}
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: "center center",
          }}
        >
          <svg
            viewBox="0 0 1524 1335"
            className="w-full h-full max-h-[90vh] filter-[drop-shadow(0_20px_45px_rgba(0,0,0,0.85))] select-none"
          >
            <defs>
              {/* Luminous Glow for Uttarakhand Sector Boundary */}
              <filter id="ukGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0 0 0 0 0.05
                          0 0 0 0 0.85
                          0 0 0 0 0.95
                          0 0 0 0.85 0"
                  result="coloredBlur"
                />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>

              {/* Radiant Gradient for Uttarakhand Interior */}
              <linearGradient id="ukGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
                <stop offset="50%" stopColor="#0284c7" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.35" />
              </linearGradient>

              {/* Shadow gradient for 3D bottom projection */}
              <radialGradient id="reliefShadow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="rgba(0, 0, 0, 0.65)" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* 3D Drop Shadow Underneath the Relief Model */}
            <ellipse cx="650" cy="1160" rx="380" ry="90" fill="url(#reliefShadow)" opacity="0.8" />

            {/* REALISTIC 3D TOPOGRAPHIC RELIEF MAP OF INDIA */}
            <image
              href="/india_3d_relief_hd.png"
              x="0"
              y="0"
              width="1524"
              height="1335"
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none"
            />

            {/* UTTARAKHAND STATE BORDER & ACTIVE RADAR BEACON (EXACT ACCORDING TO MAP) */}
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
              {/* Authentic Geographic Boundary of Uttarakhand matching the 3D terrain */}
              <path
                d="M 710.0,338.7 L 708.1,345.3 L 695.5,338.7 L 678.2,344.1 L 676.8,340.3 L 658.0,332.7 L 649.6,333.8 L 639.1,328.0 L 645.6,319.1 L 634.9,318.6 L 621.9,309.0 L 613.7,307.8 L 599.6,323.4 L 595.7,315.8 L 590.9,319.0 L 586.7,317.5 L 582.1,310.5 L 587.6,288.9 L 568.4,285.0 L 578.5,277.2 L 569.9,265.5 L 575.4,243.7 L 596.5,232.5 L 602.4,235.8 L 618.3,232.5 L 623.7,236.6 L 629.3,234.8 L 623.0,228.6 L 627.6,216.5 L 631.6,217.4 L 650.5,234.7 L 654.8,233.7 L 660.3,237.6 L 666.8,233.0 L 672.7,233.1 L 694.5,241.2 L 695.2,249.5 L 715.1,250.6 L 721.6,260.3 L 722.3,263.4 L 719.6,286.2 L 718.9,287.2 L 710.6,296.7 L 698.6,308.3 L 704.8,320.9 L 710.0,325.8 L 726.8,338.7 Z"
                fill="url(#ukGradient)"
                stroke="#38bdf8"
                strokeWidth={isHovered ? "3.5" : "2.5"}
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#ukGlow)"
                className="transition-all duration-300"
              />

              {/* Concentric Pulsing Radar Beacon Center (650, 284) */}
              <g transform="translate(650, 284)" className="pointer-events-none">
                <circle cx="0" cy="0" r="14" className="fill-none stroke-sky-300 stroke-[2] opacity-80 animate-ping" />
                <circle cx="0" cy="0" r="26" className="fill-none stroke-sky-400/80 stroke-[1.2] stroke-dasharray-[3,3]" />
                <circle cx="0" cy="0" r="4.5" className="fill-emerald-400 shadow-[0_0_10px_#10b981]" />
                <circle cx="0" cy="0" r="2" className="fill-white" />

                {/* Tactical Reticle Crosshairs */}
                <line x1="-30" y1="0" x2="-8" y2="0" className="stroke-sky-300 stroke-[1.5]" />
                <line x1="8" y1="0" x2="30" y2="0" className="stroke-sky-300 stroke-[1.5]" />
                <line x1="0" y1="-30" x2="0" y2="-8" className="stroke-sky-300 stroke-[1.5]" />
                <line x1="0" y1="8" x2="0" y2="30" className="stroke-sky-300 stroke-[1.5]" />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
