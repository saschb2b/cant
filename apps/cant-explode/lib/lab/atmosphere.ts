import type { Grid } from "./types";
import { getCell, setCell } from "./grid";
import { createParticle } from "./simulation";

type RGB = [number, number, number];

/** Cloud types for visual variety. */
type CloudType = "cumulus" | "cirrus" | "stratus";

/** A single puff (sub-blob) within a cloud. */
interface Puff {
  ox: number;
  oy: number;
  r: number;
  /** Noise seed for unique edge shape per puff. */
  seed: number;
}

/** A single cloud made of overlapping puffs. */
interface Cloud {
  x: number;
  y: number;
  moisture: number;
  drift: number;
  puffs: Puff[];
  halfW: number;
  halfH: number;
  type: CloudType;
  /** Age in frames, used for slow morphing. */
  age: number;
  /** Vertical drift speed for height variation. */
  driftY: number;
}

export interface Atmosphere {
  /** Current interpolated sky color at the top of the canvas. */
  skyTop: RGB;
  /** Current interpolated sky color at the bottom of the canvas. */
  skyBottom: RGB;
  /** Normalized element influence values (0-1), smoothly interpolated. */
  fire: number;
  water: number;
  plant: number;
  smoke: number;
  lava: number;
  /** Frame counter for ambient animations. */
  frame: number;
  /** Active clouds drifting across the sky. */
  clouds: Cloud[];
  /** Accumulated steam that hasn't yet formed a cloud. */
  steamBuffer: number;
  /**
   * Day-night cycle progress 0-1.
   * 0.00 = midnight, 0.25 = dawn, 0.50 = noon, 0.75 = dusk.
   */
  timeOfDay: number;
  /** How "day" the current interpolated light level is (0=night, 1=day). */
  daylight: number;
  /** Accumulated humidity 0-1, builds from water/steam, decays slowly. */
  humidity: number;
}

/**
 * Sky phases for the day-night cycle.
 * Each phase defines top and bottom gradient colors.
 */
const SKY_NIGHT = { top: [8, 10, 25] as RGB, bottom: [12, 15, 22] as RGB };
const SKY_DAWN = { top: [55, 35, 75] as RGB, bottom: [200, 120, 70] as RGB };
const SKY_DAY = { top: [95, 155, 215] as RGB, bottom: [165, 205, 235] as RGB };
const SKY_DUSK = { top: [65, 35, 55] as RGB, bottom: [210, 100, 50] as RGB };

/** Frames per full day-night cycle. ~60fps * 120s = 2 minute cycle. */
const CYCLE_LENGTH = 7200;

/** Sun arc parameters. */
const SUN_RADIUS = 4;
const SUN_GLOW_RADIUS = 12;
/** Moon arc parameters. */
const MOON_RADIUS = 3;
const MOON_GLOW_RADIUS = 7;
/** Horizon line in grid y coordinates (below this = "underground"). */
const HORIZON_Y = 50;

/** Maximum number of clouds at once. */
const MAX_CLOUDS = 6;
/** Cloud band: clouds live in the upper portion of the grid. */
const CLOUD_Y_MIN = 5;
const CLOUD_Y_MAX = 45;
/** Steam needed to form a new cloud. */
const STEAM_THRESHOLD = 5;

export function createAtmosphere(): Atmosphere {
  return {
    skyTop: [...SKY_NIGHT.top],
    skyBottom: [...SKY_NIGHT.bottom],
    fire: 0,
    water: 0,
    plant: 0,
    smoke: 0,
    lava: 0,
    frame: 0,
    clouds: [],
    steamBuffer: 0,
    timeOfDay: 0,
    daylight: 0,
    humidity: 0,
  };
}

/** Lerp between two RGB colors. */
function lerpC(a: RGB, b: RGB, f: number): RGB {
  return [
    a[0] + (b[0] - a[0]) * f,
    a[1] + (b[1] - a[1]) * f,
    a[2] + (b[2] - a[2]) * f,
  ];
}

/** Smooth easing for more natural transitions. */
function ease(t: number): number {
  return t * t * (3 - 2 * t);
}

/**
 * Interpolate between sky phases based on time of day (0-1).
 * Longer, smoother transitions with proper easing.
 */
function getBaseSky(t: number): { top: RGB; bottom: RGB; daylight: number } {
  if (t < 0.15) {
    // Deep night
    return { top: SKY_NIGHT.top, bottom: SKY_NIGHT.bottom, daylight: 0 };
  } else if (t < 0.27) {
    // Night -> Dawn (longer transition)
    const f = ease((t - 0.15) / 0.12);
    return {
      top: lerpC(SKY_NIGHT.top, SKY_DAWN.top, f),
      bottom: lerpC(SKY_NIGHT.bottom, SKY_DAWN.bottom, f),
      daylight: f * 0.3,
    };
  } else if (t < 0.38) {
    // Dawn -> Day
    const f = ease((t - 0.27) / 0.11);
    return {
      top: lerpC(SKY_DAWN.top, SKY_DAY.top, f),
      bottom: lerpC(SKY_DAWN.bottom, SKY_DAY.bottom, f),
      daylight: 0.3 + f * 0.7,
    };
  } else if (t < 0.62) {
    // Full day
    return { top: SKY_DAY.top, bottom: SKY_DAY.bottom, daylight: 1 };
  } else if (t < 0.73) {
    // Day -> Dusk
    const f = ease((t - 0.62) / 0.11);
    return {
      top: lerpC(SKY_DAY.top, SKY_DUSK.top, f),
      bottom: lerpC(SKY_DAY.bottom, SKY_DUSK.bottom, f),
      daylight: 1 - f * 0.7,
    };
  } else if (t < 0.85) {
    // Dusk -> Night (longer transition)
    const f = ease((t - 0.73) / 0.12);
    return {
      top: lerpC(SKY_DUSK.top, SKY_NIGHT.top, f),
      bottom: lerpC(SKY_DUSK.bottom, SKY_NIGHT.bottom, f),
      daylight: 0.3 - f * 0.3,
    };
  } else {
    // Night
    return { top: SKY_NIGHT.top, bottom: SKY_NIGHT.bottom, daylight: 0 };
  }
}

/**
 * Compute a celestial arc position.
 * progress 0 = rising at left horizon, 0.5 = peak, 1 = setting at right horizon.
 * Returns x, y in grid coords. y goes below HORIZON_Y at the edges (below horizon).
 */
function celestialArc(
  progress: number,
  gridWidth: number,
  peakY: number,
): { x: number; y: number } {
  // Left-to-right horizontal position
  const x = gridWidth * 0.05 + progress * gridWidth * 0.9;
  // Sine arc: 0 at edges (horizon), peakY at center
  const arc = Math.sin(progress * Math.PI);
  const y = HORIZON_Y - arc * (HORIZON_Y - peakY);
  return { x, y };
}

/**
 * Get the sun's position. Sun rises at t=0.22, peaks at t=0.50, sets at t=0.78.
 * Returns null only if fully below horizon.
 */
function getSunPosition(
  t: number,
  gridWidth: number,
): { x: number; y: number; intensity: number; nearHorizon: number } | null {
  const rise = 0.22;
  const set = 0.78;
  if (t < rise - 0.03 || t > set + 0.03) return null;

  const progress = Math.max(0, Math.min(1, (t - rise) / (set - rise)));
  const { x, y } = celestialArc(progress, gridWidth, 8);

  // Below visible area
  if (y > HORIZON_Y + SUN_GLOW_RADIUS) return null;

  // Intensity based on height above horizon
  const heightAbove = Math.max(0, HORIZON_Y - y) / HORIZON_Y;
  const intensity = Math.min(1, heightAbove * 3);

  // How close to horizon (0=high, 1=at horizon) - for color shift
  const nearHorizon = 1 - Math.min(1, heightAbove * 4);

  return { x, y, intensity, nearHorizon };
}

/**
 * Get the moon's position. Moon rises at t=0.76, peaks at midnight, sets at t=0.24.
 * Returns null only if fully below horizon.
 */
function getMoonPosition(
  t: number,
  gridWidth: number,
): { x: number; y: number; intensity: number } | null {
  const rise = 0.76;
  const set = 0.24;

  // Map time to 0-1 progress across the night
  let progress: number;
  if (t >= rise) {
    progress = ((t - rise) / (1 - rise + set)) * 0.5;
  } else if (t <= set) {
    progress = 0.5 + (t / set) * 0.5;
  } else {
    return null;
  }

  const { x, y } = celestialArc(progress, gridWidth, 12);

  if (y > HORIZON_Y + MOON_GLOW_RADIUS) return null;

  const heightAbove = Math.max(0, HORIZON_Y - y) / HORIZON_Y;
  const intensity = Math.min(1, heightAbove * 3);

  return { x, y, intensity };
}

/**
 * Get the celestial body pixel contribution at a grid position.
 * Returns an RGB to blend, or null.
 */
export function getCelestialPixel(
  atmo: Atmosphere,
  gx: number,
  gy: number,
  gridWidth: number,
  bg: RGB,
): RGB | null {
  const t = atmo.timeOfDay;

  // Sun
  const sun = getSunPosition(t, gridWidth);
  if (sun && sun.intensity > 0) {
    const dx = gx - sun.x;
    const dy = gy - sun.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Sun color shifts orange/red near horizon (atmospheric scattering)
    const h = sun.nearHorizon;
    const coreR = 255;
    const coreG = Math.round(250 - h * 80); // 250 -> 170 (orange)
    const coreB = Math.round(200 - h * 150); // 200 -> 50 (red-orange)

    if (dist < SUN_RADIUS) {
      const f = dist / SUN_RADIUS;
      const brightness = (1 - f * f) * sun.intensity;
      return [
        Math.min(255, Math.round(bg[0] + (coreR - bg[0]) * brightness)),
        Math.min(255, Math.round(bg[1] + (coreG - bg[1]) * brightness)),
        Math.min(255, Math.round(bg[2] + (coreB - bg[2]) * brightness)),
      ];
    }

    if (dist < SUN_GLOW_RADIUS) {
      const f = (dist - SUN_RADIUS) / (SUN_GLOW_RADIUS - SUN_RADIUS);
      const glow = (1 - f) * (1 - f) * 0.45 * sun.intensity;
      // Glow is warmer near horizon
      const glowR = Math.min(255, coreR);
      const glowG = Math.round(coreG * 0.8);
      const glowB = Math.round(coreB * 0.4);
      if (glow > 0.02) {
        return [
          Math.min(255, Math.round(bg[0] + (glowR - bg[0]) * glow)),
          Math.min(255, Math.round(bg[1] + (glowG - bg[1]) * glow * 0.7)),
          Math.min(255, Math.round(bg[2] + (glowB - bg[2]) * glow * 0.3)),
        ];
      }
    }
  }

  // Moon
  const moon = getMoonPosition(t, gridWidth);
  if (moon && moon.intensity > 0) {
    const dx = gx - moon.x;
    const dy = gy - moon.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < MOON_RADIUS) {
      // Moon core: cool silver-white with slight crescent shadow
      const f = dist / MOON_RADIUS;
      const brightness = (1 - f * f) * moon.intensity * 0.75;
      // Crescent effect: darken the left side slightly
      const crescent = dx < 0 ? 0.7 : 1.0;
      return [
        Math.min(
          255,
          Math.round(bg[0] + (215 - bg[0]) * brightness * crescent),
        ),
        Math.min(
          255,
          Math.round(bg[1] + (222 - bg[1]) * brightness * crescent),
        ),
        Math.min(
          255,
          Math.round(bg[2] + (240 - bg[2]) * brightness * crescent),
        ),
      ];
    }

    if (dist < MOON_GLOW_RADIUS) {
      const f = (dist - MOON_RADIUS) / (MOON_GLOW_RADIUS - MOON_RADIUS);
      const glow = (1 - f) * (1 - f) * 0.18 * moon.intensity;
      if (glow > 0.01) {
        return [
          Math.min(255, Math.round(bg[0] + (160 - bg[0]) * glow)),
          Math.min(255, Math.round(bg[1] + (170 - bg[1]) * glow)),
          Math.min(255, Math.round(bg[2] + (210 - bg[2]) * glow)),
        ];
      }
    }
  }

  return null;
}

/** Smoothly lerp a single value toward a target. */
function lerp(current: number, target: number, speed: number): number {
  return current + (target - current) * speed;
}

/** Lerp an RGB color toward a target. */
function lerpRGB(current: RGB, target: RGB, speed: number): RGB {
  return [
    lerp(current[0], target[0], speed),
    lerp(current[1], target[1], speed),
    lerp(current[2], target[2], speed),
  ];
}

/** Element categories for counting. */
const FIRE_ELEMENTS = new Set(["fire", "spark"]);
const WATER_ELEMENTS = new Set(["water", "steam", "ice"]);
const PLANT_ELEMENTS = new Set([
  "plant",
  "stem",
  "leaf",
  "flower",
  "grass",
  "vine",
  "moss",
  "algae",
  "seed",
  "fruit",
  "mushroom",
  "pollen",
]);
const SMOKE_ELEMENTS = new Set(["smoke", "co2", "ash"]);
const LAVA_ELEMENTS = new Set(["lava"]);

/**
 * Absorb steam particles that reach the upper portion of the grid.
 * This is the only way clouds gain water - real steam from real water.
 */
function absorbSteam(atmo: Atmosphere, grid: Grid): void {
  const absorptionZone = Math.floor(grid.height / 2);
  for (let y = 0; y < absorptionZone; y++) {
    for (let x = 0; x < grid.width; x++) {
      const cell = getCell(grid, x, y);
      if (cell?.element === "steam") {
        atmo.steamBuffer += 1;
        setCell(grid, x, y, null);
      }
    }
  }
}

/** Generate a cumulus cloud: large puffy dome, flat bottom, billowy cauliflower top.
 *  Real cumulus: 20-50 cells wide, 10-25 cells tall. Flat base, rounded towers on top. */
function generateCumulus(scale: number): Puff[] {
  const puffs: Puff[] = [];

  // Wide flat base layer (the characteristic flat bottom of cumulus)
  const baseWidth = 8 + Math.floor(Math.random() * 5);
  for (let i = 0; i < baseWidth; i++) {
    const t = (i / (baseWidth - 1)) * 2 - 1; // -1 to 1
    const ox = t * scale * 14;
    const oy = 0; // flat bottom at center y
    const r = (4 + Math.random() * 2) * scale;
    puffs.push({ ox, oy, r, seed: Math.random() * 1000 });
  }

  // Middle body: dome shape, wider at base, narrowing upward
  const bodyLayers = 3 + Math.floor(Math.random() * 2);
  for (let layer = 1; layer <= bodyLayers; layer++) {
    const layerWidth = baseWidth - layer * 1.5;
    const count = Math.max(3, Math.floor(layerWidth));
    for (let i = 0; i < count; i++) {
      const t = count > 1 ? (i / (count - 1)) * 2 - 1 : 0;
      const spread = (1 - layer / (bodyLayers + 1)) * 0.9;
      const ox = t * scale * 14 * spread + (Math.random() - 0.5) * scale * 2;
      const oy = -(layer * scale * 3.5 + Math.random() * scale);
      const r = (3.5 + Math.random() * 2.5) * scale;
      puffs.push({ ox, oy, r, seed: Math.random() * 1000 });
    }
  }

  // Cauliflower peaks: 2-4 billowy towers on top
  const peaks = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < peaks; i++) {
    const ox = (Math.random() * 2 - 1) * scale * 8;
    const oy = -(bodyLayers * scale * 3.5 + Math.random() * scale * 5);
    const r = (3 + Math.random() * 3) * scale;
    puffs.push({ ox, oy, r, seed: Math.random() * 1000 });
  }

  return puffs;
}

/** Generate a cirrus cloud: long wispy ice-crystal streaks at high altitude.
 *  Real cirrus: 40-80 cells long, only 2-4 cells tall. Often with hooks or mare's tails. */
function generateCirrus(scale: number): Puff[] {
  const puffs: Puff[] = [];
  const streaks = 1 + Math.floor(Math.random() * 3);

  for (let s = 0; s < streaks; s++) {
    const baseX = (Math.random() * 2 - 1) * scale * 8;
    const baseY = s * scale * 2;
    const length = 8 + Math.floor(Math.random() * 8);
    // Slight curve (hook shape, like mare's tails)
    const curve = (Math.random() - 0.5) * 0.3;

    for (let i = 0; i < length; i++) {
      const t = i / length;
      const ox = baseX + i * scale * 4 + (Math.random() - 0.5) * scale;
      const oy =
        baseY +
        t * t * curve * scale * 15 +
        (Math.random() - 0.5) * scale * 0.5;
      // Thinner toward the trailing edge
      const r = (1.5 + Math.random() * 1.5) * scale * (1 - t * 0.4);
      puffs.push({ ox, oy, r, seed: Math.random() * 1000 });
    }
  }

  return puffs;
}

/** Generate a stratus cloud: wide flat blanket that can cover large areas.
 *  Real stratus: 60-120 cells wide, 3-6 cells tall. Uniform gray layer. */
function generateStratus(scale: number): Puff[] {
  const puffs: Puff[] = [];
  const width = 12 + Math.floor(Math.random() * 8);

  // Two overlapping rows for thickness
  for (let row = 0; row < 2; row++) {
    for (let i = 0; i < width; i++) {
      const t = (i / (width - 1)) * 2 - 1;
      const ox = t * scale * 18;
      const oy = (row - 0.5) * scale * 1.5 + (Math.random() - 0.5) * scale;
      // Edges taper off (thinner at sides)
      const edgeFade = 1 - Math.abs(t) * 0.3;
      const r = (2.5 + Math.random() * 1.5) * scale * edgeFade;
      puffs.push({ ox, oy, r, seed: Math.random() * 1000 });
    }
  }

  return puffs;
}

/** Generate puffs for a given cloud type. */
function generateCloud(
  type: CloudType,
  scale: number,
): { puffs: Puff[]; halfW: number; halfH: number } {
  let puffs: Puff[];
  switch (type) {
    case "cumulus":
      puffs = generateCumulus(scale);
      break;
    case "cirrus":
      puffs = generateCirrus(scale);
      break;
    case "stratus":
      puffs = generateStratus(scale);
      break;
  }

  let maxX = 0;
  let maxY = 0;
  for (const p of puffs) {
    maxX = Math.max(maxX, Math.abs(p.ox) + p.r);
    maxY = Math.max(maxY, Math.abs(p.oy) + p.r);
  }

  return { puffs, halfW: maxX + 1, halfH: maxY + 1 };
}

/**
 * Distribute accumulated steam into existing clouds as moisture.
 * Excess steam beyond what clouds can hold stays in the buffer for new clouds.
 */
function feedClouds(atmo: Atmosphere): void {
  if (atmo.steamBuffer <= 0 || atmo.clouds.length === 0) return;

  // Feed steam evenly to all clouds that aren't full
  const feedRate = 0.02; // moisture per unit of steam buffer per cloud
  for (const cloud of atmo.clouds) {
    if (cloud.moisture >= 1) continue;
    const room = 1 - cloud.moisture;
    const feed = Math.min(atmo.steamBuffer * feedRate, room);
    cloud.moisture += feed;
    atmo.steamBuffer -= feed / feedRate;
    if (atmo.steamBuffer <= 0) break;
  }
}

/**
 * Try to spawn a new cloud from accumulated steam.
 */
function trySpawnCloud(atmo: Atmosphere, gridWidth: number): void {
  if (atmo.steamBuffer < STEAM_THRESHOLD) return;
  if (atmo.clouds.length >= MAX_CLOUDS) return;

  atmo.steamBuffer -= STEAM_THRESHOLD;

  // Pick a cloud type with weighted randomness
  const roll = Math.random();
  let type: CloudType;
  if (roll < 0.45) {
    type = "cumulus"; // Puffy (most common)
  } else if (roll < 0.75) {
    type = "cirrus"; // Wispy (high altitude)
  } else {
    type = "stratus"; // Flat (wide)
  }

  // Scale: realistic proportions for a pixel world
  const scale =
    type === "cirrus"
      ? 0.8 + Math.random() * 0.5
      : type === "stratus"
        ? 0.7 + Math.random() * 0.5
        : 1.0 + Math.random() * 1.0;

  const { puffs, halfW, halfH } = generateCloud(type, scale);

  const fromLeft = Math.random() < 0.5;
  const x = fromLeft ? -halfW : gridWidth + halfW;

  // Speed varies by type: cirrus fast (jet stream), stratus slow (low drift), cumulus medium
  const baseSpeed =
    type === "cirrus" ? 0.08 : type === "stratus" ? 0.015 : 0.03;
  const drift = (fromLeft ? 1 : -1) * (baseSpeed + Math.random() * 0.03);

  // Height varies by type: cirrus high, cumulus mid-high, stratus mid-low
  let y: number;
  if (type === "cirrus") {
    y = CLOUD_Y_MIN + Math.random() * 8;
  } else if (type === "stratus") {
    y = CLOUD_Y_MIN + 15 + Math.random() * 15;
  } else {
    y = CLOUD_Y_MIN + 8 + Math.random() * 15;
  }

  atmo.clouds.push({
    x,
    y,
    moisture: 0,
    drift,
    puffs,
    halfW,
    halfH,
    type,
    age: 0,
    driftY: (Math.random() - 0.5) * 0.005,
  });
}

/**
 * Spawn ambient clouds that form naturally (no steam required).
 * Cirrus and light stratus drift across the sky for visual atmosphere.
 * More frequent at dawn/dusk, sparse at midday and night.
 */
function trySpawnAmbientCloud(atmo: Atmosphere, gridWidth: number): void {
  if (atmo.clouds.length >= MAX_CLOUDS) return;

  // Spawn chance varies with time of day: higher at dawn/dusk transitions
  const tod = atmo.timeOfDay;
  let spawnChance = 0.0004; // base: very rare
  if ((tod > 0.15 && tod < 0.35) || (tod > 0.65 && tod < 0.85)) {
    spawnChance = 0.002; // dawn/dusk: more frequent
  }
  // Humidity boosts ambient clouds
  spawnChance += atmo.humidity * 0.001;

  if (Math.random() > spawnChance) return;

  // Ambient clouds are mostly cirrus (wispy) and light stratus (haze)
  const roll = Math.random();
  const type: CloudType = roll < 0.6 ? "cirrus" : "stratus";

  const scale =
    type === "cirrus"
      ? 0.6 + Math.random() * 0.5 // wispy streaks
      : 0.5 + Math.random() * 0.4; // light haze

  const { puffs, halfW, halfH } = generateCloud(type, scale);

  const fromLeft = Math.random() < 0.5;
  const x = fromLeft ? -halfW : gridWidth + halfW;
  const baseSpeed = type === "cirrus" ? 0.06 : 0.012;
  const drift = (fromLeft ? 1 : -1) * (baseSpeed + Math.random() * 0.02);

  const y =
    type === "cirrus"
      ? CLOUD_Y_MIN + Math.random() * 8
      : CLOUD_Y_MIN + 10 + Math.random() * 15;

  atmo.clouds.push({
    x,
    y,
    moisture: 0, // ambient clouds start dry
    drift,
    puffs,
    halfW,
    halfH,
    type,
    age: 0,
    driftY: (Math.random() - 0.5) * 0.003,
  });
}

/**
 * Update clouds: drift, accumulate moisture, rain, remove off-screen.
 */
function updateClouds(atmo: Atmosphere, grid: Grid): void {
  const toRemove: number[] = [];

  for (let i = 0; i < atmo.clouds.length; i++) {
    const cloud = atmo.clouds[i];
    if (!cloud) continue;

    // Drift horizontally and slightly vertically
    cloud.x += cloud.drift;
    cloud.y += cloud.driftY;
    cloud.y = Math.max(CLOUD_Y_MIN, Math.min(CLOUD_Y_MAX, cloud.y));
    cloud.age++;

    // --- Continuous morphing: clouds are always shifting ---
    // Gentle per-frame drift for organic feel
    if (cloud.age % 3 === 0) {
      for (const puff of cloud.puffs) {
        puff.ox += (Math.random() - 0.5) * 0.06;
        puff.oy += (Math.random() - 0.5) * 0.04;
      }
    }

    // --- Moisture-driven evolution (every 30 frames) ---
    if (cloud.age % 30 === 0) {
      if (cloud.moisture > 0.4) {
        // Building up: puffs swell, cloud grows taller (anvil/towering effect)
        for (const puff of cloud.puffs) {
          puff.r += 0.03 + Math.random() * 0.04;
          // Upper puffs rise higher (convective tower)
          if (puff.oy < -2) puff.oy -= 0.1 + Math.random() * 0.1;
        }
        // Spawn new puffs on top when heavily loaded (cumulus towers)
        if (
          cloud.moisture > 0.7 &&
          cloud.type === "cumulus" &&
          Math.random() < 0.3
        ) {
          const topPuff = cloud.puffs.reduce((a, b) => (a.oy < b.oy ? a : b));
          cloud.puffs.push({
            ox: topPuff.ox + (Math.random() - 0.5) * 4,
            oy: topPuff.oy - 1 - Math.random() * 2,
            r: 2 + Math.random() * 2,
            seed: Math.random() * 1000,
          });
        }
      } else if (cloud.moisture > 0.1) {
        // Holding steady: gentle internal churn
        for (const puff of cloud.puffs) {
          puff.ox += (Math.random() - 0.5) * 0.2;
          puff.oy += (Math.random() - 0.5) * 0.15;
          puff.r += (Math.random() - 0.5) * 0.04;
          puff.r = Math.max(0.5, puff.r);
        }
      } else {
        // Drying out: edges dissolve, cloud flattens and spreads
        for (const puff of cloud.puffs) {
          // Outer puffs shrink faster (dissolve from edges)
          const distFromCenter = Math.sqrt(
            puff.ox * puff.ox + puff.oy * puff.oy,
          );
          const edgeFactor = Math.min(1, distFromCenter / 10);
          puff.r -= 0.02 + edgeFactor * 0.04;
          // Flatten: vertical compression, horizontal spread
          puff.oy *= 0.995;
          puff.ox *= 1.002;
          puff.r = Math.max(0.3, puff.r);
        }
        // Remove tiny dead puffs
        for (let p = cloud.puffs.length - 1; p >= 0; p--) {
          const puff = cloud.puffs[p];
          if (puff && puff.r < 0.4) cloud.puffs.splice(p, 1);
        }
      }

      // Update bounding box to match current shape
      let maxX = 0,
        maxY = 0;
      for (const p of cloud.puffs) {
        maxX = Math.max(maxX, Math.abs(p.ox) + p.r);
        maxY = Math.max(maxY, Math.abs(p.oy) + p.r);
      }
      cloud.halfW = maxX + 1;
      cloud.halfH = maxY + 1;
    }

    // Remove if fully off-screen
    if (cloud.drift > 0 && cloud.x - cloud.halfW > grid.width + 5) {
      toRemove.push(i);
      continue;
    }
    if (cloud.drift < 0 && cloud.x + cloud.halfW < -5) {
      toRemove.push(i);
      continue;
    }

    // Slowly evaporate if there's fire/heat
    if (atmo.fire > 0.3 || atmo.lava > 0.3) {
      cloud.moisture = Math.max(0, cloud.moisture - 0.001);
    }

    // Rain when moisture is high
    if (cloud.moisture > 0.6 && Math.random() < (cloud.moisture - 0.6) * 0.06) {
      // Pick a random x position under the cloud
      const rx = Math.floor(
        cloud.x - cloud.halfW * 0.6 + Math.random() * cloud.halfW * 1.2,
      );
      const ry = Math.floor(cloud.y + cloud.halfH + 1 + Math.random() * 2);

      if (rx >= 0 && rx < grid.width && ry < grid.height) {
        const existing = getCell(grid, rx, ry);
        if (!existing) {
          const drop = createParticle("water");
          drop.updated = true;
          setCell(grid, rx, ry, drop);
          cloud.moisture -= 0.008;
        }
      }
    }

    // Shrink clouds that run out of moisture (scale down puffs)
    if (cloud.moisture <= 0.05) {
      for (const p of cloud.puffs) {
        p.r *= 0.998;
      }
      if (cloud.puffs[0] && cloud.puffs[0].r < 0.5) {
        toRemove.push(i);
      }
    }
  }

  // Remove dead clouds (iterate backwards to preserve indices)
  for (let i = toRemove.length - 1; i >= 0; i--) {
    const idx = toRemove[i];
    if (idx !== undefined) atmo.clouds.splice(idx, 1);
  }
}

/**
 * Analyze the grid and smoothly update the atmosphere toward the current mood.
 * Call once per frame.
 */
export function updateAtmosphere(atmo: Atmosphere, grid: Grid): void {
  atmo.frame++;

  // Advance day-night cycle
  atmo.timeOfDay = (atmo.timeOfDay + 1 / CYCLE_LENGTH) % 1;

  // Count elements (sample every 4th cell for performance)
  let fireCount = 0;
  let waterCount = 0;
  let plantCount = 0;
  let smokeCount = 0;
  let lavaCount = 0;

  for (let i = 0; i < grid.cells.length; i += 4) {
    const cell = grid.cells[i];
    if (!cell) continue;
    if (FIRE_ELEMENTS.has(cell.element)) fireCount++;
    else if (LAVA_ELEMENTS.has(cell.element)) lavaCount++;
    else if (WATER_ELEMENTS.has(cell.element)) waterCount++;
    else if (PLANT_ELEMENTS.has(cell.element)) plantCount++;
    else if (SMOKE_ELEMENTS.has(cell.element)) smokeCount++;
  }

  // Normalize to 0-1, with a low threshold so even a small amount has visible effect
  const sampleSize = grid.cells.length / 4;
  const norm = (count: number) => Math.min(1, (count / sampleSize) * 25);

  const targetFire = norm(fireCount);
  const targetWater = norm(waterCount);
  const targetPlant = norm(plantCount);
  const targetSmoke = norm(smokeCount);
  const targetLava = norm(lavaCount);

  // Smooth interpolation (slow for gentle transitions)
  const speed = 0.02;
  atmo.fire = lerp(atmo.fire, targetFire, speed);
  atmo.water = lerp(atmo.water, targetWater, speed);
  atmo.plant = lerp(atmo.plant, targetPlant, speed);
  atmo.smoke = lerp(atmo.smoke, targetSmoke, speed);
  atmo.lava = lerp(atmo.lava, targetLava, speed);

  // Sky from time of day
  const base = getBaseSky(atmo.timeOfDay);
  atmo.daylight = base.daylight;

  // Smoothly move current sky toward target
  atmo.skyTop = lerpRGB(atmo.skyTop, base.top, 0.03);
  atmo.skyBottom = lerpRGB(atmo.skyBottom, base.bottom, 0.03);

  // Humidity: builds from water/steam presence, decays slowly
  atmo.humidity = Math.min(
    1,
    Math.max(0, atmo.humidity + atmo.water * 0.002 - 0.0003),
  );

  // Cloud system
  absorbSteam(atmo, grid);
  feedClouds(atmo);
  trySpawnCloud(atmo, grid.width);
  trySpawnAmbientCloud(atmo, grid.width);
  updateClouds(atmo, grid);

  // Dawn dew: condense water on cold surfaces when humid
  applyDawnDew(atmo, grid);
}

/** Surfaces that collect dew at dawn. */
const DEW_SURFACES = new Set([
  "stone",
  "glass",
  "iron",
  "copper",
  "leaf",
  "grass",
  "moss",
  "flower",
  "stem",
]);

/**
 * At dawn, if humidity is high enough, condense water droplets on surfaces.
 */
function applyDawnDew(atmo: Atmosphere, grid: Grid): void {
  // Only during dawn (18-30% of cycle)
  const t = atmo.timeOfDay;
  if (t < 0.2 || t > 0.3) return;

  // Need meaningful humidity
  if (atmo.humidity < 0.15) return;

  // Dawn peak: strongest at t=0.25
  const dawnStrength = 1 - Math.abs(t - 0.25) / 0.05;
  const dewChance = atmo.humidity * dawnStrength * 0.0008;

  // Scan a random subset of cells for performance
  const checks = Math.floor(grid.width * 2);
  for (let i = 0; i < checks; i++) {
    const x = Math.floor(Math.random() * grid.width);
    const y = Math.floor(Math.random() * grid.height);

    const cell = getCell(grid, x, y);
    if (!cell || !DEW_SURFACES.has(cell.element)) continue;
    if (Math.random() > dewChance) continue;

    // Place water droplet in an empty adjacent cell (prefer above and sides)
    const dirs: [number, number][] = [
      [0, -1],
      [-1, 0],
      [1, 0],
      [-1, -1],
      [1, -1],
    ];
    for (const [dx, dy] of dirs) {
      const nx = x + dx;
      const ny = y + dy;
      if (
        !getCell(grid, nx, ny) &&
        nx >= 0 &&
        nx < grid.width &&
        ny >= 0 &&
        ny < grid.height
      ) {
        const drop = createParticle("water");
        drop.updated = true;
        setCell(grid, nx, ny, drop);
        atmo.humidity -= 0.001; // Each drop costs humidity
        break;
      }
    }
  }
}

/**
 * Get the background RGB for a specific grid row, interpolating the gradient
 * with horizon glow during dawn and dusk.
 */
export function getSkyColor(
  atmo: Atmosphere,
  row: number,
  totalRows: number,
): RGB {
  const t = row / (totalRows - 1);
  const r = Math.round(
    atmo.skyTop[0] + (atmo.skyBottom[0] - atmo.skyTop[0]) * t,
  );
  const g = Math.round(
    atmo.skyTop[1] + (atmo.skyBottom[1] - atmo.skyTop[1]) * t,
  );
  const b = Math.round(
    atmo.skyTop[2] + (atmo.skyBottom[2] - atmo.skyTop[2]) * t,
  );

  // Horizon glow: warm band near the bottom during dawn and dusk
  const tod = atmo.timeOfDay;
  let glowStrength = 0;
  if (tod > 0.18 && tod < 0.35) {
    // Dawn glow
    const f = tod < 0.27 ? (tod - 0.18) / 0.09 : 1 - (tod - 0.27) / 0.08;
    glowStrength = Math.max(0, f);
  } else if (tod > 0.65 && tod < 0.82) {
    // Dusk glow
    const f = tod < 0.73 ? (tod - 0.65) / 0.08 : 1 - (tod - 0.73) / 0.09;
    glowStrength = Math.max(0, f);
  }

  if (glowStrength > 0) {
    // Glow is strongest near the horizon (bottom third), fades upward
    const horizonBand = Math.max(0, (t - 0.5) * 2); // 0 at middle, 1 at bottom
    const glow = glowStrength * horizonBand * 0.4;
    if (glow > 0.01) {
      return [
        Math.min(255, Math.round(r + (255 - r) * glow * 0.6)),
        Math.min(255, Math.round(g + (180 - g) * glow * 0.3)),
        Math.min(255, Math.round(b + (80 - b) * glow * 0.1)),
      ];
    }
  }

  return [r, g, b];
}

/** Simple hash for noise. */
/** Better hash with multiple mixing rounds to avoid visible patterns. */
function hash(x: number, y: number): number {
  let h = (x * 374761393) ^ (y * 668265263);
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0;
  h = ((h ^ (h >>> 16)) * 2654435769) >>> 0;
  return (h % 10000) / 10000;
}

/** Hash with a third seed for extra variation. */
function hash3(x: number, y: number, s: number): number {
  let h = (x * 374761393) ^ (y * 668265263) ^ (s * 1013904223);
  h = ((h ^ (h >>> 13)) * 1274126177) >>> 0;
  h = ((h ^ (h >>> 16)) * 2654435769) >>> 0;
  return (h % 10000) / 10000;
}

/**
 * Get the cloud pixel at a grid position. Returns null if no cloud,
 * or an [r, g, b, opacity] tuple with per-pixel lighting.
 */
export function getCloudPixel(
  atmo: Atmosphere,
  gx: number,
  gy: number,
): [number, number, number, number] | null {
  let bestOpacity = 0;
  let bestBrightness = 0;
  let bestMoisture = 0;
  let bestType: CloudType = "cumulus";

  for (const cloud of atmo.clouds) {
    // Quick bounding box rejection
    const dx = gx - cloud.x;
    const dy = gy - cloud.y;
    if (Math.abs(dx) > cloud.halfW || Math.abs(dy) > cloud.halfH) continue;

    // Check each puff
    let cloudOpacity = 0;
    let cloudBrightness = 0;

    for (const puff of cloud.puffs) {
      const px = dx - puff.ox;
      const py = dy - puff.oy;
      const dist = Math.sqrt(px * px + py * py);
      if (dist >= puff.r) continue;

      const t = dist / puff.r;

      // Multi-octave noise for organic wispy edges
      const n1 = hash(
        gx + Math.floor(puff.seed),
        gy + Math.floor(puff.seed * 3),
      );
      const n2 = hash(
        gx * 2 + Math.floor(puff.seed * 7),
        gy * 2 + Math.floor(puff.seed * 11),
      );
      const noiseVal = n1 * 0.6 + n2 * 0.4;

      // Cirrus clouds have wispier edges, cumulus have harder edges
      const edgeHardness =
        cloud.type === "cirrus" ? 0.15 : cloud.type === "stratus" ? 0.35 : 0.25;
      const edgeCutoff = edgeHardness + noiseVal * 0.5;
      if (t > edgeCutoff && t > 0.5) continue;

      // Smooth falloff
      const falloff = 1 - t * t;

      // Opacity varies by cloud type
      const baseOpacity =
        cloud.type === "cirrus" ? 0.25 : cloud.type === "stratus" ? 0.4 : 0.5;
      const puffOpacity = falloff * baseOpacity;

      // Top-lit with noise variation for internal texture
      const verticalPos = py / puff.r;
      const internalNoise =
        hash(gx + Math.floor(puff.seed * 5), gy + Math.floor(puff.seed * 13)) *
        0.15;
      const lighting = 0.5 - verticalPos * 0.35 + internalNoise;

      cloudOpacity = cloudOpacity + puffOpacity * (1 - cloudOpacity);
      cloudBrightness = Math.max(cloudBrightness, lighting);
    }

    if (cloudOpacity > bestOpacity) {
      bestOpacity = cloudOpacity;
      bestBrightness = cloudBrightness;
      bestMoisture = cloud.moisture;
      bestType = cloud.type;
    }
  }

  if (bestOpacity < 0.01) return null;

  // Cloud base brightness scales with daylight
  const nightBase = 55 - Math.floor(bestMoisture * 30);
  const dayBase = 245 - Math.floor(bestMoisture * 65);
  const baseVal = nightBase + (dayBase - nightBase) * atmo.daylight;

  // Apply top-lit brightness
  const lit = Math.floor(baseVal * bestBrightness);

  // Type-specific color tints
  let typeR = 0,
    typeG = 0,
    typeB = 0;
  if (bestType === "cirrus") {
    // Icy blue-white (ice crystals at high altitude)
    typeR = -5;
    typeG = 2;
    typeB = 12;
  } else if (bestType === "stratus") {
    // Flat blue-gray (overcast haze)
    typeR = -8;
    typeG = -3;
    typeB = 5;
  }
  // Cumulus: no tint (pure white tops, natural gray bottoms from lighting)

  // Dawn/dusk warm tint on clouds
  const tod = atmo.timeOfDay;
  const isDawn = tod > 0.18 && tod < 0.38;
  const isDusk = tod > 0.62 && tod < 0.82;
  let warmR = 0;
  let warmG = 0;
  let warmB = 0;
  if (isDawn) {
    const f = tod < 0.28 ? (tod - 0.18) / 0.1 : 1 - (tod - 0.28) / 0.1;
    warmR = Math.floor(f * 50);
    warmG = Math.floor(f * 20);
    warmB = Math.floor(f * -10);
  } else if (isDusk) {
    const f = tod < 0.72 ? (tod - 0.62) / 0.1 : 1 - (tod - 0.72) / 0.1;
    warmR = Math.floor(f * 60);
    warmG = Math.floor(f * 15);
    warmB = Math.floor(f * -15);
  }

  // Rain clouds get a dark blue-gray underside
  const moistureTint = bestMoisture > 0.3 ? (bestMoisture - 0.3) * 60 : 0;

  const r = Math.max(
    0,
    Math.min(255, lit + warmR + typeR - Math.floor(moistureTint * 0.4)),
  );
  const g = Math.max(
    0,
    Math.min(255, lit + warmG + typeG - Math.floor(moistureTint * 0.2)),
  );
  const b = Math.max(
    0,
    Math.min(255, lit + warmB + typeB + Math.floor(moistureTint * 0.2)),
  );

  return [r, g, b, Math.min(0.8, bestOpacity)];
}

/**
 * Get the shade factor at a given x position (0 = full sun, 1 = fully shaded).
 * Shadow offset shifts with sun angle: left at dawn, center at noon, right at dusk.
 */
export function getCloudShade(atmo: Atmosphere, gx: number): number {
  // Sun progress: 0=rise(left), 0.5=noon(center), 1=set(right)
  const tod = atmo.timeOfDay;
  const sunRise = 0.22;
  const sunSet = 0.78;
  const sunProgress = Math.max(
    0,
    Math.min(1, (tod - sunRise) / (sunSet - sunRise)),
  );
  // Shadow offset: positive = shadow cast to the right, negative = to the left
  // At dawn (progress~0) sun is left, shadow goes right (+20..+30)
  // At noon (progress~0.5) sun is overhead, shadow is directly below (0)
  // At dusk (progress~1) sun is right, shadow goes left (-20..-30)
  const shadowOffset = (0.5 - sunProgress) * -50;

  let shade = 0;
  for (const cloud of atmo.clouds) {
    const dx = Math.abs(gx - (cloud.x + shadowOffset));
    if (dx > cloud.halfW) continue;
    const coverage = 1 - dx / cloud.halfW;
    const intensity =
      cloud.type === "cirrus" ? 0.1 : cloud.type === "stratus" ? 0.25 : 0.4;
    const moistureBoost = cloud.moisture * 0.3;
    shade = Math.max(shade, coverage * (intensity + moistureBoost));
  }
  return Math.min(shade, 0.6);
}

/**
 * Check if an empty cell should render an ambient sparkle this frame.
 * Returns an RGB color or null.
 */
export function getAmbientSparkle(
  atmo: Atmosphere,
  gx: number,
  gy: number,
  bg: RGB,
): RGB | null {
  // Stars: visible at night, fade during day
  const nightness = Math.max(0, 1 - atmo.daylight * 1.5);
  if (nightness > 0.05 && gy < 100) {
    // Use hash3 with different seeds per layer to break all patterns
    const h1 = hash3(gx, gy, 1);
    const h2 = hash3(gx, gy, 2);
    const h3 = hash3(gx, gy, 3);

    // Layer 1: Bright stars (rare, varied colors, slow twinkle)
    if (h1 < 0.0008) {
      // Each star has a unique twinkle phase based on its position hash
      const phase = hash3(gx, gy, 17) * 6.28;
      const twinkle = Math.sin(atmo.frame * 0.018 + phase) * 0.35 + 0.65;
      const brightness = twinkle * nightness;
      // Star color: use hash for type so each star has consistent color
      const colorVal = hash3(gx, gy, 42);
      let sr = 255,
        sg = 255,
        sb = 255;
      if (colorVal < 0.2) {
        sr = 190;
        sg = 210;
        sb = 255;
      } // Blue-white
      else if (colorVal < 0.35) {
        sr = 255;
        sg = 235;
        sb = 170;
      } // Yellow
      else if (colorVal < 0.45) {
        sr = 255;
        sg = 190;
        sb = 140;
      } // Orange
      else if (colorVal < 0.5) {
        sr = 255;
        sg = 160;
        sb = 130;
      } // Red
      return [
        Math.round(bg[0] + (sr - bg[0]) * brightness * 0.85),
        Math.round(bg[1] + (sg - bg[1]) * brightness * 0.85),
        Math.round(bg[2] + (sb - bg[2]) * brightness * 0.75),
      ];
    }

    // Layer 2: Medium stars (gentler, mostly white)
    if (h2 < 0.003) {
      const phase = hash3(gx, gy, 29) * 6.28;
      const twinkle = Math.sin(atmo.frame * 0.012 + phase) * 0.25 + 0.5;
      const brightness = twinkle * nightness * 0.5;
      if (brightness > 0.12) {
        const tint = hash3(gx, gy, 53);
        return [
          Math.round(bg[0] + (230 + tint * 25 - bg[0]) * brightness),
          Math.round(bg[1] + (235 + tint * 15 - bg[1]) * brightness),
          Math.round(bg[2] + (250 - bg[2]) * brightness),
        ];
      }
    }

    // Layer 3: Dim star dust (faint, dense in upper sky, no twinkle)
    if (h3 < 0.005 && gy < 70) {
      // Density falls off toward the horizon
      const heightFade = 1 - gy / 70;
      const brightness = nightness * 0.18 * heightFade;
      if (brightness > 0.05) {
        return [
          Math.round(bg[0] + (195 - bg[0]) * brightness),
          Math.round(bg[1] + (205 - bg[1]) * brightness),
          Math.round(bg[2] + (225 - bg[2]) * brightness),
        ];
      }
    }

    // Milky Way: curved band with noise-based density
    const bandAngle = 0.6;
    const bandCenter = gy * bandAngle + gx * (1 - bandAngle);
    const bandDist = Math.abs(bandCenter - 50);
    if (bandDist < 14 && gy < 65) {
      const bandNoise = hash3(gx, gy, 77);
      const bandFade = 1 - bandDist / 14;
      // Dense star clusters within the band
      if (bandNoise < 0.06 * bandFade) {
        const brightness = nightness * 0.22 * bandFade;
        const tint = hash3(gx, gy, 88);
        return [
          Math.round(bg[0] + (200 + tint * 20 - bg[0]) * brightness),
          Math.round(bg[1] + (205 + tint * 15 - bg[1]) * brightness),
          Math.round(bg[2] + (230 - bg[2]) * brightness),
        ];
      }
      // Nebula glow (very subtle)
      const glowIntensity = bandFade * nightness * 0.05;
      if (glowIntensity > 0.008 && bandNoise > 0.7) {
        return [
          Math.round(bg[0] + (45 - bg[0]) * glowIntensity),
          Math.round(bg[1] + (35 - bg[1]) * glowIntensity),
          Math.round(bg[2] + (65 - bg[2]) * glowIntensity),
        ];
      }
    }

    // Shooting stars
    const shootFrame = Math.floor(atmo.frame / 150);
    const shootRoll = hash3(shootFrame, 0, 99);
    if (shootRoll < 0.005) {
      const progress = (atmo.frame % 150) / 150;
      if (progress < 0.25) {
        const sx = Math.floor(hash3(shootFrame, 1, 99) * 160) + 20;
        const sy = Math.floor(hash3(shootFrame, 2, 99) * 30) + 5;
        const angle = 0.3 + hash3(shootFrame, 3, 99) * 0.5;
        const streakX = sx + Math.floor(progress * 30);
        const streakY = sy + Math.floor(progress * 30 * angle);
        const dist = Math.abs(gx - streakX) + Math.abs(gy - streakY);
        if (dist < 2) {
          const fade = 1 - progress / 0.25;
          const brightness = fade * nightness * 0.9;
          return [
            Math.round(bg[0] + (255 - bg[0]) * brightness),
            Math.round(bg[1] + (255 - bg[1]) * brightness),
            Math.round(bg[2] + (235 - bg[2]) * brightness),
          ];
        }
      }
    }
  }

  // Fireflies: soft yellow-green dots that drift when lots of plants
  if (atmo.plant > 0.15) {
    const flyHash =
      ((gx * 3571 + gy * 6553 + Math.floor(atmo.frame / 8) * 97) >>> 0) % 10000;
    if (flyHash < Math.floor(atmo.plant * 8)) {
      const pulse = Math.sin((atmo.frame + gx * 7) * 0.08) * 0.5 + 0.5;
      if (pulse > 0.6) {
        const intensity = (pulse - 0.6) * 2.5 * atmo.plant;
        return [
          Math.round(bg[0] + (180 - bg[0]) * intensity * 0.4),
          Math.round(bg[1] + (220 - bg[1]) * intensity * 0.5),
          Math.round(bg[2] + (60 - bg[2]) * intensity * 0.3),
        ];
      }
    }
  }

  // Embers: tiny orange-red sparks drifting up when fire is present
  if (atmo.fire > 0.1 || atmo.lava > 0.1) {
    const fireInfluence = Math.max(atmo.fire, atmo.lava);
    const driftY = gy + Math.floor(atmo.frame / 3);
    const emberHash = ((gx * 4999 + driftY * 8191) >>> 0) % 10000;
    if (emberHash < Math.floor(fireInfluence * 6)) {
      const flicker = Math.sin((atmo.frame + gx * 13) * 0.15) * 0.5 + 0.5;
      if (flicker > 0.5) {
        const intensity = (flicker - 0.5) * 2 * fireInfluence;
        return [
          Math.round(bg[0] + (255 - bg[0]) * intensity * 0.5),
          Math.round(bg[1] + (120 - bg[1]) * intensity * 0.3),
          Math.round(bg[2] + (30 - bg[2]) * intensity * 0.15),
        ];
      }
    }
  }

  // Haze particles: subtle lighter spots when smoke is heavy
  if (atmo.smoke > 0.25) {
    const hash = ((gx * 7919 + gy * 104729 + atmo.frame * 31) >>> 0) % 10000;
    if (hash < Math.floor(atmo.smoke * 10)) {
      const drift =
        Math.sin((atmo.frame + gx * 5 + gy * 11) * 0.02) * 0.3 + 0.3;
      const intensity = drift * atmo.smoke * 0.3;
      return [
        Math.round(bg[0] + (160 - bg[0]) * intensity),
        Math.round(bg[1] + (160 - bg[1]) * intensity),
        Math.round(bg[2] + (155 - bg[2]) * intensity),
      ];
    }
  }

  return null;
}
