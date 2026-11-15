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
  Trees,
  ZoomIn,
  Activity,
  X,
} from "lucide-react";

interface Geological3DBlockProps {
  sectorId?: string;
  locationName?: string;
}

// ===========================================================================
// 1. DYNAMIC THREE.JS PROCEDURAL 3D LITHOLOGY BLOCKS (SECTOR-SPECIFIC)
// ===========================================================================

/**
 * FOREST CANOPY & BIOMASS 3D BLOCK
 * Multi-story vegetation canopy, procedural 3D conifer trees, organic humus root zone,
 * and microwave volume-scattering wave plane.
 */
function Forest3DBlock() {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    if (waveRef.current) {
      waveRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06;
    }
  });

  // Tree locations across the upper terrain surface
  const treePositions: [number, number, number][] = [
    [-1.3, 1.4, -0.7],
    [-0.9, 1.4, 0.4],
    [-1.4, 1.4, 0.6],
    [-0.5, 1.4, -0.3],
    [0.5, 1.1, -0.6],
    [0.9, 1.1, 0.5],
    [1.4, 1.1, -0.4],
    [1.2, 1.1, 0.7],
    [0.6, 1.1, 0.1],
  ];

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* 3D Miniature Procedural Conifer Trees */}
      {treePositions.map((pos, idx) => (
        <group key={`tree-${idx}`} position={pos}>
          {/* Trunk */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.24, 6]} />
            <meshStandardMaterial color="#451a03" roughness={0.9} />
          </mesh>
          {/* Lower Canopy Cone */}
          <mesh position={[0, 0.28, 0]}>
            <coneGeometry args={[0.2, 0.26, 6]} />
            <meshStandardMaterial color="#166534" roughness={0.8} />
          </mesh>
          {/* Upper Canopy Cone */}
          <mesh position={[0, 0.42, 0]}>
            <coneGeometry args={[0.14, 0.22, 6]} />
            <meshStandardMaterial color="#22c55e" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* Layer 1: Forest Upper Terrain (Humus & Moss Crust) */}
      <mesh position={[-0.9, 1.15, 0]}>
        <boxGeometry args={[1.7, 0.45, 2.6]} />
        <meshStandardMaterial color="#1e3a1e" roughness={0.85} />
      </mesh>
      <mesh position={[0.95, 0.85, 0]}>
        <boxGeometry args={[1.8, 0.35, 2.6]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.85} />
      </mesh>

      {/* Pulsing L-Band Radar Microwave Volume Scattering Wave */}
      <mesh ref={waveRef} position={[0, 1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.3} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Layer 2: Organic Root Zone & Weathered Saprolite */}
      <mesh position={[-0.9, 0.75, 0]}>
        <boxGeometry args={[1.7, 0.35, 2.6]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.8} />
      </mesh>
      <mesh position={[0.95, 0.52, 0]}>
        <boxGeometry args={[1.8, 0.32, 2.6]} />
        <meshStandardMaterial color="#784e2d" roughness={0.8} />
      </mesh>

      {/* Layer 3: Sedimentary Sandstone / Sub-Soil Horizon */}
      <mesh position={[-0.9, 0.38, 0]}>
        <boxGeometry args={[1.7, 0.4, 2.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>
      <mesh position={[0.95, 0.18, 0]}>
        <boxGeometry args={[1.8, 0.36, 2.6]} />
        <meshStandardMaterial color="#92400e" roughness={0.7} />
      </mesh>

      {/* Layer 4: Deep Crystalline Bedrock */}
      <mesh position={[-0.9, -0.1, 0]}>
        <boxGeometry args={[1.7, 0.55, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
      <mesh position={[0.95, -0.22, 0]}>
        <boxGeometry args={[1.8, 0.45, 2.6]} />
        <meshStandardMaterial color="#0f172a" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * GLACIER & CRYOSPHERE 3D BLOCK
 * U-shaped valley, icy glacial tongue, crevasse fissures, lateral moraine, and deep ice penetration.
 */
function Glacier3DBlock() {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    if (waveRef.current) {
      waveRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2.5) * 0.06;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Glacial Ice Tongue (Glossy Pale Cyan Ice) */}
      <mesh position={[0, 1.05, 0]}>
        <boxGeometry args={[1.9, 0.4, 2.6]} />
        <meshStandardMaterial color="#bae6fd" roughness={0.2} metalness={0.1} />
      </mesh>

      {/* Crevasse Shear Fissures (Dark Blue Cuts) */}
      {[-0.6, 0, 0.6].map((z, idx) => (
        <mesh key={`crevasse-${idx}`} position={[0, 1.22, z]} rotation={[0, 0, 0]}>
          <boxGeometry args={[1.4, 0.05, 0.08]} />
          <meshStandardMaterial color="#1d4ed8" roughness={0.1} />
        </mesh>
      ))}

      {/* Lateral Moraine Debris Flanks (Granite & Moraine Slate) */}
      <mesh position={[-1.25, 1.15, 0]}>
        <boxGeometry args={[0.7, 0.5, 2.6]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>
      <mesh position={[1.25, 1.15, 0]}>
        <boxGeometry args={[0.7, 0.5, 2.6]} />
        <meshStandardMaterial color="#475569" roughness={0.9} />
      </mesh>

      {/* Pulsing L-Band Deep Ice Penetration Radar Wave */}
      <mesh ref={waveRef} position={[0, 1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.35} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Layer 2: Compressed Blue Firn / Glacial Ice Strata */}
      <mesh position={[0, 0.68, 0]}>
        <boxGeometry args={[3.6, 0.35, 2.6]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.4} />
      </mesh>

      {/* Layer 3: Basal Sliding Till & Subglacial Debris Zone */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[3.6, 0.38, 2.6]} />
        <meshStandardMaterial color="#64748b" roughness={0.8} />
      </mesh>

      {/* Layer 4: Permafrost & Crystalline Granite Basement */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[3.6, 0.55, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
    </group>
  );
}

/**
 * TECTONIC FAULT BLOCK / LANDSLIDE 3D BLOCK
 * Horst & Graben structure with 28° active shear fault slip plane,
 * sedimentary strata, and pulsing mantle heat base.
 */
function Tectonic3DBlock() {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    if (waveRef.current) {
      waveRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Horst Block (Upthrown Left Mountain) */}
      <mesh position={[-0.9, 1.15, 0]}>
        <boxGeometry args={[1.7, 0.45, 2.6]} />
        <meshStandardMaterial color="#78716c" roughness={0.8} />
      </mesh>

      {/* Graben Block (Downthrown Right Valley with Colluvial Toe) */}
      <mesh position={[0.95, 0.85, 0]}>
        <boxGeometry args={[1.8, 0.35, 2.6]} />
        <meshStandardMaterial color="#57534e" roughness={0.85} />
      </mesh>

      {/* InSAR Repeat-Pass Interferogram Microwave Wave Plane */}
      <mesh ref={waveRef} position={[0, 1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial color="#f59e0b" transparent opacity={0.3} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Sedimentary Sandstone Strata */}
      <mesh position={[-0.9, 0.75, 0]}>
        <boxGeometry args={[1.7, 0.35, 2.6]} />
        <meshStandardMaterial color="#d97706" roughness={0.7} />
      </mesh>
      <mesh position={[0.95, 0.52, 0]}>
        <boxGeometry args={[1.8, 0.32, 2.6]} />
        <meshStandardMaterial color="#b45309" roughness={0.7} />
      </mesh>

      {/* Metamorphic Limestone / Slate Strata */}
      <mesh position={[-0.9, 0.38, 0]}>
        <boxGeometry args={[1.7, 0.4, 2.6]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
      </mesh>
      <mesh position={[0.95, 0.18, 0]}>
        <boxGeometry args={[1.8, 0.36, 2.6]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.6} />
      </mesh>

      {/* Deep Crystalline Basement Bedrock */}
      <mesh position={[-0.9, -0.1, 0]}>
        <boxGeometry args={[1.7, 0.55, 2.6]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>
      <mesh position={[0.95, -0.22, 0]}>
        <boxGeometry args={[1.8, 0.45, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>

      {/* Asthenosphere / Tectonic Mantle Thermal Base */}
      <mesh position={[0, -0.65, 0]}>
        <boxGeometry args={[3.7, 0.42, 2.6]} />
        <meshStandardMaterial color="#ea580c" emissive="#c2410c" emissiveIntensity={0.6} roughness={0.4} />
      </mesh>

      {/* Glowing 28° Tectonic Fault Plane Wireframe */}
      <mesh position={[0.02, 0.35, 0]} rotation={[0, 0, Math.PI / 14]}>
        <boxGeometry args={[0.04, 1.8, 2.62]} />
        <meshBasicMaterial color="#38bdf8" wireframe />
      </mesh>
    </group>
  );
}

/**
 * HYDROLOGY & INUNDATION 3D BLOCK
 * River basin, flooded alluvial terrace, reflective specular water plane, and saturated alluvium.
 */
function Hydrology3DBlock() {
  const groupRef = useRef<THREE.Group>(null);
  const waveRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    if (waveRef.current) {
      waveRef.current.position.y = 1.35 + Math.sin(state.clock.elapsedTime * 2.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Non-Flooded River Bank Terrace (Left) */}
      <mesh position={[-1.1, 1.05, 0]}>
        <boxGeometry args={[1.4, 0.4, 2.6]} />
        <meshStandardMaterial color="#3f6212" roughness={0.8} />
      </mesh>

      {/* Flooded Alluvial Inundation Basin with Specular Water Reflection (Center-Right) */}
      <mesh position={[0.6, 0.82, 0]}>
        <boxGeometry args={[2.2, 0.12, 2.6]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Non-Flooded River Bank Terrace (Right Levee) */}
      <mesh position={[1.65, 0.95, 0]}>
        <boxGeometry args={[0.4, 0.35, 2.6]} />
        <meshStandardMaterial color="#4d7c0f" roughness={0.8} />
      </mesh>

      {/* Radar Wave Showing Specular Deflection into Space */}
      <mesh ref={waveRef} position={[0, 1.35, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.8, 2.8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} side={THREE.DoubleSide} wireframe />
      </mesh>

      {/* Layer 2: Saturated Alluvial Gravel & Silt Horizon */}
      <mesh position={[0, 0.55, 0]}>
        <boxGeometry args={[3.6, 0.38, 2.6]} />
        <meshStandardMaterial color="#64748b" roughness={0.7} />
      </mesh>

      {/* Layer 3: Water Table Interface (Seam) */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[3.6, 0.08, 2.6]} />
        <meshStandardMaterial color="#0369a1" roughness={0.3} emissive="#0284c7" emissiveIntensity={0.3} />
      </mesh>

      {/* Layer 4: Impermeable Clay & Shale Bedrock */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[3.6, 0.65, 2.6]} />
        <meshStandardMaterial color="#1e293b" roughness={0.9} />
      </mesh>
    </group>
  );
}

// ===========================================================================
// MAIN COMPONENT: DYNAMIC SECTOR-ADAPTIVE 3D GEOLOGY & LITHOLOGY
// ===========================================================================
export default function Geological3DBlock({
  sectorId = "terrain_surface",
  locationName = "Uttarakhand",
}: Geological3DBlockProps) {
  const [viewMode, setViewMode] = useState<"3d" | "diagram">("3d");
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Sector discrimination
  const isForest =
    sectorId === "forest_canopy" ||
    sectorId === "forestry" ||
    sectorId === "forest" ||
    sectorId === "biomass";
  const isGlacier =
    sectorId === "glacier_cryosphere" ||
    sectorId === "glacier" ||
    sectorId === "cryosphere" ||
    sectorId === "ice";
  const isFlood =
    sectorId === "water_wetlands" ||
    sectorId === "flood" ||
    sectorId === "hydrology" ||
    sectorId === "inundation";
  // Default to terrain / tectonic / landslide
  const isTectonic = !isForest && !isGlacier && !isFlood;

  // Sector Configuration & Metadata
  const sectorMeta = isForest
    ? {
        title: "Forest Canopy & Biomass Lithology Model",
        subtitle: "Multi-story canopy penetration, organic root zone, and volume scattering",
        badge: "FORESTRY SECTOR",
        badgeColor: "bg-emerald-950 text-emerald-300 border-emerald-800",
        radarCallout: "NISAR L-band (24cm) cross-pol (HV) penetrates multi-story canopy to measure biomass loss",
        layers: [
          { name: "Tree Canopy (18m-28m)", color: "bg-emerald-950/80 text-emerald-300 border-emerald-800" },
          { name: "Organic Humus & Root Zone", color: "bg-amber-950/80 text-amber-300 border-amber-800" },
          { name: "Saprolite / Sandstone", color: "bg-amber-900/80 text-amber-200 border-amber-700" },
          { name: "Crystalline Bedrock", color: "bg-slate-900/80 text-slate-300 border-slate-700" },
        ],
        diagramTitle: "Forest Canopy & Root-Zone Lithology Cross-Section",
        diagramDesc:
          "Illustrates L-band microwave volume scattering through the forest canopy down to tree trunks and soil. Differential backscatter (Δγ⁰_HV) reflects structural foliage clearing or logging in Uttarakhand's forest reserves.",
      }
    : isGlacier
    ? {
        title: "Glacier & Cryospheric Moraine Lithology Model",
        subtitle: "Glacial ice tongue, supraglacial crevasses, lateral moraine, and permafrost bedrock",
        badge: "CRYOSPHERE SECTOR",
        badgeColor: "bg-sky-950 text-sky-300 border-sky-800",
        radarCallout: "L-band radar penetrates dry snow up to 10m to detect internal crevasse shear & ice flow",
        layers: [
          { name: "Supraglacial Firn & Crevasses", color: "bg-sky-950/80 text-sky-300 border-sky-800" },
          { name: "Compressed Blue Ice Layer", color: "bg-blue-950/80 text-blue-300 border-blue-800" },
          { name: "Basal Sliding Till", color: "bg-slate-800/80 text-slate-300 border-slate-700" },
          { name: "Permafrost & Granite", color: "bg-slate-900/80 text-slate-300 border-slate-700" },
        ],
        diagramTitle: "Glacial Cirque & Valley Glacier Lithological Cross-Section",
        diagramDesc:
          "Depicts the equilibrium line altitude (ELA), glacial ablation zone, and lateral moraine in the High Himalayas (Chamoli/Uttarkashi). Liquid meltwater causes deep specular backscatter absorption.",
      }
    : isFlood
    ? {
        title: "Alluvial Flood Plain & Inundation Lithology Model",
        subtitle: "Flooded river terrace, specular water reflection, and saturated gravel horizon",
        badge: "HYDROLOGY SECTOR",
        badgeColor: "bg-blue-950 text-blue-300 border-blue-800",
        radarCallout: "Smooth standing water deflects radar energy away, creating distinct dark specular boundaries",
        layers: [
          { name: "Specular Inundation Plane", color: "bg-blue-950/80 text-blue-300 border-blue-800" },
          { name: "Saturated Alluvium", color: "bg-slate-800/80 text-slate-300 border-slate-700" },
          { name: "Water Table Interface", color: "bg-cyan-950/80 text-cyan-300 border-cyan-800" },
          { name: "Impermeable Bedrock", color: "bg-slate-900/80 text-slate-300 border-slate-700" },
        ],
        diagramTitle: "Alluvial Basin & Flood Plain Hydrogeological Cross-Section",
        diagramDesc:
          "Demonstrates surface inundation over permeable alluvial gravels and river levees. Radar backscatter drops sharply (≤ -3.0 dB) over standing water due to specular microwave reflection.",
      }
    : {
        title: "Tectonic Horst & Graben Fault-Block Model",
        subtitle: "28° active shear fault slip plane, stratified sedimentary rock, and mantle thermal base",
        badge: "TECTONIC SECTOR",
        badgeColor: "bg-amber-950 text-amber-300 border-amber-800",
        radarCallout: "Repeat-pass InSAR measures sub-centimeter line-of-sight surface displacement along the fault plane",
        layers: [
          { name: "Colluvial Slope Regolith", color: "bg-lime-950/80 text-lime-300 border-lime-800" },
          { name: "Siwalik Sandstone", color: "bg-amber-950/80 text-amber-300 border-amber-800" },
          { name: "Metamorphic Limestone", color: "bg-slate-900/80 text-slate-300 border-slate-700" },
          { name: "Crystalline Basement", color: "bg-orange-950/80 text-orange-400 border-orange-800" },
        ],
        diagramTitle: "Horst & Graben Tectonic Block Cross-Section",
        diagramDesc:
          "Illustrates differential vertical uplift and shear strain along normal and thrust faults in the Himalayan foothills. NISAR interferometry measures displacement across these stratified rock units.",
      };

  return (
    <div className="rounded-2xl bg-space-900/90 border border-slate-700/80 p-5 backdrop-blur-xl shadow-xl space-y-4">
      {/* Header and View Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-sky-950 border border-sky-500/50 flex items-center justify-center text-sky-400">
            {isForest ? (
              <Trees className="w-4 h-4 text-emerald-400" />
            ) : isGlacier ? (
              <Snowflake className="w-4 h-4 text-sky-400" />
            ) : isFlood ? (
              <Droplets className="w-4 h-4 text-blue-400" />
            ) : (
              <Box className="w-4 h-4 text-amber-400" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-semibold text-sky-300 uppercase tracking-wider">
                {sectorMeta.title}
              </h3>
              <span className={`px-1.5 py-0.2 rounded text-[9px] font-mono border ${sectorMeta.badgeColor}`}>
                {sectorMeta.badge}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">{sectorMeta.subtitle}</p>
          </div>
        </div>

        {/* View Mode Toggle: 3D Model vs Geological Cross-Section */}
        <div className="flex items-center gap-1 bg-space-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono self-start sm:self-auto">
          <button
            onClick={() => setViewMode("3d")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 ${
              viewMode === "3d"
                ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>Interactive 3D</span>
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
            <span>Cross-Section</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VIEW MODE 1: DYNAMIC THREE.JS INTERACTIVE 3D LITHOLOGY CANVAS
          ========================================================================= */}
      {viewMode === "3d" && (
        <div className="space-y-3">
          <div className="relative h-64 w-full bg-space-950/90 rounded-xl border border-slate-800/80 overflow-hidden shadow-inner">
            {/* Top Interactive Prompt */}
            <div className="absolute top-2.5 left-3 z-10 flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-300 bg-space-900/80 px-2 py-0.5 rounded border border-slate-700/60">
                Drag to rotate 360° • Scroll to zoom
              </span>
            </div>

            {/* Dynamic Sector Lithology Layer Badges (Floating Right) */}
            <div className="absolute top-2.5 right-3 z-10 flex flex-col gap-1 text-[9px] font-mono pointer-events-none">
              {sectorMeta.layers.map((layer, idx) => (
                <span key={`layer-${idx}`} className={`px-1.5 py-0.5 rounded border ${layer.color}`}>
                  {layer.name}
                </span>
              ))}
            </div>

            {/* Three.js Canvas Rendering the Exact Phenomenon */}
            <Canvas camera={{ position: [3.8, 2.6, 4.2], fov: 42 }}>
              <ambientLight intensity={0.9} />
              <directionalLight position={[6, 8, 5]} intensity={1.6} />
              <pointLight position={[-4, -2, -3]} intensity={0.6} color="#38bdf8" />
              <pointLight position={[0, -2, 0]} intensity={1.8} color="#ea580c" />

              <Suspense fallback={null}>
                {isForest ? (
                  <Forest3DBlock />
                ) : isGlacier ? (
                  <Glacier3DBlock />
                ) : isFlood ? (
                  <Hydrology3DBlock />
                ) : (
                  <Tectonic3DBlock />
                )}
                <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 2 + 0.1} />
              </Suspense>
            </Canvas>

            {/* Scientific Radar Callout Bar (Bottom) */}
            <div className="absolute bottom-2 inset-x-2 z-10 p-2 rounded-lg bg-space-950/90 border border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-sky-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">{sectorMeta.radarCallout}</span>
              </span>
              <span className="text-amber-400 font-semibold shrink-0 ml-2">{locationName} AOI</span>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VIEW MODE 2: DYNAMIC SECTOR-SPECIFIC SCIENTIFIC CROSS-SECTION DIAGRAM
          (NO unrelated buttons or cross-contamination)
          ========================================================================= */}
      {viewMode === "diagram" && (
        <div className="space-y-3">
          <div className="relative rounded-xl bg-space-950/90 border border-slate-800 overflow-hidden p-3.5 space-y-3">
            {/* Cross-section Image Frame */}
            <div className="relative h-56 w-full rounded-lg overflow-hidden border border-slate-800 bg-black flex items-center justify-center">
              <img
                src={
                  isForest || isTectonic
                    ? "/geology/fault_block_terrain.jpg"
                    : "/geology/plate_tectonics_cross_section.png"
                }
                alt={sectorMeta.diagramTitle}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
              />
              <button
                onClick={() => setIsZoomModalOpen(true)}
                className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-space-900/90 text-sky-300 border border-slate-700 hover:bg-space-800 cursor-pointer text-[10px] font-mono flex items-center gap-1 shadow-lg"
              >
                <ZoomIn className="w-3 h-3" />
                <span>Enlarge</span>
              </button>
            </div>

            {/* Scientific Analysis Description (Tailored strictly to this sector) */}
            <div className="text-[11px] font-mono text-slate-300 leading-relaxed bg-space-900/60 p-3 rounded-lg border border-slate-800">
              <span className="font-bold text-sky-400 block mb-1">
                {sectorMeta.diagramTitle} ({locationName}, UK)
              </span>
              {sectorMeta.diagramDesc}
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Zoom Modal */}
      {isZoomModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in-0"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] bg-space-950 border border-sky-500/50 rounded-2xl p-4 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 font-mono text-xs text-white">
              <span className="font-bold text-sky-400">{sectorMeta.diagramTitle}</span>
              <button
                onClick={() => setIsZoomModalOpen(false)}
                className="p-1 rounded-lg bg-space-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <img
              src={
                isForest || isTectonic
                  ? "/geology/fault_block_terrain.jpg"
                  : "/geology/plate_tectonics_cross_section.png"
              }
              alt={sectorMeta.diagramTitle}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
