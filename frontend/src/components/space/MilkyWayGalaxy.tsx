"use client";

import React, { useMemo, useRef, useState, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { createSoftStarTexture, createCoreGlowTexture } from "@/lib/textures";

interface MilkyWayGalaxyProps {
  onZoomComplete?: () => void;
  reducedMotion?: boolean;
}

export default function MilkyWayGalaxy({
  onZoomComplete,
  reducedMotion = false,
}: MilkyWayGalaxyProps) {
  const { camera } = useThree();
  const galaxyGroupRef = useRef<THREE.Group>(null);
  const discMeshRef = useRef<THREE.Mesh>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const warpStarsRef = useRef<THREE.Points>(null);

  const [galaxyTexture, setGalaxyTexture] = useState<THREE.CanvasTexture | null>(null);
  const [starTexture, setStarTexture] = useState<THREE.CanvasTexture | null>(null);
  const [coreGlowTex, setCoreGlowTex] = useState<THREE.CanvasTexture | null>(null);
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [galaxyOpacity, setGalaxyOpacity] = useState<number>(0.98);

  // 1. Initialize soft textures and load the user's exact galaxy image
  useEffect(() => {
    if (typeof window === "undefined") return;

    camera.position.set(0, 0, 56);
    camera.lookAt(0, 0, 0);

    setStarTexture(createSoftStarTexture());
    setCoreGlowTex(createCoreGlowTexture());

    const img = new Image();
    img.src = "/milkyway.jpg";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const cx = 512;
      const cy = 512;
      const radius = 500;

      const grad = ctx.createRadialGradient(cx, cy, radius * 0.45, cx, cy, radius);
      grad.addColorStop(0.0, "rgba(0, 0, 0, 1.0)");
      grad.addColorStop(0.65, "rgba(0, 0, 0, 0.98)");
      grad.addColorStop(0.85, "rgba(0, 0, 0, 0.55)");
      grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

      ctx.globalCompositeOperation = "destination-in";
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.generateMipmaps = true;
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.needsUpdate = true;
      setGalaxyTexture(tex);
    };
  }, [camera]);

  // 2. Spiral arm stars
  const [starPositions, starColors, starSizes] = useMemo(() => {
    const count = 3500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color("#ffffff"),
      new THREE.Color("#dbeafe"),
      new THREE.Color("#93c5fd"),
      new THREE.Color("#fef08a"),
      new THREE.Color("#fca5a5"),
    ];

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.pow(Math.random(), 1.4) * 36;
      const arm = (i % 2) * Math.PI;
      const angle = radius * 0.18 + arm + (Math.random() - 0.5) * 0.4;

      positions[i * 3] = Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 1] = Math.sin(angle) * radius + (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 2.0 * Math.exp(-radius / 30);

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 1.2 + 0.4;
    }

    return [positions, colors, sizes];
  }, []);

  // 3. High-Speed Warp / Star-Streak Particles (activate during zoom)
  const [warpPositions, warpColors] = useMemo(() => {
    const count = 1200;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 25;
      positions[i * 3 + 2] = Math.random() * 60; // Spread along Z axis

      colors[i * 3] = 0.6 + Math.random() * 0.4;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;
    }

    return [positions, colors];
  }, []);

  // 4. Trigger Zoom: Auto-triggers after exactly 3.0 seconds, OR on click
  const triggerZoom = () => {
    if (isZooming) return;
    setIsZooming(true);

    const tl = gsap.timeline({
      onComplete: () => {
        if (onZoomComplete) {
          onZoomComplete();
        }
      },
    });

    // Cinematic camera flight accelerating into the Orion Arm
    tl.to(camera.position, {
      x: 5.5,
      y: 3.5,
      z: 2.0,
      duration: 3.0,
      ease: "power2.inOut",
    });

    // Slight angle shift to transition from face-on into ecliptic plane
    tl.to(
      camera.rotation,
      {
        x: 0.35,
        y: -0.2,
        z: 0.15,
        duration: 3.0,
        ease: "power2.inOut",
      },
      "<"
    );

    // Fade out galaxy disc as camera punches through
    tl.to(
      {},
      {
        duration: 3.0,
        onUpdate: function () {
          const progress = this.progress();
          if (progress > 0.6) {
            setGalaxyOpacity(Math.max(0, 1 - (progress - 0.6) * 2.5));
          }
        },
      },
      "<"
    );
  };

  // Set 3.0s auto-zoom timer on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      triggerZoom();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // 5. Continuous animation
  useFrame(({ mouse }, delta) => {
    if (reducedMotion) return;

    if (galaxyGroupRef.current) {
      // Slow majestic rotation
      galaxyGroupRef.current.rotation.z += delta * 0.05;

      if (!isZooming) {
        // Subtle mouse parallax
        galaxyGroupRef.current.rotation.x = THREE.MathUtils.lerp(
          galaxyGroupRef.current.rotation.x,
          mouse.y * 0.12,
          0.04
        );
        galaxyGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          galaxyGroupRef.current.rotation.y,
          mouse.x * 0.12,
          0.04
        );
      }
    }

    // Warp stars movement during zoom
    if (isZooming && warpStarsRef.current) {
      warpStarsRef.current.position.z += delta * 25;
    }
  });

  return (
    <group ref={galaxyGroupRef} onClick={triggerZoom}>
      {/* 1. Main Milky Way Galactic Disc */}
      {galaxyTexture && (
        <mesh ref={discMeshRef} position={[0, 0, 0]}>
          <planeGeometry args={[62, 62, 32, 32]} />
          <meshBasicMaterial
            map={galaxyTexture}
            transparent
            opacity={galaxyOpacity}
            side={THREE.DoubleSide}
            blending={THREE.NormalBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 2. Soft Central Core Glow */}
      {coreGlowTex && (
        <mesh ref={coreMeshRef} position={[0, 0, 0.05]}>
          <planeGeometry args={[22, 22]} />
          <meshBasicMaterial
            map={coreGlowTex}
            transparent
            opacity={galaxyOpacity * 0.65}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* 3. Delicate Shimmering 3D Stars */}
      {starTexture && (
        <points ref={particlesRef}>
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
            <bufferAttribute
              attach="attributes-size"
              count={starSizes.length}
              array={starSizes}
              itemSize={1}
            />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            size={0.9}
            vertexColors
            transparent
            opacity={galaxyOpacity * 0.7}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}

      {/* 4. Warp Stars for Cinematic Flight Rush (visible during zoom) */}
      {isZooming && starTexture && (
        <points ref={warpStarsRef} position={[0, 0, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={warpPositions.length / 3}
              array={warpPositions}
              itemSize={3}
            />
            <bufferAttribute
              attach="attributes-color"
              count={warpColors.length / 3}
              array={warpColors}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            map={starTexture}
            size={1.5}
            vertexColors
            transparent
            opacity={0.85}
            sizeAttenuation
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </points>
      )}
    </group>
  );
}
