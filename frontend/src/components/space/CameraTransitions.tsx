"use client";

import { useEffect, useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import gsap from "gsap";
import * as THREE from "three";
import { JourneyStage } from "@/types/journey";

interface CameraTransitionsProps {
  stage: JourneyStage;
  reducedMotion?: boolean;
}

export default function CameraTransitions({
  stage,
  reducedMotion = false,
}: CameraTransitionsProps) {
  const { camera } = useThree();
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioning = useRef(true);

  useEffect(() => {
    const duration = reducedMotion ? 0.3 : 2.4;
    const ease = "power3.inOut";
    isTransitioning.current = true;

    if (stage === "space") {
      gsap.to(camera.position, {
        x: 0,
        y: 25,
        z: 180,
        duration,
        ease,
        onComplete: () => {
          isTransitioning.current = false;
        },
      });
      gsap.to(targetLookAt.current, {
        x: 0,
        y: 0,
        z: 0,
        duration,
        ease,
      });
    } else if (stage === "solar_system") {
      // Oblique 3D angle matching user reference illustration (elliptical depth perspective)
      gsap.to(camera.position, {
        x: -8,
        y: 48,
        z: 80,
        duration,
        ease,
        onComplete: () => {
          isTransitioning.current = false;
        },
      });
      gsap.to(targetLookAt.current, {
        x: 0,
        y: -1.0,
        z: 0,
        duration,
        ease,
      });
    } else if (stage === "earth") {
      gsap.to(camera.position, {
        x: 0,
        y: 2.2,
        z: 11.5,
        duration,
        ease,
        onComplete: () => {
          isTransitioning.current = false;
        },
      });
      gsap.to(targetLookAt.current, {
        x: 0,
        y: 0,
        z: 0,
        duration,
        ease,
      });
    }
  }, [stage, camera, reducedMotion]);

  useFrame(() => {
    if (isTransitioning.current) {
      camera.lookAt(targetLookAt.current);
    }
  });

  return null;
}
