import type { Grid } from "./types";

type RGB = [number, number, number];

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
}

/** Mood palettes: [skyTop, skyBottom] for dark and light themes. */
const MOODS_DARK = {
  neutral: { top: [13, 17, 28] as RGB, bottom: [13, 27, 15] as RGB },
  fire: { top: [60, 20, 8] as RGB, bottom: [30, 12, 5] as RGB },
  water: { top: [8, 20, 50] as RGB, bottom: [10, 30, 45] as RGB },
  plant: { top: [12, 28, 18] as RGB, bottom: [18, 35, 12] as RGB },
  smoke: { top: [20, 20, 22] as RGB, bottom: [15, 15, 16] as RGB },
  lava: { top: [50, 15, 5] as RGB, bottom: [35, 10, 3] as RGB },
};

const MOODS_LIGHT = {
  neutral: { top: [235, 240, 245] as RGB, bottom: [245, 245, 240] as RGB },
  fire: { top: [255, 230, 210] as RGB, bottom: [250, 240, 230] as RGB },
  water: { top: [210, 230, 250] as RGB, bottom: [230, 240, 250] as RGB },
  plant: { top: [220, 240, 215] as RGB, bottom: [235, 245, 225] as RGB },
  smoke: { top: [200, 200, 200] as RGB, bottom: [220, 220, 215] as RGB },
  lava: { top: [250, 220, 200] as RGB, bottom: [248, 235, 225] as RGB },
};

export function createAtmosphere(isDark: boolean): Atmosphere {
  const moods = isDark ? MOODS_DARK : MOODS_LIGHT;
  return {
    skyTop: [...moods.neutral.top],
    skyBottom: [...moods.neutral.bottom],
    fire: 0,
    water: 0,
    plant: 0,
    smoke: 0,
    lava: 0,
    frame: 0,
  };
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

/** Blend multiple mood colors based on their influence weights. */
function blendMoods(
  influences: { weight: number; top: RGB; bottom: RGB }[],
  neutralTop: RGB,
  neutralBottom: RGB,
): { top: RGB; bottom: RGB } {
  let totalWeight = 0;
  const top: RGB = [0, 0, 0];
  const bottom: RGB = [0, 0, 0];

  for (const inf of influences) {
    if (inf.weight <= 0) continue;
    totalWeight += inf.weight;
    top[0] += inf.top[0] * inf.weight;
    top[1] += inf.top[1] * inf.weight;
    top[2] += inf.top[2] * inf.weight;
    bottom[0] += inf.bottom[0] * inf.weight;
    bottom[1] += inf.bottom[1] * inf.weight;
    bottom[2] += inf.bottom[2] * inf.weight;
  }

  // Fill remaining weight with neutral
  const neutralWeight = Math.max(0, 1 - totalWeight);
  top[0] += neutralTop[0] * neutralWeight;
  top[1] += neutralTop[1] * neutralWeight;
  top[2] += neutralTop[2] * neutralWeight;
  bottom[0] += neutralBottom[0] * neutralWeight;
  bottom[1] += neutralBottom[1] * neutralWeight;
  bottom[2] += neutralBottom[2] * neutralWeight;

  return { top, bottom };
}

/** Element categories for counting. */
const FIRE_ELEMENTS = new Set(["fire", "spark"]);
const WATER_ELEMENTS = new Set(["water", "steam", "ice"]);
const PLANT_ELEMENTS = new Set([
  "plant", "stem", "leaf", "flower", "grass", "vine", "moss", "algae",
  "seed", "fruit", "mushroom", "pollen",
]);
const SMOKE_ELEMENTS = new Set(["smoke", "co2", "ash"]);
const LAVA_ELEMENTS = new Set(["lava"]);

/**
 * Analyze the grid and smoothly update the atmosphere toward the current mood.
 * Call once per frame.
 */
export function updateAtmosphere(
  atmo: Atmosphere,
  grid: Grid,
  isDark: boolean,
): void {
  atmo.frame++;

  // Count elements (sample every 4th cell for performance)
  let fireCount = 0;
  let waterCount = 0;
  let plantCount = 0;
  let smokeCount = 0;
  let lavaCount = 0;
  let total = 0;

  for (let i = 0; i < grid.cells.length; i += 4) {
    const cell = grid.cells[i];
    if (!cell) continue;
    total++;
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

  // Compute blended target sky colors
  const moods = isDark ? MOODS_DARK : MOODS_LIGHT;
  const target = blendMoods(
    [
      { weight: atmo.fire, top: moods.fire.top, bottom: moods.fire.bottom },
      { weight: atmo.water, top: moods.water.top, bottom: moods.water.bottom },
      { weight: atmo.plant, top: moods.plant.top, bottom: moods.plant.bottom },
      { weight: atmo.smoke, top: moods.smoke.top, bottom: moods.smoke.bottom },
      { weight: atmo.lava, top: moods.lava.top, bottom: moods.lava.bottom },
    ],
    moods.neutral.top,
    moods.neutral.bottom,
  );

  // Smoothly move current sky toward target
  atmo.skyTop = lerpRGB(atmo.skyTop, target.top, 0.03);
  atmo.skyBottom = lerpRGB(atmo.skyBottom, target.bottom, 0.03);
}

/**
 * Get the background RGB for a specific grid row, interpolating the gradient.
 */
export function getSkyColor(atmo: Atmosphere, row: number, totalRows: number): RGB {
  const t = row / (totalRows - 1);
  return [
    Math.round(atmo.skyTop[0] + (atmo.skyBottom[0] - atmo.skyTop[0]) * t),
    Math.round(atmo.skyTop[1] + (atmo.skyBottom[1] - atmo.skyTop[1]) * t),
    Math.round(atmo.skyTop[2] + (atmo.skyBottom[2] - atmo.skyTop[2]) * t),
  ];
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
  // Use a deterministic-ish hash so sparkles stay in place and twinkle
  const hash = ((gx * 7919 + gy * 104729 + atmo.frame * 31) >>> 0) % 10000;

  // Stars: tiny white twinkles in the upper half when it's calm (low activity)
  const activity = atmo.fire + atmo.water + atmo.plant + atmo.smoke + atmo.lava;
  const starChance = Math.max(0, 1 - activity * 1.5);
  if (starChance > 0.1 && gy < 80) {
    // Fixed star positions based on coords only
    const starHash = ((gx * 7919 + gy * 104729) >>> 0) % 10000;
    if (starHash < 15) {
      // Twinkle: brightness varies with frame
      const twinkle = Math.sin((atmo.frame + gx * 17 + gy * 31) * 0.03) * 0.5 + 0.5;
      const brightness = twinkle * starChance;
      if (brightness > 0.3) {
        return [
          Math.round(bg[0] + (255 - bg[0]) * brightness * 0.6),
          Math.round(bg[1] + (255 - bg[1]) * brightness * 0.6),
          Math.round(bg[2] + (240 - bg[2]) * brightness * 0.5),
        ];
      }
    }
  }

  // Fireflies: soft yellow-green dots that drift when lots of plants
  if (atmo.plant > 0.15) {
    // Moving positions based on frame
    const flyHash = ((gx * 3571 + gy * 6553 + Math.floor(atmo.frame / 8) * 97) >>> 0) % 10000;
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
    // Embers drift upward over time
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
    if (hash < Math.floor(atmo.smoke * 10)) {
      const drift = Math.sin((atmo.frame + gx * 5 + gy * 11) * 0.02) * 0.3 + 0.3;
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
