import * as THREE from "three";

/**
 * Eye-pleasing, luminous, vibrant procedural planetary textures:
 * - Sun: Fiery incandescent plasma matching user's photo (deep orange/gold, dark eruptive prominence, granulation)
 * - Earth: Brilliant royal blue oceans, lush emerald continents, crisp white swirling clouds
 * - Mars: Luminous fiery terracotta rust, dark basaltic volcanic plains, sparkling white ice caps
 * - Jupiter: Vibrant caramel, buttercream, and amber atmospheric bands with bold crimson Great Red Spot
 * - Saturn: Warm golden-honey gas giant body with photorealistic Cassini division icy rings
 * - Venus: Iridescent golden-butterscotch swirling cloud veil
 * - Mercury: Silvery-slate cratered lunar surface with bright ray ejecta
 * - Uranus: Electric glowing neon cyan
 * - Neptune: Deep vivid royal sapphire azure with white methane cirrus cloud streaks
 */

// ----------------------------------------------------------------------------------------
// 1. PHOTOREALISTIC FIERY SUN (Exact recreation of user's uploaded reference screenshot)
// ----------------------------------------------------------------------------------------
export function createSunTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // 1. Base fiery plasma gradient: warm deep orange-red limb to rich incandescent amber equator
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0.0, "#b91c1c"); // Deep orange-red at pole
  grad.addColorStop(0.18, "#c2410c");
  grad.addColorStop(0.32, "#ea580c"); // Rich plasma orange
  grad.addColorStop(0.5, "#f97316");  // Blazing incandescent amber equator
  grad.addColorStop(0.68, "#ea580c");
  grad.addColorStop(0.82, "#c2410c");
  grad.addColorStop(1.0, "#b91c1c");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 512);

  // 2. Polar Pinching Convergence Striations at North & South Poles (creates exact polar vortex in user's image)
  ctx.strokeStyle = "rgba(90, 8, 0, 0.8)";
  ctx.lineWidth = 2.4;
  for (let x = 0; x < 1024; x += 10) {
    const len = 35 + Math.sin(x * 0.1) * 18 + Math.random() * 24;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, len);
    ctx.stroke();

    // South pole
    ctx.beginPath();
    ctx.moveTo(x, 512);
    ctx.lineTo(x + (Math.random() - 0.5) * 6, 512 - len * 0.7);
    ctx.stroke();
  }

  // 3. Dense Solar Plasma Granulation & Boiling Convection Stipples
  for (let i = 0; i < 950; i++) {
    const x = Math.random() * 1024;
    const y = 35 + Math.random() * 442;
    const r = 2.2 + Math.random() * 7.5;

    // Dark reddish-brown spots/stipples
    ctx.fillStyle = "rgba(85, 8, 0, 0.7)";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 4. Golden Flare Granules
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * 1024;
    const y = 45 + Math.random() * 422;
    const r = 2.0 + Math.random() * 9.0;

    const flareGrad = ctx.createRadialGradient(x, y, 0, x, y, r);
    flareGrad.addColorStop(0.0, "rgba(255, 255, 210, 0.85)");
    flareGrad.addColorStop(0.4, "rgba(254, 180, 40, 0.5)");
    flareGrad.addColorStop(1.0, "rgba(234, 88, 12, 0)");

    ctx.fillStyle = flareGrad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // 5. THE TWO PROMINENT DARK SERPENTINE FILAMENTS across the face (exact match to user's photo!)
  ctx.strokeStyle = "rgba(40, 2, 0, 0.95)";
  ctx.lineWidth = 6.5;
  ctx.lineCap = "round";

  // Filament 1 (Left curved eyebrow-like filament)
  ctx.beginPath();
  ctx.moveTo(210, 215);
  ctx.bezierCurveTo(260, 285, 335, 305, 415, 265);
  ctx.stroke();

  // Filament 2 (Right wavy curved filament)
  ctx.beginPath();
  ctx.moveTo(565, 255);
  ctx.bezierCurveTo(635, 215, 715, 245, 785, 235);
  ctx.stroke();

  // Secondary filament branches
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  ctx.moveTo(175, 285);
  ctx.bezierCurveTo(215, 315, 255, 305, 295, 335);
  ctx.stroke();

  // 6. "STARS SORT OF THING INSIDE" — Sparkling golden/white 4-point cross stars on the Sun
  const flarePoints = [
    { x: 310, y: 185, r: 5.5 },
    { x: 475, y: 175, r: 6.0 },
    { x: 665, y: 165, r: 5.0 },
    { x: 375, y: 315, r: 4.5 },
    { x: 525, y: 305, r: 5.5 },
    { x: 735, y: 295, r: 6.0 },
    { x: 255, y: 245, r: 4.0 },
    { x: 815, y: 215, r: 5.0 },
  ];

  flarePoints.forEach((fp) => {
    // White-hot core
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(fp.x, fp.y, fp.r * 0.6, 0, Math.PI * 2);
    ctx.fill();

    // 4-point cross star spikes
    ctx.strokeStyle = "rgba(255, 255, 220, 0.9)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(fp.x - fp.r * 2.8, fp.y);
    ctx.lineTo(fp.x + fp.r * 2.8, fp.y);
    ctx.moveTo(fp.x, fp.y - fp.r * 2.8);
    ctx.lineTo(fp.x, fp.y + fp.r * 2.8);
    ctx.stroke();
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 2. SUN CORONAL GLOW SPRITE (Soft golden-amber halo bloom)
// ----------------------------------------------------------------------------------------
export function createSunGlowTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const center = 256;
  const radGrad = ctx.createRadialGradient(center, center, 0, center, center, 256);
  radGrad.addColorStop(0.0, "rgba(249, 115, 22, 0.35)"); // Soft warm amber aura
  radGrad.addColorStop(0.3, "rgba(234, 88, 12, 0.25)");
  radGrad.addColorStop(0.65, "rgba(185, 28, 28, 0.12)");
  radGrad.addColorStop(0.85, "rgba(80, 5, 20, 0.04)");
  radGrad.addColorStop(1.0, "rgba(0, 0, 0, 0)");

  ctx.fillStyle = radGrad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ----------------------------------------------------------------------------------------
// 3. EYE-PLEASING, VIBRANT EARTH (Royal Azure Oceans, Emerald Continents, White Ice)
// ----------------------------------------------------------------------------------------
export function createEarthTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Luminous Royal Azure Ocean
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0.0, "#082f49");
  oceanGrad.addColorStop(0.25, "#0284c7");
  oceanGrad.addColorStop(0.5, "#0369a1"); // Rich royal blue
  oceanGrad.addColorStop(0.75, "#0284c7");
  oceanGrad.addColorStop(1.0, "#082f49");
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Sparkling tropical turquoise continental shelves
  ctx.fillStyle = "rgba(56, 189, 248, 0.55)";
  ctx.beginPath();
  ctx.ellipse(710, 220, 210, 110, 0, 0, Math.PI * 2);
  ctx.ellipse(320, 260, 160, 140, 0, 0, Math.PI * 2);
  ctx.fill();

  // Continental Landmasses - Lush vibrant emerald greens & rich golden ochres
  // Eurasia
  ctx.fillStyle = "#16a34a"; // Vivid emerald green
  ctx.beginPath();
  ctx.ellipse(680, 180, 180, 90, -0.08, 0, Math.PI * 2);
  ctx.fill();

  // Indian Subcontinent (Target sequence)
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.moveTo(700, 188);
  ctx.lineTo(760, 202);
  ctx.lineTo(735, 278);
  ctx.closePath();
  ctx.fill();

  // Africa (warm Sahara ochre + lush rainforest interior)
  ctx.fillStyle = "#eab308";
  ctx.beginPath();
  ctx.ellipse(560, 240, 75, 45, 0, 0, Math.PI * 2); // Sahara
  ctx.fill();
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.ellipse(570, 310, 70, 75, 0.05, 0, Math.PI * 2); // Congo & Southern Africa
  ctx.fill();

  // North America
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.ellipse(260, 175, 125, 80, 0.18, 0, Math.PI * 2);
  ctx.fill();

  // South America
  ctx.fillStyle = "#15803d";
  ctx.beginPath();
  ctx.ellipse(335, 335, 70, 105, 0.15, 0, Math.PI * 2);
  ctx.fill();

  // Australia (Red outback interior + coastal greenery)
  ctx.fillStyle = "#ea580c";
  ctx.beginPath();
  ctx.ellipse(840, 360, 55, 40, 0, 0, Math.PI * 2);
  ctx.fill();

  // Polar Ice Caps (pure clean white)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1024, 28);
  ctx.fillRect(0, 484, 1024, 28);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 4. EARTH CLOUDS TEXTURE (Bright white swirling cyclonic storm systems)
// ----------------------------------------------------------------------------------------
export function createEarthCloudTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.clearRect(0, 0, 1024, 512);

  // Swirling white clouds
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 1024;
    const y = 35 + Math.random() * 442;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      35 + Math.random() * 85,
      8 + Math.random() * 20,
      (Math.random() - 0.5) * 0.4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Tropical convergence storm belt
  ctx.fillStyle = "rgba(255, 255, 255, 0.65)";
  for (let x = 0; x < 1024; x += 28) {
    const y = 256 + Math.sin(x * 0.02) * 15;
    ctx.beginPath();
    ctx.arc(x, y, 12 + Math.random() * 14, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 5. EYE-PLEASING JUPITER TEXTURE (Vivid caramel/cream stripes & Great Red Spot)
// ----------------------------------------------------------------------------------------
export function createJupiterTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Atmospheric Bands: rich golden caramel, cream, warm ochre, chestnut
  const bands = [
    "#c2410c", "#fde047", "#d97706", "#fef3c7", "#9a3412",
    "#fef08a", "#7c2d12", "#fef3c7", "#ea580c", "#fde68a",
    "#9a3412", "#fef08a", "#7c2d12", "#d97706"
  ];

  const bandH = 512 / bands.length;
  for (let i = 0; i < bands.length; i++) {
    ctx.fillStyle = bands[i];
    ctx.fillRect(0, i * bandH, 1024, bandH + 2);

    // Turbulent atmospheric eddies & jet stream waves
    ctx.fillStyle = "rgba(0, 0, 0, 0.12)";
    for (let x = 0; x < 1024; x += 18) {
      const yOffset = Math.sin(x * 0.06) * 5;
      ctx.fillRect(x, i * bandH + yOffset, 10, bandH * 0.6);
    }
  }

  // The Great Red Spot (high-contrast anticyclonic storm at southern hemisphere)
  const spotX = 640;
  const spotY = 345;
  const spotGrad = ctx.createRadialGradient(spotX, spotY, 4, spotX, spotY, 56);
  spotGrad.addColorStop(0.0, "#991b1b"); // Crimson center
  spotGrad.addColorStop(0.35, "#dc2626"); // Vivid red core
  spotGrad.addColorStop(0.7, "#f97316"); // Fiery orange rim
  spotGrad.addColorStop(1.0, "rgba(249, 115, 22, 0)");

  ctx.fillStyle = spotGrad;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, 64, 38, 0.08, 0, Math.PI * 2);
  ctx.fill();

  // White storm oval nearby
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(spotX - 100, spotY + 45, 16, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 6. SATURN BODY TEXTURE (Warm golden-honey atmosphere)
// ----------------------------------------------------------------------------------------
export function createSaturnTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const bands = [
    "#a16207", "#ca8a04", "#eab308", "#fde047", "#fef08a",
    "#fef9c3", "#fde047", "#eab308", "#ca8a04", "#a16207",
    "#eab308", "#fef08a", "#ca8a04", "#a16207"
  ];

  const bandH = 512 / bands.length;
  for (let i = 0; i < bands.length; i++) {
    ctx.fillStyle = bands[i];
    ctx.fillRect(0, i * bandH, 1024, bandH + 2);
  }

  // Soft atmospheric haze
  const haze = ctx.createLinearGradient(0, 0, 0, 512);
  haze.addColorStop(0, "rgba(120, 80, 20, 0.25)");
  haze.addColorStop(0.5, "rgba(255, 250, 200, 0.15)");
  haze.addColorStop(1, "rgba(120, 80, 20, 0.25)");
  ctx.fillStyle = haze;
  ctx.fillRect(0, 0, 1024, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 7. REALISTIC SATURN RINGS TEXTURE (Cassini Division Gap, Fine Icy Grooves, Golden Sheen)
// ----------------------------------------------------------------------------------------
export function createSaturnRingTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Photorealistic ring profile with Cassini division transparent gap
  const grad = ctx.createLinearGradient(0, 0, 1024, 0);
  grad.addColorStop(0.0, "rgba(0,0,0,0)");
  grad.addColorStop(0.04, "rgba(180, 150, 100, 0.2)"); // C Ring (Crepe ring)
  grad.addColorStop(0.16, "rgba(210, 185, 140, 0.5)");
  grad.addColorStop(0.24, "rgba(255, 235, 190, 0.95)"); // B Ring (Brightest, dense ice)
  grad.addColorStop(0.54, "rgba(240, 215, 165, 0.92)");
  grad.addColorStop(0.58, "rgba(0, 0, 0, 0.0)");       // CASSINI DIVISION (TRANSPARENT GAP!)
  grad.addColorStop(0.63, "rgba(0, 0, 0, 0.0)");       // Gap width
  grad.addColorStop(0.66, "rgba(225, 200, 155, 0.88)"); // A Ring
  grad.addColorStop(0.85, "rgba(205, 180, 135, 0.75)");
  grad.addColorStop(0.89, "rgba(0, 0, 0, 0.05)");      // Encke Gap
  grad.addColorStop(0.93, "rgba(195, 170, 125, 0.5)");  // Outer A Ring
  grad.addColorStop(0.96, "rgba(180, 150, 105, 0.3)");  // F Ring
  grad.addColorStop(1.0, "rgba(0,0,0,0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 1024, 64);

  // Fine concentric micro-grooves
  ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
  for (let x = 250; x < 950; x += 12) {
    ctx.fillRect(x, 0, 2, 64);
  }

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// ----------------------------------------------------------------------------------------
// 8. EYE-PLEASING MARS TEXTURE (Vivid Terracotta Rust, Dark Basalt, Bright White Ice Caps)
// ----------------------------------------------------------------------------------------
export function createMarsTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  // Luminous terracotta rust-orange
  ctx.fillStyle = "#ea580c";
  ctx.fillRect(0, 0, 512, 256);

  // Dark volcanic basaltic plains (Syrtis Major & Acidalia Planitia)
  ctx.fillStyle = "#7c2d12";
  for (let i = 0; i < 45; i++) {
    const x = Math.random() * 512;
    const y = 35 + Math.random() * 186;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      22 + Math.random() * 55,
      10 + Math.random() * 26,
      Math.random() * 0.5,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Brilliant Polar Ice Caps
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(256, 8, 80, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(256, 248, 60, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 9. EYE-PLEASING VENUS TEXTURE (Iridescent Buttercream Golden Cloud Veil)
// ----------------------------------------------------------------------------------------
export function createVenusTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#d97706");
  grad.addColorStop(0.5, "#fde047");
  grad.addColorStop(1, "#b45309");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "rgba(254, 249, 195, 0.45)";
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      45 + Math.random() * 100,
      8 + Math.random() * 20,
      0.15,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 10. EYE-PLEASING MERCURY TEXTURE (Silvery Moon Cratered Surface)
// ----------------------------------------------------------------------------------------
export function createMercuryTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = "#94a3b8";
  ctx.fillRect(0, 0, 512, 256);

  // Dark maria basins
  ctx.fillStyle = "#475569";
  for (let i = 0; i < 70; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(x, y, 3 + Math.random() * 9, 0, Math.PI * 2);
    ctx.fill();
  }

  // Sparkling white impact ray craters
  ctx.fillStyle = "#f1f5f9";
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 256;
    ctx.beginPath();
    ctx.arc(x, y, 2 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 11. EYE-PLEASING NEPTUNE TEXTURE (Royal Azure with White Methane Clouds)
// ----------------------------------------------------------------------------------------
export function createNeptuneTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#1e40af");
  grad.addColorStop(0.5, "#3b82f6"); // Bright vibrant azure
  grad.addColorStop(1, "#1d4ed8");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  for (let i = 0; i < 30; i++) {
    const x = Math.random() * 512;
    const y = 60 + Math.random() * 135;
    ctx.beginPath();
    ctx.ellipse(
      x,
      y,
      35 + Math.random() * 75,
      3 + Math.random() * 7,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

// ----------------------------------------------------------------------------------------
// 12. EYE-PLEASING URANUS TEXTURE (Electric Cyan / Aquamarine Ice Giant)
// ----------------------------------------------------------------------------------------
export function createUranusTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const grad = ctx.createLinearGradient(0, 0, 0, 256);
  grad.addColorStop(0, "#0891b2");
  grad.addColorStop(0.5, "#22d3ee"); // Glowing electric cyan
  grad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 256);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}
