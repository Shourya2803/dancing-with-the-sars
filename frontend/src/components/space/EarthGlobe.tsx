"use client";

import React, { useRef, useMemo, useState, useEffect, useCallback } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { soundController } from "@/lib/audio";

interface EarthGlobeProps {
  onZoomToIndia: () => void;
  reducedMotion?: boolean;
}

/**
 * Inner Earth Mesh with pre-loaded textures via Suspense.
 * Pure, pristine photorealistic Earth globe with 0 artificial dots or text clutter.
 * Supports interactive left/right mouse drag rotation and scroll-to-zoom dive into India.
 */
function TexturedEarth({
  onZoomToIndia,
  reducedMotion,
}: {
  onZoomToIndia: () => void;
  reducedMotion: boolean;
}) {
  const { camera, gl } = useThree();
  const earthMeshRef = useRef<THREE.Mesh>(null);
  const cloudsMeshRef = useRef<THREE.Mesh>(null);
  const isDiving = useRef(false);
  const isDragging = useRef(false);
  const prevMouseX = useRef(0);
  const dragVelocity = useRef(0);

  // Load NASA Blue Marble photorealistic textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useTexture([
    "/earth_vibrant_2048.jpg",
    "/earth_normal_2048.jpg",
    "/earth_specular_2048.jpg",
    "/earth_clouds_1024.png",
  ]);

  useMemo(() => {
    colorMap.colorSpace = THREE.SRGBColorSpace;
    colorMap.anisotropy = 8;
    normalMap.anisotropy = 8;
    specularMap.anisotropy = 8;
    cloudsMap.anisotropy = 8;
  }, [colorMap, normalMap, specularMap, cloudsMap]);

  // Indian Subcontinent Coordinates (for smooth camera dive into India)
  // Latitude: 22.0°N, Longitude: 82.5°E
  const indiaCenterPos = useMemo(() => {
    const R = 4.0;
    const latRad = (22.0 * Math.PI) / 180;
    const lonRad = ((82.5 - 90) * Math.PI) / 180;

    const x = R * Math.cos(latRad) * Math.sin(lonRad);
    const y = R * Math.sin(latRad);
    const z = R * Math.cos(latRad) * Math.cos(lonRad);
    return new THREE.Vector3(x, y, z);
  }, []);

  // Smooth Zoom Dive: Accelerates camera directly into India and transitions to India map
  const triggerZoomDive = useCallback(() => {
    if (isDiving.current) return;
    isDiving.current = true;
    soundController.playPing(1100, 0.25);

    // Compute current world position of India taking Earth's rotation into account
    const targetWorldPos = new THREE.Vector3();
    if (earthMeshRef.current) {
      targetWorldPos.copy(indiaCenterPos);
      targetWorldPos.applyMatrix4(earthMeshRef.current.matrixWorld);
    } else {
      targetWorldPos.copy(indiaCenterPos);
    }

    const camTargetPos = targetWorldPos.clone().normalize().multiplyScalar(4.4);

    // Smooth GSAP dive animation into India
    gsap.to(camera.position, {
      x: camTargetPos.x,
      y: camTargetPos.y,
      z: camTargetPos.z,
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.lookAt(targetWorldPos);
      },
      onComplete: () => {
        onZoomToIndia();
      },
    });
  }, [camera, onZoomToIndia, indiaCenterPos]);

  // 1. Mouse Drag Left/Right to rotate Earth
  useEffect(() => {
    const dom = gl.domElement;

    const handlePointerDown = (e: PointerEvent) => {
      if (e.button !== 0) return;
      isDragging.current = true;
      prevMouseX.current = e.clientX;
      dragVelocity.current = 0;
      dom.style.cursor = "grabbing";
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging.current || isDiving.current) return;
      const deltaX = e.clientX - prevMouseX.current;
      prevMouseX.current = e.clientX;

      // Rotate Earth & cloud layer horizontally
      const rotDelta = deltaX * 0.0055;
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += rotDelta;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += rotDelta;
      }
      dragVelocity.current = rotDelta;
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      dom.style.cursor = "grab";
    };

    dom.style.cursor = "grab";
    dom.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      dom.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [gl]);

  // 2. Mouse Wheel Scroll (zooming into Earth triggers dive into India map)
  useEffect(() => {
    let scrollAccumulator = 0;
    const handleWheel = (e: WheelEvent) => {
      if (isDiving.current) return;
      if (e.deltaY < 0) {
        // Scrolling wheel forward (zooming in)
        scrollAccumulator += Math.abs(e.deltaY);
        if (scrollAccumulator > 70) {
          triggerZoomDive();
        }
      } else {
        scrollAccumulator = Math.max(0, scrollAccumulator - 25);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [triggerZoomDive]);

  // Continuous planetary rotation and inertia drift
  useFrame((_, delta) => {
    if (isDiving.current) return;

    if (!isDragging.current) {
      // Natural steady spin + momentum inertia decay
      const baseSpin = reducedMotion ? 0 : delta * 0.045;
      const cloudDrift = reducedMotion ? 0 : delta * 0.065;
      const currentInertia = dragVelocity.current;

      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += baseSpin + currentInertia;
      }
      if (cloudsMeshRef.current) {
        cloudsMeshRef.current.rotation.y += cloudDrift + currentInertia;
      }

      // Smooth inertia damping
      dragVelocity.current *= 0.94;
    }

    // Camera proximity threshold dive
    const dist = camera.position.length();
    if (dist < 7.2) {
      triggerZoomDive();
    }
  });

  return (
    <group>
      {/* 1. PHOTOREALISTIC BLUE MARBLE EARTH SPHERE (Clean, 0 blue dots) */}
      <mesh ref={earthMeshRef}>
        <sphereGeometry args={[4.0, 64, 64]} />
        <meshStandardMaterial
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          roughnessMap={specularMap}
          roughness={0.65}
          metalness={0.08}
        />
      </mesh>

      {/* 2. TRANSLUCENT ATMOSPHERIC CLOUD SPHERE */}
      <mesh ref={cloudsMeshRef}>
        <sphereGeometry args={[4.04, 64, 64]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent
          opacity={0.34}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 3. ELECTRIC CYAN ATMOSPHERIC FRESNEL LIMB GLOW */}
      <mesh>
        <sphereGeometry args={[4.16, 64, 64]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.24}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. OUTER EXOSPHERE SCATTERING HALO */}
      <mesh>
        <sphereGeometry args={[4.32, 48, 48]} />
        <meshBasicMaterial
          color="#0284c7"
          transparent
          opacity={0.12}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function EarthGlobe({
  onZoomToIndia,
  reducedMotion = false,
}: EarthGlobeProps) {
  return (
    <group position={[0, 0, 0]}>
      {/* Interactive 3D OrbitControls (Smooth left/right horizontal camera orbit) */}
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.08}
        maxDistance={22}
        minDistance={5.2}
        rotateSpeed={0.9}
        zoomSpeed={0.85}
        enablePan={false}
      />

      {/* Cinematic 3-Point Planetary Lighting */}
      <directionalLight
        position={[14, 7, 12]}
        intensity={2.6}
        color="#fffbf0"
      />
      <directionalLight
        position={[-12, 4, -8]}
        intensity={0.8}
        color="#38bdf8"
      />
      <ambientLight intensity={0.36} color="#0f172a" />

      {/* Textured Earth with React Suspense integration */}
      <React.Suspense fallback={null}>
        <TexturedEarth
          onZoomToIndia={onZoomToIndia}
          reducedMotion={reducedMotion}
        />
      </React.Suspense>
    </group>
  );
}
