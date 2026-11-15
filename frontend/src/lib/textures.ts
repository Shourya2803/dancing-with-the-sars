import * as THREE from "three";

/**
 * Creates a soft circular Gaussian glow texture for Three.js points/stars.
 * Prevents WebGL from rendering harsh square pixel blocks.
 */
export function createSoftStarTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = 32;
  const cy = 32;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 32);
  grad.addColorStop(0, "rgba(255, 255, 255, 1.0)");
  grad.addColorStop(0.15, "rgba(230, 240, 255, 0.85)");
  grad.addColorStop(0.4, "rgba(140, 190, 255, 0.25)");
  grad.addColorStop(0.75, "rgba(56, 189, 248, 0.05)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates an ultra-soft radial flare for galactic core glow.
 */
export function createCoreGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = 128;
  const cy = 128;
  const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 128);
  grad.addColorStop(0, "rgba(255, 250, 220, 0.9)");
  grad.addColorStop(0.2, "rgba(255, 220, 150, 0.5)");
  grad.addColorStop(0.5, "rgba(255, 160, 80, 0.15)");
  grad.addColorStop(0.8, "rgba(180, 100, 255, 0.03)");
  grad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}
