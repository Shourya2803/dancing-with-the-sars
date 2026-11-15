"use client";

import React, { useState, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  Layers,
  Box,
  Eye,
  Maximize2,
  Compass,
  ArrowUpRight,
  Sparkles,
  Mountain,
  Snowflake,
  Droplets,
  Building2,
  ZoomIn,
} from "lucide-react";

interface Geological3DBlockProps {
  sectorId?: string;
  locationName?: string;
}

/**
 * 3D Geological Block Mesh with Stratified Lithology and Tectonic Fault Slip
 */
function StrataBlock({ sectorId }: { sectorId?: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  // Slow continuous rotation
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
    if (waveRef.current) {
      waveRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05;
    }
  });

  const isGlacier = sectorId === "glacier" || sectorId === "cryosphere";
  const isFlood = sectorId === "flood" || sectorId === "inundation";
  const isSubsidence = sectorId === "urban" || sectorId === "subsidence";

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* =========================================================================
          LAYER 1: TOP RELIEF & VEGETATION / ICE CRUST
          ========================================================================= */}
      {/* Horst Block (Upthrown Left Mountain) */}
      <mesh position={[-0.9, 1.15, 0]}>
        <boxGeometry args={[1.7, 0.45, 2.6]} />
        <meshStandardMaterial
          color={isGlacier ? "#e0f2fe" : isFlood ? "#334155" : "#4d7c0f"}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Graben Block (Downthrown Right Valley / Basin) */}
      <mesh position={[0.95, 0.85, 0]}>
        <boxGeometry args={[1.8, 0.35, 2.6]} />
        <meshStandardMaterial
          color={isGlacier ? "#93c5fd" : isFlood ? "#0284c7" : "#65a30d"}
          roughness={0.85}
          metalness={0.1}
        />
      </mesh>

      {/* Pulsing Radar Microwave Scanning Wave Plane */}
      <mesh ref={waveRef} position={[0, 1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
          wireframe
        />
      </mesh>

      {/* =========================================================================
          LAYER 2: UPPER SEDIMENTARY STRATA (Sandstone / Siltstone / Till)
          ========================================================================= */}
      <mesh position={[-0.9, 0.75, 0]}>
        <boxGeometry args={[1.7, 0.35, 2.6]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} />
      </mesh>
      <mesh position={[0.95, 0.52, 0]}>
        <boxGeometry args={[1.8, 0.32, 2.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* =========================================================================
          LAYER 3: METAMORPHIC LIMESTONE / SCHIST STRATA
          ========================================================================= */}
      <mesh position={[-0.9, 0.38, 0]}>
        <boxGeometry args={[1.7, 0.4, 2.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      <mesh position={[0.95, 0.18, 0]}>
        <boxGeometry args={[1.8, 0.36, 2.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* =========================================================================
          LAYER 4: DEEP CRYSTALLINE BASEMENT BEDROCK
          ========================================================================= */}
      <mesh position={[-0.9, -0.1, 0]}>
        <boxGeometry args={[1.7, 0.55, 2.6]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0.95, -0.22, 0]}>
        <boxGeometry args={[1.8, 0.45, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* =========================================================================
          LAYER 5: TECTONIC MANTLE / MAGMATIC THERMAL BASE
          ========================================================================= */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[3.7, 0.42, 2.6]} />
        <meshStandardMaterial
          color="#ea580c"
          emissive="#c2410c"
          emissiveIntensity={0.6}
          roughness={0.4}
        />
      </mesh>

      {/* Glowing Fault Line Boundary Plane */}
      <mesh position={[0.02, 0.35, 0]} rotation={[0, 0, Math.PI / 14]}>
        <boxGeometry args={[0.04, 1.8, 2.62]} />
        <meshBasicMaterial color="#38bdf8" wireframe />
      </mesh>
    </group>
  );
}

export default function Geological3DBlock({ sectorId = "terrain", locationName = "Uttarakhand" }: Geological3DBlockProps) {
  const [viewMode, setViewMode] = useState<"3d" | "diagram">("3d");
  const [selectedDiagram, setSelectedDiagram] = useState<"fault" | "tectonics" | "glacier" | "hydrology">("fault");
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-700/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header and View Mode Switcher */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-500/50 flex items-center justify-center text-sky-400">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-semibold text-sky-300 uppercase tracking-wider">
              Physical Relief & 3D Geological Strata Model
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">
              Lithological cross-section & subsurface tectonic fault mechanics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
          <button
            onClick={() => setViewMode("3d")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "3d"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>3D Model</span>
          </button>
          <button
            onClick={() => setViewMode("diagram")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "diagram"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Cross-Sections</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: INTERACTIVE 3D GEOLOGICAL STRATA BLOCK CANVAS
          ========================================================================= */}
      {viewMode === "3d" && (
        <div className="space-y-3">
          <div className="relative h-64 w-full bg-space-950/90 rounded-xl border border-slate-800/80 overflow-hidden">
            {/* Top Interactive Prompt */}
            <div className="absolute top-2.5 left-3 z-10 flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-300 bg-space-900/80 px-2 py-0.5 rounded border border-slate-700/60">
                Drag to rotate 360° • Scroll to zoom
              </span>
            </div>

            {/* Geological Layer Badges (Floating Right) */}
            <div className="absolute top-2.5 right-3 z-10 flex flex-col gap-1 text-[9px] font-mono pointer-events-none">
              <span className="px-1.5 py-0.5 rounded bg-lime-950/80 text-lime-300 border border-lime-800">
                Topsoil & Vegetation
              </span>
              <span className="px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
                Sedimentary Sandstone
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700">
                Metamorphic Limestone
              </span>
              <span className="px-1.5 py-0.5 rounded bg-orange-950/80 text-orange-400 border border-orange-800">
                Basement & Asthenosphere
              </span>
            </div>

            {/* Three.js Canvas */}
            <Canvas camera={{ position: [3.8, 2.6, 4.2], fov: 42 }}>
              <ambientLight intensity={0.8} />
              <directionalLight position={[6, 8, 5]} intensity={1.5} />
              <pointLight position={[-4, -2, -3]} intensity={0.5} color="#38bdf8" />
              <pointLight position={[0, -2, 0]} intensity={1.8} color="#ea580c" />

              <Suspense fallback={null}>
                <StrataBlock sectorId={sectorId} />
                <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} />
              </Suspense>
            </Canvas>

            {/* Fault Slip Callout Bar (Bottom) */}
            <div className="absolute bottom-2 inset-x-2 z-10 p-2 rounded-lg bg-space-950/90 border border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>NISAR L-band Swath (24cm) penetrates down to structural bedrock</span>
              </span>
              <span className="text-amber-400 font-semibold">Tectonic Fault Dip: 28° NE</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: HIGH-RESOLUTION CROSS-SECTION DIAGRAMS (SCREENSHOTS)
          ========================================================================= */}
      {viewMode === "diagram" && (
        <div className="space-y-3">
          {/* Diagram Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-mono">
            <button
              onClick={() => setSelectedDiagram("fault")}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedDiagram === "fault"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold"
                  : "bg-space-950 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <Mountain className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="truncate">Fault Block (Horst)</span>
            </button>

            <button
              onClick={() => setSelectedDiagram("tectonics")}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedDiagram === "tectonics"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold"
                  : "bg-space-950 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-orange-400 flex-shrink-0" />
              <span className="truncate">Plate Tectonics</span>
            </button>

            <button
              onClick={() => setSelectedDiagram("glacier")}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedDiagram === "glacier"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold"
                  : "bg-space-950 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <Snowflake className="w-3.5 h-3.5 text-sky-400 flex-shrink-0" />
              <span className="truncate">Glacier Retreat</span>
            </button>

            <button
              onClick={() => setSelectedDiagram("hydrology")}
              className={`p-2 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-1.5 ${
                selectedDiagram === "hydrology"
                  ? "bg-sky-500/20 text-sky-300 border-sky-500/50 font-bold"
                  : "bg-space-950 text-slate-400 border-slate-800 hover:text-slate-200"
              }`}
            >
              <Droplets className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
              <span className="truncate">Alluvial Basin</span>
            </button>
          </div>

          {/* Active Image / Diagram Card */}
          <div className="relative rounded-xl bg-space-950/90 border border-slate-800 overflow-hidden p-3 space-y-2.5">
            {/* 1. Fault Block / Horst & Graben Image */}
            {selectedDiagram === "fault" && (
              <div className="space-y-2">
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                  <img
                    src="/geology/fault_block_terrain.jpg"
                    alt="Horst and Graben Fault Block 3D Cross Section"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => setIsZoomModalOpen(true)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-space-900/90 text-sky-300 border border-slate-700 hover:bg-space-800 cursor-pointer text-[10px] font-mono flex items-center gap-1"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom</span>
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  <span className="font-bold text-amber-400">Horst & Graben Tectonic Block Diagram:</span> Illustrates differential vertical uplift
                  along normal and thrust faults in the Himalayan foothill boundaries. NISAR interferometric repeat-pass phase measures
                  the surface displacement vector across these stratified rock units.
                </div>
              </div>
            )}

            {/* 2. Plate Tectonics Subduction Image */}
            {selectedDiagram === "tectonics" && (
              <div className="space-y-2">
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
                  <img
                    src="/geology/plate_tectonics_cross_section.png"
                    alt="Plate Tectonics Oceanic Continental Crust Subduction 3D Model"
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => setIsZoomModalOpen(true)}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-space-900/90 text-sky-300 border border-slate-700 hover:bg-space-800 cursor-pointer text-[10px] font-mono flex items-center gap-1"
                  >
                    <ZoomIn className="w-3 h-3" />
                    <span>Zoom</span>
                  </button>
                </div>
                <div className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  <span className="font-bold text-orange-400">Himalayan Continental Collision:</span> Depicts the Indian Plate subducting
                  beneath the Eurasian Plate, producing the Main Central Thrust (MCT) and Main Himalayan Thrust (MHT). L-band radar
                  detects regional crustal deformation and strain accumulation across this boundary.
                </div>
              </div>
            )}

            {/* 3. Glacier & Cryosphere Schematic */}
            {selectedDiagram === "glacier" && (
              <div className="space-y-2">
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-800 bg-space-950 p-4 flex flex-col justify-between">
                  <svg className="w-full h-32" viewBox="0 0 400 120">
                    {/* Mountain Bedrock Slope */}
                    <path d="M 0,120 L 0,20 L 120,40 L 260,85 L 400,120 Z" fill="#334155" />
                    {/* Glacier Ice Body */}
                    <path d="M 30,30 C 100,25 180,60 280,80 L 260,85 L 120,40 Z" fill="#7dd3fc" opacity="0.85" />
                    {/* Moraine Debris Band */}
                    <path d="M 270,78 L 310,95 L 300,102 L 260,85 Z" fill="#92400e" opacity="0.9" />
                    {/* Crevasses */}
                    <line x1="140" y1="45" x2="145" y2="60" stroke="#0284c7" strokeWidth="2" />
                    <line x1="170" y1="55" x2="175" y2="70" stroke="#0284c7" strokeWidth="2" />
                    <line x1="200" y1="65" x2="205" y2="78" stroke="#0284c7" strokeWidth="2" />
                  </svg>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="text-sky-300">Accumulation Cirque</span>
                    <span className="text-amber-400">Terminal Moraine</span>
                    <span className="text-emerald-400">Proglacial Stream</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  <span className="font-bold text-sky-400">Cryospheric Radar Interaction:</span> Clean glacier ice exhibits low backscatter
                  due to volumetric penetration, while crevassed zones and terminal debris moraines trigger strong radar double-bounce.
                </div>
              </div>
            )}

            {/* 4. Hydrology / Basin Saturation */}
            {selectedDiagram === "hydrology" && (
              <div className="space-y-2">
                <div className="relative h-48 w-full rounded-lg overflow-hidden border border-slate-800 bg-space-950 p-4 flex flex-col justify-between">
                  <svg className="w-full h-32" viewBox="0 0 400 120">
                    {/* Basin valley */}
                    <path d="M 0,60 Q 200,120 400,60 L 400,120 L 0,120 Z" fill="#1e293b" />
                    {/* Saturated soil water table */}
                    <path d="M 50,85 Q 200,110 350,85 L 350,115 L 50,115 Z" fill="#0284c7" opacity="0.6" />
                    {/* Standing water surface */}
                    <ellipse cx="200" cy="98" rx="80" ry="10" fill="#38bdf8" />
                  </svg>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span className="text-slate-400">Unsaturated Regolith</span>
                    <span className="text-sky-300">Specular Open Water (Δγ⁰ &le; -3dB)</span>
                    <span className="text-blue-400">Saturated Aquifer</span>
                  </div>
                </div>
                <div className="text-[11px] font-mono text-slate-300 leading-relaxed">
                  <span className="font-bold text-blue-400">Inundation & Moisture Dielectric Shift:</span> Smooth standing water reflects
                  radar away from the sensor (specular reflection), causing deep negative backscatter drops ($\Delta\gamma^0 \le -3.0$ dB).
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full-Screen Zoom Modal for Geological Diagrams */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6">
          <div className="relative max-w-4xl w-full bg-space-950 border border-slate-700 rounded-2xl p-4 shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white font-mono text-sm px-2.5 py-1 rounded-lg bg-space-900 border border-slate-800 cursor-pointer"
            >
              ✕ Close
            </button>
            <img
              src={selectedDiagram === "fault" ? "/geology/fault_block_terrain.jpg" : "/geology/plate_tectonics_cross_section.png"}
              alt="Geological Diagram High-Resolution Zoom"
              className="max-h-[75vh] object-contain rounded-lg mt-4"
            />
            <div className="mt-3 text-xs font-mono text-slate-300 text-center">
              NASA NISAR L-band Observational Analogy • High-Resolution Physical Strata Cross-Section
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
