"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";
import { createSoftStarTexture, createCoreGlowTexture } from "@/lib/textures";

interface GalaxySceneProps {
  reducedMotion?: boolean;
}

export default function GalaxyScene({ reducedMotion = false }: GalaxySceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dustRef = useRef<THREE.Points>(null);
  const [starTexture, setStarTexture] = useState<THREE.CanvasTexture | null>(null);
  const [glowTexture, setGlowTexture] = useState<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    setStarTexture(createSoftStarTexture());
    setGlowTexture(createCoreGlowTexture());
  }, []);

  // 1. DENSE, CRISP COSMIC STARFIELD (6,000 brilliant twinkling stars)
  const [starPositions, starColors] = useMemo(() => {
    const count = 6200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const colorPalette = [
      new THREE.Color("#ffffff"), // Pure brilliant white
      new THREE.Color("#ffffff"),
      new THREE.Color("#dbeafe"), // Bright sapphire white
      new THREE.Color("#bfdbfe"),
      new THREE.Color("#7dd3fc"), // Luminous cyan
      new THREE.Color("#fef08a"), // Warm golden star
      new THREE.Color("#fed7aa"), // Amber star
      new THREE.Color("#f472b6"), // Nebula magenta star
    ];

    for (let i = 0; i < count; i++) {
      const radius = 120 + Math.pow(Math.random(), 1.5) * 600;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.95;

      positions[i * 3] = radius * Math.cos(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi);
      positions[i * 3 + 2] = radius * Math.cos(phi) * Math.sin(theta);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
    }

    return [positions, colors];
  }, []);

  // 2. PROMINENT STARBURSTS (Brilliant diffraction cross-stars like in user's reference illustration)
  const starbursts = useMemo(() => {
    const data = [];
    const count = 35;
    for (let i = 0; i < count; i++) {
      const radius = 140 + Math.random() * 320;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI * 0.8;
      const x = radius * Math.cos(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi);
      const z = radius * Math.cos(phi) * Math.sin(theta);
      const scale = 2.2 + Math.random() * 4.5;
      data.push({ x, y, z, scale });
    }
    return data;
  }, []);

  // 3. COSMIC NEBULA DUST CLOUDS (Rich magenta, indigo, and cyan galactic dust lanes)
  const [dustPositions, dustColors] = useMemo(() => {
    const count = 480;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const dustPalette = [
      new THREE.Color("#2563eb"), // Royal deep blue
      new THREE.Color("#7c3aed"), // Deep violet
      new THREE.Color("#db2777"), // Nebula magenta
      new THREE.Color("#0284c7"), // Cyan glow
      new THREE.Color("#4f46e5"), // Indigo
    ];

    for (let i = 0; i < count; i++) {
      // Sweeping diagonal celestial dust band
      const spread = (Math.random() - 0.5) * 450;
      const ySpread = spread * 0.42 + (Math.random() - 0.5) * 85;
      const zSpread = -140 + (Math.random() - 0.5) * 160;

      positions[i * 3] = spread;
      positions[i * 3 + 1] = ySpread;
      positions[i * 3 + 2] = zSpread;

      const c = dustPalette[Math.floor(Math.random() * dustPalette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    return [positions, colors];
  }, []);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.002;
    }
    if (dustRef.current) {
      dustRef.current.rotation.y += delta * 0.001;
    }
  });

  return (
    <group>
      {/* 0. HARDWARE ACCELERATED TWINKLING DEEP SPACE STARFIELD */}
      <Stars
        radius={280}
        depth={100}
        count={6500}
        factor={5.5}
        saturation={0.7}
        fade
        speed={1.2}
      />

      {/* 1. CRISP, BRILLIANT BACKGROUND STARS (sizeAttenuation: false guarantees 2.4px diamonds across the sky!) */}
      {starTexture && (
        <points ref={pointsRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={starPositions.length / 3}
              array={starPositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={starColors.length / 3}
              array={starColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            size={2.4}
            vertexColors
            transparent
            opacity={0.95}
            sizeAttenuation={false}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 2. PROMINENT STARBURST CROSS-STARS (Scattered brilliant diffraction stars from the illustration) */}
      {starbursts.map((sb, i) => (
        <group key={i} position={[sb.x, sb.y, sb.z]}>
          <mesh rotation={[0, 0, 0]}>
            <planeGeometry args={[sb.scale, sb.scale * 0.08]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[sb.scale, sb.scale * 0.08]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={0.8}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
          <mesh>
            <sphereGeometry args={[sb.scale * 0.12, 8, 8]} />
            <meshBasicMaterial color="#fef08a" />
          </mesh>
        </group>
      ))}

      {/* 3. RICH COSMIC NEBULA GLOW CLOUDS */}
      {glowTexture && (
        <points ref={dustRef}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={dustPositions.length / 3}
              array={dustPositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={dustColors.length / 3}
              array={dustColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            map={glowTexture}
            size={75}
            vertexColors
            transparent
            opacity={0.24}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
