"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface AsteroidBeltProps {
  reducedMotion?: boolean;
  speedMultiplier?: number;
}

export default function AsteroidBelt({
  reducedMotion = false,
  speedMultiplier = 1.0,
}: AsteroidBeltProps) {
  const count = 2200;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Generate varied asteroid sizes, distances concentrated between Mars (27.8) and Jupiter (42.5)
  const asteroids = useMemo(() => {
    const data = [];
    const colorChoices = [
      new THREE.Color("#ffffff"), // Pure sparkling crystalline white
      new THREE.Color("#f8fafc"),
      new THREE.Color("#f1f5f9"),
      new THREE.Color("#fed7aa"), // Warm amber silicate
      new THREE.Color("#fef08a"), // Golden sunlight reflection
      new THREE.Color("#cbd5e1"), // Nickel-iron metallic rock
      new THREE.Color("#94a3b8"),
    ];

    for (let i = 0; i < count; i++) {
      // Main Asteroid Belt: concentrated between radii 30.5 and 39.0 with natural Gaussian thickness
      const radius = 30.5 + Math.pow(Math.random(), 1.15) * 8.5;
      const angle = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 2.8;

      // Tiered sizing: few large boulders, many medium and small glittering rocks
      const rRand = Math.random();
      const scale =
        rRand > 0.92
          ? 0.38 + Math.random() * 0.42 // Large boulders
          : rRand > 0.45
          ? 0.18 + Math.random() * 0.22 // Medium faceted rocks
          : 0.08 + Math.random() * 0.12; // Small sparkling dust rocks

      const rotX = Math.random() * Math.PI * 2;
      const rotY = Math.random() * Math.PI * 2;
      const rotZ = Math.random() * Math.PI * 2;

      const color = colorChoices[Math.floor(Math.random() * colorChoices.length)];

      data.push({ radius, angle, y, scale, rotX, rotY, rotZ, color });
    }
    return data;
  }, [count]);

  // Set instance matrices and individual rock colors when mounted
  useEffect(() => {
    if (!meshRef.current) return;
    asteroids.forEach((ast, i) => {
      const x = Math.cos(ast.angle) * ast.radius;
      const z = Math.sin(ast.angle) * ast.radius;

      dummy.position.set(x, ast.y, z);
      dummy.rotation.set(ast.rotX, ast.rotY, ast.rotZ);
      dummy.scale.set(
        ast.scale,
        ast.scale * (0.75 + Math.random() * 0.5),
        ast.scale
      );
      dummy.updateMatrix();

      meshRef.current?.setMatrixAt(i, dummy.matrix);
      meshRef.current?.setColorAt(i, ast.color);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  }, [asteroids, dummy]);

  // Continuous orbital revolution of the entire belt
  useFrame((_, delta) => {
    if (reducedMotion) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08 * speedMultiplier;
    }
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[1, 0]} />
        {/* Bright, luminous, sparkling crystalline space rocks catching brilliant sunlight */}
        <meshStandardMaterial
          color="#ffffff"
          emissive="#cbd5e1"
          emissiveIntensity={0.8}
          roughness={0.2}
          metalness={0.15}
          flatShading
        />
      </instancedMesh>
    </group>
  );
}
