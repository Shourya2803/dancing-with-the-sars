"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { useJourney } from "@/context/JourneyContext";
import { UTTARAKHAND_DISTRICTS } from "@/lib/constants";
import { DistrictDetail } from "@/types/api";
import { soundController } from "@/lib/audio";
import {
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Info,
  Sliders,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";

interface UttarakhandMapProps {
  showResultLayer?: boolean;
}

export default function UttarakhandMap({ showResultLayer = false }: UttarakhandMapProps) {
  const {
    selectedDistrict,
    setSelectedDistrict,
    currentDistrictDetail,
    stage,
    setStage,
    analysisResult,
  } = useJourney();

  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictDetail | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState<number>(0.85);
  const [visibleLayers, setVisibleLayers] = useState<{
    districts: boolean;
    labels: boolean;
    nisarTrack: boolean;
    changeOverlay: boolean;
    contours: boolean;
  }>({
    districts: true,
    labels: true,
    nisarTrack: true,
    changeOverlay: true,
    contours: true,
  });

  const svgRef = useRef<SVGSVGElement>(null);

  // Geographic Bounding Box for Uttarakhand
  // [minLon: 77.4, minLat: 28.6, maxLon: 81.2, maxLat: 31.6]
  const bbox = useMemo(() => ({
    minLon: 77.4,
    maxLon: 81.2,
    minLat: 28.6,
    maxLat: 31.6,
  }), []);

  // Convert Lon/Lat into SVG ViewBox coordinates [0, 0, 1000, 800]
  const projectCoord = (lon: number, lat: number): [number, number] => {
    const width = 1000;
    const height = 800;
    const padding = 40;

    const x = padding + ((lon - bbox.minLon) / (bbox.maxLon - bbox.minLon)) * (width - padding * 2);
    // Invert Y because latitude increases northward while SVG Y increases downward
    const y = height - padding - ((lat - bbox.minLat) / (bbox.maxLat - bbox.minLat)) * (height - padding * 2);
    return [x, y];
  };

  const getDistrictPath = (district: DistrictDetail): string => {
    if (!district.geometry || !district.geometry.coordinates) return "";
    const coords = district.geometry.coordinates;
    const ring = (Array.isArray(coords[0]) && Array.isArray(coords[0][0]))
      ? (coords[0] as unknown as number[][])
      : (coords as unknown as number[][]);
    return ring
      .map((coord: number[], idx: number) => {
        const [x, y] = projectCoord(coord[0], coord[1]);
        return `${idx === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(" ") + " Z";
  };

  // Pan & Drag controls
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

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleSelectDistrict = (district: DistrictDetail) => {
    setSelectedDistrict(district.id);
    soundController.playPing(800, 0.12);
    if (stage === "uttarakhand") {
      setStage("sector_selected");
    }
  };

  return (
    <div className="relative w-full h-full bg-space-950 overflow-hidden select-none">
      {/* Top Map Context Banner */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
        <div className="px-3 py-1.5 rounded-lg bg-space-900/90 border border-sky-500/30 backdrop-blur-md text-xs font-mono text-sky-300 flex items-center gap-2 shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>INDIA • UTTARAKHAND GEOGRAPHIC DOMAIN • EPSG:32644 (UTM 44N)</span>
        </div>

        {visibleLayers.nisarTrack && (
          <div className="px-3 py-1.5 rounded-lg bg-space-900/90 border border-indigo-500/30 backdrop-blur-md text-xs font-mono text-indigo-300 hidden md:flex items-center gap-1.5 shadow-lg">
            <span>NISAR TRACK 106 (DESCENDING) • FRAME 073 / 074</span>
          </div>
        )}
      </div>

      {/* India National Context Locator Map */}
      <div className="absolute top-4 right-16 z-20 hidden md:block select-none">
        <div className="p-2.5 rounded-xl bg-space-900/90 border border-sky-500/40 backdrop-blur-xl shadow-2xl flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-sky-400 uppercase tracking-wider">
            <MapPin className="w-3 h-3 text-sky-400" />
            <span>India • Uttarakhand</span>
          </div>
          <svg
            viewBox="0 0 100 120"
            className="w-20 h-24 stroke-sky-400/60 fill-slate-800/80 drop-shadow-[0_0_8px_rgba(56,189,248,0.3)]"
          >
            {/* National Silhouette of India */}
            <path
              d="M 45 6 L 55 12 L 58 19 L 52 24 L 56 28 L 68 28 L 76 33 L 88 32 L 95 38 L 88 44 L 78 40 L 72 45 L 68 44 L 62 48 L 60 55 L 54 62 L 50 75 L 45 95 L 48 108 L 46 115 L 44 112 L 38 90 L 32 75 L 26 65 L 20 62 L 15 55 L 10 52 L 8 45 L 14 42 L 22 45 L 26 40 L 32 38 L 36 28 L 38 20 L 42 12 Z"
              strokeWidth="1.2"
            />
            {/* Uttarakhand Region Highlighted in the Northern Himalayas */}
            <path
              d="M 44 21 L 52 23 L 50 29 L 43 27 Z"
              className="fill-sky-400 stroke-sky-200 stroke-[1.5] animate-pulse"
            />
            {/* Target radar beacon ping */}
            <circle cx="47.5" cy="25" r="3" className="fill-emerald-400 opacity-75 animate-ping" />
            <circle cx="47.5" cy="25" r="1.5" className="fill-white" />
          </svg>
          <div className="text-[9px] font-mono text-slate-300">
            Himalayan Crown
          </div>
        </div>
      </div>

      {/* Floating Map Controls Toolbar */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <div className="bg-space-900/90 border border-slate-700/60 rounded-lg backdrop-blur-md p-1 flex flex-col gap-1 shadow-xl">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.3, 3.5))}
            className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.3, 0.8))}
            className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-2 text-slate-300 hover:text-sky-300 hover:bg-slate-800/60 rounded transition-colors"
            title="Reset Map View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Layer Visibility Toggle Box */}
        <div className="bg-space-900/90 border border-slate-700/60 rounded-lg backdrop-blur-md p-2 shadow-xl text-xs space-y-1.5">
          <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Layers className="w-3.5 h-3.5 text-sky-400" /> Layers
          </div>
          <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer">
            <span>Track 106 Orbit</span>
            <input
              type="checkbox"
              checked={visibleLayers.nisarTrack}
              onChange={(e) =>
                setVisibleLayers((v) => ({ ...v, nisarTrack: e.target.checked }))
              }
              className="accent-sky-400 w-3.5 h-3.5 cursor-pointer"
            />
          </label>
          <label className="flex items-center justify-between gap-3 text-slate-300 hover:text-white cursor-pointer">
            <span>District Labels</span>
            <input
              type="checkbox"
              checked={visibleLayers.labels}
              onChange={(e) =>
                setVisibleLayers((v) => ({ ...v, labels: e.target.checked }))
              }
              className="accent-sky-400 w-3.5 h-3.5 cursor-pointer"
            />
          </label>

          {showResultLayer && (
            <>
              <label className="flex items-center justify-between gap-3 text-emerald-300 hover:text-emerald-200 cursor-pointer pt-1 border-t border-slate-800">
                <span>Δγ⁰ Change Raster</span>
                <input
                  type="checkbox"
                  checked={visibleLayers.changeOverlay}
                  onChange={(e) =>
                    setVisibleLayers((v) => ({ ...v, changeOverlay: e.target.checked }))
                  }
                  className="accent-emerald-400 w-3.5 h-3.5 cursor-pointer"
                />
              </label>

              {/* Opacity Slider */}
              <div className="pt-1.5 flex flex-col gap-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>Layer Opacity</span>
                  <span>{Math.round(opacity * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-28 accent-sky-400 h-1 bg-slate-700 rounded cursor-pointer"
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Interactive Geospatial SVG Canvas */}
      <svg
        ref={svgRef}
        viewBox="0 0 1000 800"
        className="w-full h-full cursor-grab active:cursor-grabbing transition-transform"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <defs>
          {/* Subtle Grid Pattern */}
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#0f1d38"
              strokeWidth="0.8"
            />
          </pattern>

          {/* Gradients */}
          <radialGradient id="himalayanRidge" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#070e1e" stopOpacity="0.1" />
          </radialGradient>

          {/* Change Area Pattern for Negative Backscatter */}
          <pattern id="negChangePat" width="8" height="8" patternUnits="userSpaceOnUse">
            <path d="M 0 8 L 8 0 M 0 0 L 8 8" stroke="#f43f5e" strokeWidth="1.2" opacity="0.6" />
          </pattern>

          {/* Change Area Pattern for Positive Backscatter */}
          <pattern id="posChangePat" width="8" height="8" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.5" fill="#10b981" opacity="0.7" />
          </pattern>
        </defs>

        {/* Zoom & Pan Group Container */}
        <g
          transform={`translate(${panOffset.x + (1 - zoomLevel) * 200}, ${
            panOffset.y + (1 - zoomLevel) * 160
          }) scale(${zoomLevel})`}
        >
          {/* Coordinate Background Grid */}
          <rect x="-200" y="-200" width="1400" height="1200" fill="url(#grid)" />

          {/* NISAR Orbital Swath Corridor (Track 106 Descending Corridor) */}
          {visibleLayers.nisarTrack && (
            <g opacity="0.25">
              <polygon
                points="420,-50 820,-50 680,850 280,850"
                fill="#38bdf8"
                opacity="0.08"
              />
              <line
                x1="620"
                y1="-50"
                x2="480"
                y2="850"
                stroke="#38bdf8"
                strokeWidth="1.8"
                strokeDasharray="6,6"
              />
              <text
                x="560"
                y="30"
                fill="#38bdf8"
                fontSize="11"
                fontFamily="monospace"
                letterSpacing="2"
                transform="rotate(12, 560, 30)"
              >
                NISAR FLIGHT GROUND TRACK 106 ➔
              </text>
            </g>
          )}

          {/* All 13 Uttarakhand Districts */}
          {Object.values(UTTARAKHAND_DISTRICTS).map((district) => {
            const isSelected = selectedDistrict === district.id;
            const isHovered = hoveredDistrict?.id === district.id;
            const path = getDistrictPath(district);
            const [cx, cy] = projectCoord(district.centroid.lon, district.centroid.lat);

            return (
              <g
                key={district.id}
                className="transition-colors duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredDistrict(district)}
                onMouseLeave={() => setHoveredDistrict(null)}
                onClick={() => handleSelectDistrict(district)}
              >
                {/* District Boundary Polygon */}
                <path
                  d={path}
                  fill={
                    isSelected
                      ? "#0369a1"
                      : isHovered
                      ? "#1e3a5f"
                      : "#0b162c"
                  }
                  fillOpacity={isSelected ? 0.75 : isHovered ? 0.6 : 0.4}
                  stroke={
                    isSelected
                      ? "#38bdf8"
                      : isHovered
                      ? "#7dd3fc"
                      : "#1e293b"
                  }
                  strokeWidth={isSelected ? 2.5 : isHovered ? 1.8 : 1.2}
                />

                {/* District Centroid Anchor Point */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 4.5 : 2.8}
                  fill={isSelected ? "#38bdf8" : "#94a3b8"}
                  stroke="#020408"
                  strokeWidth="1.5"
                />

                {/* District Name Label */}
                {visibleLayers.labels && (
                  <text
                    x={cx}
                    y={cy - 8}
                    textAnchor="middle"
                    fill={isSelected ? "#e0f2fe" : "#94a3b8"}
                    fontSize={isSelected ? "13" : "11"}
                    fontWeight={isSelected ? "600" : "400"}
                    letterSpacing="0.5"
                    className="pointer-events-none select-none drop-shadow"
                  >
                    {district.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Scientific Change Result Overlay (When in Result Mode) */}
          {showResultLayer && visibleLayers.changeOverlay && (
            <g opacity={opacity} className="transition-opacity duration-300">
              {/* Highlight AOI Sector Boundary */}
              {(() => {
                const currentDist = UTTARAKHAND_DISTRICTS[selectedDistrict] || UTTARAKHAND_DISTRICTS["chamoli"];
                const [cx, cy] = projectCoord(currentDist.centroid.lon, currentDist.centroid.lat);

                return (
                  <g>
                    {/* Simulated verified threshold change polygons */}
                    {/* 1. Negative backscatter drop (water/landslide scar): Delta Gamma <= -3.0 dB */}
                    <path
                      d={`M ${cx - 30} ${cy - 20} Q ${cx - 10} ${cy - 45} ${cx + 15} ${cy - 25} Q ${cx + 40} ${cy} ${cx + 20} ${cy + 25} Q ${cx - 15} ${cy + 35} ${cx - 30} ${cy - 20} Z`}
                      fill="url(#negChangePat)"
                      stroke="#f43f5e"
                      strokeWidth="2"
                    />

                    {/* 2. Positive backscatter increase (debris/talus roughness): Delta Gamma >= +3.0 dB */}
                    <path
                      d={`M ${cx + 25} ${cy - 10} Q ${cx + 55} ${cy - 30} ${cx + 70} ${cy + 10} Q ${cx + 45} ${cy + 35} ${cx + 25} ${cy - 10} Z`}
                      fill="url(#posChangePat)"
                      stroke="#10b981"
                      strokeWidth="2"
                    />

                    {/* Calibrated Pulse Beacon at Epicenter */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r="6"
                      fill="#38bdf8"
                      className="animate-ping"
                      opacity="0.8"
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r="4"
                      fill="#38bdf8"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </g>
                );
              })()}
            </g>
          )}
        </g>
      </svg>

      {/* District Hover Metadata Card */}
      {hoveredDistrict && (
        <div className="absolute bottom-6 left-6 z-20 bg-space-900/95 border border-sky-500/40 rounded-xl p-3.5 backdrop-blur-md shadow-2xl text-xs max-w-xs transition-all pointer-events-none">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <span className="font-semibold text-white text-sm">
              {hoveredDistrict.name}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800">
              {hoveredDistrict.division} Division
            </span>
          </div>
          <div className="space-y-1 text-slate-300 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Headquarters:</span>
              <span>{hoveredDistrict.headquarters}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Total Area:</span>
              <span>{hoveredDistrict.area_km2.toLocaleString()} km²</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Centroid:</span>
              <span>
                {hoveredDistrict.centroid.lat}°N, {hoveredDistrict.centroid.lon}°E
              </span>
            </div>
            <div className="flex justify-between text-sky-400 pt-1">
              <span>Primary NISAR Orbit:</span>
              <span>
                Track {hoveredDistrict.default_nisar_track || 106} • Frame{" "}
                {hoveredDistrict.default_nisar_frame || 73}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Scientifically Calibrated Legend */}
      <div className="absolute bottom-6 right-6 z-20 bg-space-900/90 border border-slate-700/60 rounded-xl p-3 backdrop-blur-md shadow-2xl text-xs">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-sky-400" />
          <span>Calibrated Radar Legend (Δγ⁰)</span>
        </div>
        <div className="space-y-1.5 font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-rose-500/70 border border-rose-400" />
            <span className="text-slate-300">
              Δγ⁰ ≤ -3.0 dB (Smoothing / Inundation)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-slate-700/60 border border-slate-600" />
            <span className="text-slate-400">|Δγ⁰| &lt; 3.0 dB (Stable Surface)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded bg-emerald-500/70 border border-emerald-400" />
            <span className="text-slate-300">
              Δγ⁰ ≥ +3.0 dB (Roughness / Debris)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
