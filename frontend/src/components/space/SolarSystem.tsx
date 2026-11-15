"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import {
  createSunTexture,
  createSunGlowTexture,
  createEarthTexture,
  createEarthCloudTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingTexture,
  createMarsTexture,
  createVenusTexture,
  createMercuryTexture,
  createNeptuneTexture,
  createUranusTexture,
} from "@/lib/planetTextures";
import AsteroidBelt from "./AsteroidBelt";
import { PlanetData } from "@/types/journey";
import { soundController } from "@/lib/audio";

interface SolarSystemProps {
  onSelectEarth: () => void;
  onSelectOtherPlanet: (planet: PlanetData) => void;
  reducedMotion?: boolean;
  speedMultiplier?: number;
  showAxisLines?: boolean;
}

export default function SolarSystem({
  onSelectEarth,
  onSelectOtherPlanet,
  reducedMotion = false,
  speedMultiplier = 1.0,
  showAxisLines = false,
}: SolarSystemProps) {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const sunMeshRef = useRef<THREE.Mesh>(null);
  const sunGlowSpriteRef = useRef<THREE.Sprite>(null);

  // High-definition procedural textures matching user's illustration
  const [sunTex, setSunTex] = useState<THREE.CanvasTexture | null>(null);
  const [sunGlowTex, setSunGlowTex] = useState<THREE.CanvasTexture | null>(null);
  const [earthTex, setEarthTex] = useState<THREE.CanvasTexture | null>(null);
  const [earthCloudTex, setEarthCloudTex] = useState<THREE.CanvasTexture | null>(null);
  const [jupiterTex, setJupiterTex] = useState<THREE.CanvasTexture | null>(null);
  const [saturnTex, setSaturnTex] = useState<THREE.CanvasTexture | null>(null);
  const [saturnRingTex, setSaturnRingTex] = useState<THREE.CanvasTexture | null>(null);
  const [marsTex, setMarsTex] = useState<THREE.CanvasTexture | null>(null);
  const [venusTex, setVenusTex] = useState<THREE.CanvasTexture | null>(null);
  const [mercuryTex, setMercuryTex] = useState<THREE.CanvasTexture | null>(null);
  const [neptuneTex, setNeptuneTex] = useState<THREE.CanvasTexture | null>(null);
  const [uranusTex, setUranusTex] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setSunGlowTex(createSunGlowTexture());

    const loader = new THREE.TextureLoader();

    // High-resolution 2K NASA SDO Photosphere solar surface texture
    loader.load(
      "/sun_2k.jpg",
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        setSunTex(tex as any);
      },
      undefined,
      () => {
        // Fallback procedural sun texture if fetch fails
        setSunTex(createSunTexture());
      }
    );

    // High-resolution photorealistic NASA Blue Marble maps for Earth
    loader.load("/earth_vibrant_2048.jpg", (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      setEarthTex(tex as any);
    });
    loader.load("/earth_clouds_1024.png", (tex) => {
      setEarthCloudTex(tex as any);
    });

    setJupiterTex(createJupiterTexture());
    setSaturnTex(createSaturnTexture());
    setSaturnRingTex(createSaturnRingTexture());
    setMarsTex(createMarsTexture());
    setVenusTex(createVenusTexture());
    setMercuryTex(createMercuryTexture());
    setNeptuneTex(createNeptuneTexture());
    setUranusTex(createUranusTexture());
  }, []);

  // Celestial Coordinate Radial Spoke Lines matching user screenshot
  const spokeGeometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    const count = 32;
    for (let i = 0; i < count; i++) {
      const angle = (i * Math.PI * 2) / count;
      const innerR = 5.6;
      const outerR = 95.0;
      pts.push(
        new THREE.Vector3(Math.cos(angle) * innerR, 0, Math.sin(angle) * innerR),
        new THREE.Vector3(Math.cos(angle) * outerR, 0, Math.sin(angle) * outerR)
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, []);

  // Sun rotation & subtle pulsation animation
  useFrame(({ clock }, delta) => {
    if (reducedMotion) return;
    const t = clock.getElapsedTime();

    if (sunMeshRef.current) {
      sunMeshRef.current.rotation.y += delta * 0.2 * speedMultiplier;
    }
    if (sunGlowSpriteRef.current) {
      const s = 28 + Math.sin(t * 2.2) * 1.5;
      sunGlowSpriteRef.current.scale.set(s, s, 1);
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Interactive OrbitControls for 360° inspection and zoom */}
      <OrbitControls
        enableDamping
        dampingFactor={0.06}
        maxDistance={250}
        minDistance={14}
        maxPolarAngle={Math.PI / 2.05}
      />

      {/* CELESTIAL ORBITAL GRID (Concentric rings + radial coordinate spoke lines matching user screenshot) */}
      <group position={[0, -0.05, 0]}>
        <lineSegments geometry={spokeGeometry}>
          <lineBasicMaterial color="#38bdf8" transparent opacity={0.18} />
        </lineSegments>
      </group>

      {/* 1. PHOTOREALISTIC FIERY SUN (Real NASA SDO Photosphere & Magnetic Corona) */}
      <group position={[0, 0, 0]}>
        {/* Core incandescent fiery sun sphere */}
        <mesh
          key={sunTex ? "sun-loaded" : "sun-init"}
          ref={sunMeshRef}
          onClick={(e) => {
            e.stopPropagation();
            soundController.playPing(920, 0.2);
            onSelectEarth();
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "auto";
          }}
        >
          <sphereGeometry args={[5.2, 64, 64]} />
          <meshBasicMaterial
            map={sunTex || undefined}
            color={sunTex ? "#ffffff" : "#ea580c"}
          />
        </mesh>

        {/* Outer Chromosphere Plasma Glow Rim (BackSide so front surface is never washed out) */}
        <mesh>
          <sphereGeometry args={[5.32, 48, 48]} />
          <meshBasicMaterial
            color="#ea580c"
            transparent
            opacity={0.42}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Exosphere Golden Corona Halo */}
        <mesh>
          <sphereGeometry args={[5.55, 32, 32]} />
          <meshBasicMaterial
            color="#f97316"
            transparent
            opacity={0.18}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>

        {/* Solar Prominences / Coronal Magnetic Loops */}
        <group position={[-5.15, 0.8, 0]} rotation={[0, 0, 0.4]}>
          <mesh>
            <torusGeometry args={[0.55, 0.08, 16, 32, Math.PI * 0.9]} />
            <meshBasicMaterial color="#ef4444" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>
        <group position={[5.05, -1.2, 0]} rotation={[0, 0, -2.4]}>
          <mesh>
            <torusGeometry args={[0.42, 0.07, 16, 32, Math.PI * 0.85]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.85} blending={THREE.AdditiveBlending} />
          </mesh>
        </group>

        {/* Soft Warm Coronal Glow Halo behind the Sun (gentle, un-blown-out) */}
        {sunGlowTex && (
          <sprite ref={sunGlowSpriteRef} scale={[18, 18, 1]} position={[0, 0, -0.2]}>
            <spriteMaterial
              map={sunGlowTex}
              transparent
              opacity={0.32}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </sprite>
        )}

        {/* Balanced Sunlight Point Light */}
        <pointLight
          intensity={2.2}
          distance={400}
          decay={1.0}
          color="#fff4e0"
        />
        <ambientLight intensity={0.55} color="#152033" />
      </group>

      {/* 2. REVOLVING & SPINNING PLANETARY BODIES (Exact colors matching user's reference) */}

      {/* MERCURY */}
      <DynamicPlanet
        id="mercury"
        name="Mercury"
        distance={9.6}
        orbitSpeed={0.75}
        spinSpeed={2.4}
        tilt={0.05}
        initialAngle={0.8}
        size={0.75}
        texture={mercuryTex}
        color="#a87b68"
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "mercury"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* VENUS */}
      <DynamicPlanet
        id="venus"
        name="Venus"
        distance={15.0}
        orbitSpeed={0.52}
        spinSpeed={-1.8}
        tilt={3.1}
        initialAngle={2.4}
        size={1.35}
        texture={venusTex}
        color="#e5b869"
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "venus"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* EARTH */}
      <DynamicEarth
        distance={21.5}
        orbitSpeed={0.38}
        spinSpeed={3.2}
        tilt={0.41}
        initialAngle={4.2}
        size={1.5}
        texture={earthTex}
        cloudTexture={earthCloudTex}
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "earth"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* MARS */}
      <DynamicPlanet
        id="mars"
        name="Mars"
        distance={27.8}
        orbitSpeed={0.28}
        spinSpeed={2.3}
        tilt={0.44}
        initialAngle={5.7}
        size={1.05}
        texture={marsTex}
        color="#c2410c"
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "mars"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* 3. REVOLVING ASTEROID BELT */}
      <AsteroidBelt
        reducedMotion={reducedMotion}
        speedMultiplier={speedMultiplier}
      />

      {/* JUPITER */}
      <DynamicPlanet
        id="jupiter"
        name="Jupiter"
        distance={42.5}
        orbitSpeed={0.16}
        spinSpeed={2.8}
        tilt={0.06}
        initialAngle={1.3}
        size={3.8}
        texture={jupiterTex}
        color="#d4a373"
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "jupiter"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* SATURN */}
      <DynamicSaturn
        distance={56.5}
        orbitSpeed={0.12}
        spinSpeed={2.6}
        tilt={0.47}
        initialAngle={3.3}
        size={3.0}
        bodyTexture={saturnTex}
        ringTexture={saturnRingTex}
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "saturn"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* URANUS */}
      <DynamicPlanet
        id="uranus"
        name="Uranus"
        distance={70.5}
        orbitSpeed={0.09}
        spinSpeed={-2.2}
        tilt={1.71}
        initialAngle={5.1}
        size={2.1}
        texture={uranusTex}
        color="#38bdf8"
        hasFaintRing={true}
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "uranus"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />

      {/* NEPTUNE */}
      <DynamicPlanet
        id="neptune"
        name="Neptune"
        distance={84.5}
        orbitSpeed={0.07}
        spinSpeed={2.4}
        tilt={0.49}
        initialAngle={0.4}
        size={2.0}
        texture={neptuneTex}
        color="#2563eb"
        showAxis={showAxisLines}
        speedMultiplier={speedMultiplier}
        isHovered={hoveredPlanet === "neptune"}
        onHover={setHoveredPlanet}
        onSelect={onSelectEarth}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

// ----------------------------------------------------------------------------------------
// DynamicPlanet: Actively REVOLVES around the Sun and ROTATES on its polar tilted axis
// ----------------------------------------------------------------------------------------
function DynamicPlanet({
  id,
  name,
  distance,
  orbitSpeed,
  spinSpeed,
  tilt = 0.2,
  initialAngle,
  size,
  texture,
  color,
  hasFaintRing,
  showAxis = false,
  speedMultiplier = 1.0,
  isHovered,
  onHover,
  onSelect,
  reducedMotion,
}: {
  id: string;
  name: string;
  distance: number;
  orbitSpeed: number;
  spinSpeed: number;
  tilt?: number;
  initialAngle: number;
  size: number;
  texture?: THREE.CanvasTexture | null;
  color: string;
  hasFaintRing?: boolean;
  showAxis?: boolean;
  speedMultiplier?: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
  reducedMotion: boolean;
}) {
  const planetRef = useRef<THREE.Group>(null);
  const spinMeshRef = useRef<THREE.Mesh>(null);
  const currentAngle = useRef<number>(initialAngle);

  // High-performance animation loop
  useFrame((_, delta) => {
    if (reducedMotion) return;

    // 1. REVOLUTION around the Sun
    currentAngle.current += delta * orbitSpeed * speedMultiplier;
    if (planetRef.current) {
      planetRef.current.position.x = Math.cos(currentAngle.current) * distance;
      planetRef.current.position.z = Math.sin(currentAngle.current) * distance;
    }

    // 2. AXIAL ROTATION on its own tilted polar axis
    if (spinMeshRef.current) {
      spinMeshRef.current.rotation.y += delta * spinSpeed * speedMultiplier;
    }
  });

  // Sharp, glowing circular 3D orbit line
  const orbitGeometry = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * distance,
          0,
          Math.sin(theta) * distance
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [distance]);

  return (
    <group>
      {/* 3D Glowing Orbit Ring */}
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.28} />
      </lineLoop>

      {/* Orbiting Planet Group */}
      <group
        ref={planetRef}
        position={[
          Math.cos(initialAngle) * distance,
          0,
          Math.sin(initialAngle) * distance,
        ]}
      >
        {/* Tilted Polar Axis Container */}
        <group rotation={[0, 0, tilt]}>
          {/* Glowing Polar Axis Rod (Visualizes the exact rotation axis) */}
          {showAxis && (
            <mesh>
              <cylinderGeometry args={[0.02 * size, 0.02 * size, size * 2.8, 8]} />
              <meshBasicMaterial
                color="#67e8f9"
                transparent
                opacity={0.45}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Actively Spinning Planet Sphere */}
          <mesh
            ref={spinMeshRef}
            scale={isHovered ? 1.25 : 1.0}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(id);
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              onHover(null);
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[size, 40, 40]} />
            <meshStandardMaterial
              map={texture || undefined}
              color={color}
              roughness={0.45}
              metalness={0.08}
            />

            {/* Faint ice rings for Uranus */}
            {hasFaintRing && (
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[size * 1.35, size * 1.85, 64]} />
                <meshBasicMaterial
                  color="#67e8f9"
                  transparent
                  opacity={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
            )}
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------------------
// DynamicEarth: Revolves around Sun, Spins on 23.5° tilted axis, Clouds drift, Moon orbits
// ----------------------------------------------------------------------------------------
function DynamicEarth({
  distance,
  orbitSpeed,
  spinSpeed,
  tilt = 0.41,
  initialAngle,
  size,
  texture,
  cloudTexture,
  showAxis = false,
  speedMultiplier = 1.0,
  isHovered,
  onHover,
  onSelect,
  reducedMotion,
}: {
  distance: number;
  orbitSpeed: number;
  spinSpeed: number;
  tilt?: number;
  initialAngle: number;
  size: number;
  texture?: THREE.CanvasTexture | null;
  cloudTexture?: THREE.CanvasTexture | null;
  showAxis?: boolean;
  speedMultiplier?: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
  reducedMotion: boolean;
}) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const moonOrbitRef = useRef<THREE.Group>(null);
  const currentAngle = useRef<number>(initialAngle);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    // 1. REVOLUTION around Sun along orbit
    currentAngle.current += delta * orbitSpeed * speedMultiplier;
    if (earthGroupRef.current) {
      earthGroupRef.current.position.x =
        Math.cos(currentAngle.current) * distance;
      earthGroupRef.current.position.z =
        Math.sin(currentAngle.current) * distance;
    }

    // 2. AXIAL ROTATION of Earth on its 23.5° tilted axis
    if (earthMeshRef.current) {
      earthMeshRef.current.rotation.y += delta * spinSpeed * speedMultiplier;
    }

    // 3. Independent cloud atmospheric drift
    if (cloudsMeshRef.current) {
      cloudsMeshRef.current.rotation.y += delta * (spinSpeed * 1.15) * speedMultiplier;
    }

    // 4. REVOLUTION of Moon around Earth
    if (moonOrbitRef.current) {
      moonOrbitRef.current.rotation.y += delta * 2.8 * speedMultiplier;
    }
  });

  const orbitGeometry = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * distance,
          0,
          Math.sin(theta) * distance
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [distance]);

  return (
    <group>
      {/* 3D Orbit Track */}
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.35} />
      </lineLoop>

      <group
        ref={earthGroupRef}
        position={[
          Math.cos(initialAngle) * distance,
          0,
          Math.sin(initialAngle) * distance,
        ]}
      >
        {/* Earth tilted 23.5° on its polar axis */}
        <group rotation={[0, 0, tilt]}>
          {showAxis && (
            <mesh>
              <cylinderGeometry args={[0.022 * size, 0.022 * size, size * 2.8, 8]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.5}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Actively spinning Earth */}
          <mesh
            ref={earthMeshRef}
            scale={isHovered ? 1.25 : 1.0}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover("earth");
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              onHover(null);
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[size, 48, 48]} />
            <meshStandardMaterial
              map={texture || undefined}
              color="#ffffff"
              roughness={0.55}
              metalness={0.08}
            />

            {/* Atmospheric Cloud Layer with dynamic parallax drift */}
            <mesh ref={cloudsMeshRef}>
              <sphereGeometry args={[size * 1.02, 36, 36]} />
              <meshStandardMaterial
                map={cloudTexture || undefined}
                transparent
                opacity={0.35}
                blending={THREE.NormalBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Earth Atmosphere Fresnel Glow */}
            <mesh>
              <sphereGeometry args={[size * 1.12, 32, 32]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.3}
                side={THREE.BackSide}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
              />
            </mesh>

            {/* Subtle Mission Beacon Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[size * 1.25, size * 1.38, 32]} />
              <meshBasicMaterial
                color="#38bdf8"
                transparent
                opacity={0.7}
                side={THREE.DoubleSide}
              />
            </mesh>
          </mesh>
        </group>

        {/* Revolving Moon along lunar orbit */}
        <group ref={moonOrbitRef}>
          <mesh position={[2.8, 0, 0]}>
            <sphereGeometry args={[0.32, 20, 20]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.8} />
          </mesh>
          {/* Lunar Orbit Line */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[2.76, 2.84, 48]} />
            <meshBasicMaterial
              color="#94a3b8"
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------------------
// DynamicSaturn: Revolves around Sun, Spins on tilted axis with realistic Cassini rings
// ----------------------------------------------------------------------------------------
function DynamicSaturn({
  distance,
  orbitSpeed,
  spinSpeed,
  tilt = 0.47,
  initialAngle,
  size,
  bodyTexture,
  ringTexture,
  showAxis = false,
  speedMultiplier = 1.0,
  isHovered,
  onHover,
  onSelect,
  reducedMotion,
}: {
  distance: number;
  orbitSpeed: number;
  spinSpeed: number;
  tilt?: number;
  initialAngle: number;
  size: number;
  bodyTexture?: THREE.CanvasTexture | null;
  ringTexture?: THREE.CanvasTexture | null;
  showAxis?: boolean;
  speedMultiplier?: number;
  isHovered: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
  reducedMotion: boolean;
}) {
  const saturnGroupRef = useRef<THREE.Group>(null);
  const spinMeshRef = useRef<THREE.Mesh>(null);
  const currentAngle = useRef<number>(initialAngle);

  useFrame((_, delta) => {
    if (reducedMotion) return;

    // 1. REVOLUTION around Sun
    currentAngle.current += delta * orbitSpeed * speedMultiplier;
    if (saturnGroupRef.current) {
      saturnGroupRef.current.position.x =
        Math.cos(currentAngle.current) * distance;
      saturnGroupRef.current.position.z =
        Math.sin(currentAngle.current) * distance;
    }

    // 2. AXIAL ROTATION of body
    if (spinMeshRef.current) {
      spinMeshRef.current.rotation.y += delta * spinSpeed * speedMultiplier;
    }
  });

  const orbitGeometry = useMemo(() => {
    const pts = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * distance,
          0,
          Math.sin(theta) * distance
        )
      );
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [distance]);

  return (
    <group>
      {/* 3D Orbit Track */}
      <lineLoop geometry={orbitGeometry}>
        <lineBasicMaterial color="#38bdf8" transparent opacity={0.25} />
      </lineLoop>

      <group
        ref={saturnGroupRef}
        position={[
          Math.cos(initialAngle) * distance,
          0,
          Math.sin(initialAngle) * distance,
        ]}
      >
        {/* Saturn system tilted at 27° (0.47 rad) */}
        <group rotation={[0, 0, tilt]}>
          {showAxis && (
            <mesh>
              <cylinderGeometry args={[0.02 * size, 0.02 * size, size * 2.8, 8]} />
              <meshBasicMaterial
                color="#fde047"
                transparent
                opacity={0.45}
                depthWrite={false}
              />
            </mesh>
          )}

          {/* Actively spinning Saturn sphere */}
          <mesh
            ref={spinMeshRef}
            scale={isHovered ? 1.25 : 1.0}
            onClick={(e) => {
              e.stopPropagation();
              onSelect();
            }}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover("saturn");
              document.body.style.cursor = "pointer";
            }}
            onPointerOut={() => {
              onHover(null);
              document.body.style.cursor = "auto";
            }}
          >
            <sphereGeometry args={[size, 40, 40]} />
            <meshStandardMaterial
              map={bodyTexture || undefined}
              color="#e2c892"
              roughness={0.4}
              metalness={0.08}
            />
          </mesh>

          {/* Photorealistic Tilted Rings (with Cassini Division and Icy Sheen) */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[size * 1.32, size * 2.75, 128]} />
            <meshStandardMaterial
              map={ringTexture || undefined}
              color="#ffffff"
              side={THREE.DoubleSide}
              transparent
              opacity={0.96}
              roughness={0.25}
              metalness={0.05}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
