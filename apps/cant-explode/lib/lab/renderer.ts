import type { Grid } from "./types";
import type { Atmosphere } from "./atmosphere";
import {
  getSkyColor,
  getAmbientSparkle,
  getCloudPixel,
  getCelestialPixel,
  getCloudShade,
} from "./atmosphere";

/** Elements that render translucent (blended with background). */
const TRANSLUCENT: Record<string, number> = {
  smoke: 0.4,
  steam: 0.12,
  co2: 0.25,
  hydrogen: 0.2,
  oxygen: 0.2,
  chlorine: 0.5,
  methane: 0.15,
  pollen: 0.2,
};

/** Cached ImageData to avoid allocating a new buffer every frame. */
let cachedImageData: ImageData | null = null;
let cachedW = 0;
let cachedH = 0;

/** Human sprite: 3 wide x 5 tall, bottom-center is the particle position.
 *  Each frame is a flat array of [dx, dy, colorIndex] entries.
 *  colorIndex: 0=skin, 1=shirt, 2=pants, 3=transparent (skip) */
type SpritePixel = [number, number, number];

// Walk frame 1: left leg forward
const HUMAN_FRAME_A: SpritePixel[] = [
  [0, -4, 0], //  H    head
  [-1, -3, 1],
  [0, -3, 1],
  [1, -3, 1], // HHH  shoulders
  [0, -2, 1], //  H    torso
  [-1, -1, 2],
  [1, 0, 2], // L  R  legs staggered
  [0, -1, 2],
  [0, 0, 2], //  LL   connecting
];

// Walk frame 2: right leg forward
const HUMAN_FRAME_B: SpritePixel[] = [
  [0, -4, 0], //  H    head
  [-1, -3, 1],
  [0, -3, 1],
  [1, -3, 1], // HHH  shoulders
  [0, -2, 1], //  H    torso
  [1, -1, 2],
  [-1, 0, 2], //  R L  legs staggered
  [0, -1, 2],
  [0, 0, 2], //  LL   connecting
];

// Sleeping: lying on the ground
const HUMAN_FRAME_SLEEP: SpritePixel[] = [
  [-2, 0, 0], // H        head
  [-1, 0, 1],
  [0, 0, 1],
  [1, 0, 1], //  BBB     body
  [2, 0, 2],
  [3, 0, 2], //      LL  legs
];

/**
 * Render the grid to a canvas context using ImageData for performance.
 * Uses the atmosphere for dynamic gradient background and ambient effects.
 */
export function renderGrid(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  cellSize: number,
  atmo: Atmosphere,
): void {
  const canvasW = grid.width * cellSize;
  const canvasH = grid.height * cellSize;
  if (!cachedImageData || cachedW !== canvasW || cachedH !== canvasH) {
    cachedImageData = ctx.createImageData(canvasW, canvasH);
    cachedW = canvasW;
    cachedH = canvasH;
  }
  const imageData = cachedImageData;
  const data = imageData.data;

  // Pre-compute per-frame constants
  const nightGlow = Math.floor((1 - atmo.daylight) * 25);
  const lavaGlow = Math.floor((1 - atmo.daylight) * 15);

  // Pre-compute sky colors per row
  const skyColors: [number, number, number][] = [];
  for (let gy = 0; gy < grid.height; gy++) {
    skyColors.push(getSkyColor(atmo, gy, grid.height));
  }

  // Pre-compute cloud shade per column, scaled by daylight for smooth transition
  const shadeMap: number[] = [];
  if (atmo.daylight > 0.01 && atmo.clouds.length > 0) {
    // Smooth fade: shadows ramp with daylight (no shadow at night, full at midday)
    const shadeFade = Math.min(1, atmo.daylight * 2); // 0 at night, 1 above daylight 0.5
    for (let gx = 0; gx < grid.width; gx++) {
      shadeMap.push(getCloudShade(atmo, gx) * shadeFade);
    }
  }

  for (let gy = 0; gy < grid.height; gy++) {
    const bg = skyColors[gy] ?? ([0, 0, 0] as [number, number, number]);

    for (let gx = 0; gx < grid.width; gx++) {
      const particle = grid.cells[gy * grid.width + gx];

      let r: number;
      let g: number;
      let b: number;

      if (particle) {
        r = particle.r;
        g = particle.g;
        b = particle.b;

        const el = particle.element;

        // Translucent gases: blend with background
        const opacity = TRANSLUCENT[el];
        if (opacity !== undefined) {
          const inv = 1 - opacity;
          r = Math.round(r * opacity + bg[0] * inv);
          g = Math.round(g * opacity + bg[1] * inv);
          b = Math.round(b * opacity + bg[2] * inv);
        }

        // Element-specific rendering (single switch avoids repeated string comparisons)
        switch (el) {
          case "fire": {
            const nightBoost = nightGlow;
            r = Math.min(255, r + 40 + nightBoost);
            g = Math.min(255, g + 15 + ((nightBoost * 2 + 2) >> 2));
            break;
          }
          case "lava": {
            const nightBoost = lavaGlow;
            r = Math.min(255, r + 20 + nightBoost);
            g = Math.min(255, (g + 5 + (nightBoost * 3 + 5) / 10) | 0);
            break;
          }
          case "spark":
            r = 255;
            g = 245;
            b = 140;
            break;
          case "flower":
            if (Math.random() < 0.005) {
              particle.r = Math.min(
                255,
                Math.max(150, particle.r + Math.floor(Math.random() * 4 - 2)),
              );
              particle.b = Math.min(
                255,
                Math.max(80, particle.b + Math.floor(Math.random() * 4 - 2)),
              );
            }
            break;
          case "tnt":
            r = Math.min(255, r + 5);
            break;
          case "fruit":
            if (Math.random() < 0.05) {
              r = Math.min(255, r + 15);
              g = Math.min(255, g + 5);
            }
            break;
          case "pollen":
            r = Math.min(255, r + 15);
            g = Math.min(255, g + 10);
            break;
          case "bee": {
            const stripe = (gx + gy) % 2 === 0;
            r = stripe ? 230 : 40;
            g = stripe ? 190 : 30;
            b = stripe ? 20 : 10;
            break;
          }
          case "human":
            // Humans are drawn as multi-pixel sprites in a second pass
            r = bg[0];
            g = bg[1];
            b = bg[2];
            break;
          case "bird":
            // Small dark silhouette
            r = 50;
            g = 40;
            b = 35;
            break;
          case "leaf":
            if (Math.random() < 0.005) {
              particle.g = Math.min(
                255,
                Math.max(30, particle.g + Math.floor(Math.random() * 4 - 2)),
              );
            }
            break;
          case "algae": {
            r = Math.round(r * 0.7 + bg[0] * 0.3);
            g = Math.round(g * 0.7 + bg[1] * 0.3);
            b = Math.round(b * 0.7 + bg[2] * 0.3);
            break;
          }
        }
      } else {
        // Empty cell: start with sky gradient
        r = bg[0];
        g = bg[1];
        b = bg[2];

        // Sun and moon
        const celestial = getCelestialPixel(atmo, gx, gy, grid.width, bg);
        if (celestial) {
          r = celestial[0];
          g = celestial[1];
          b = celestial[2];
        }

        // Clouds: blend per-pixel cloud color over sky
        const cloudPx = getCloudPixel(atmo, gx, gy);
        if (cloudPx) {
          const alpha = cloudPx[3];
          const inv = 1 - alpha;
          r = Math.round(cloudPx[0] * alpha + r * inv);
          g = Math.round(cloudPx[1] * alpha + g * inv);
          b = Math.round(cloudPx[2] * alpha + b * inv);
        }

        // Ambient sparkle effects (stars, fireflies, embers)
        const sparkle = getAmbientSparkle(atmo, gx, gy, [r, g, b]);
        if (sparkle) {
          r = sparkle[0];
          g = sparkle[1];
          b = sparkle[2];
        }
      }

      // Cloud shadow: darken ground particles under clouds
      if (particle && shadeMap.length > 0) {
        const shade = shadeMap[gx] ?? 0;
        if (shade > 0) {
          const dim = 1 - shade;
          r = Math.round(r * dim);
          g = Math.round(g * dim);
          b = Math.round(b * dim);
        }
      }

      // Fill the cellSize x cellSize block
      const px0 = gx * cellSize;
      const py0 = gy * cellSize;
      for (let dy = 0; dy < cellSize; dy++) {
        const rowStart = ((py0 + dy) * canvasW + px0) * 4;
        for (let dx = 0; dx < cellSize; dx++) {
          const i = rowStart + dx * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = 255;
        }
      }
    }
  }

  // Second pass: draw human sprites over the image data
  for (let gy = 0; gy < grid.height; gy++) {
    for (let gx = 0; gx < grid.width; gx++) {
      const particle = grid.cells[gy * grid.width + gx];
      if (particle?.element !== "human") continue;

      // Determine health-based skin tone
      const health = Math.min(particle.r, particle.g);
      let skinR: number, skinG: number, skinB: number;
      if (health > 150) {
        skinR = 210;
        skinG = 170;
        skinB = 130;
      } else if (health > 60) {
        skinR = 195;
        skinG = 175;
        skinB = 155;
      } else {
        skinR = 175;
        skinG = 120;
        skinB = 100;
      }

      // Shirt color: muted earth tones based on sex bit (b >> 7)
      const sex = (particle.b >> 7) & 1;
      const shirtR = sex ? 140 : 100;
      const shirtG = sex ? 90 : 120;
      const shirtB = sex ? 70 : 150;

      // Pants: dark brown
      const pantsR = 70,
        pantsG = 50,
        pantsB = 35;

      const palette: [number, number, number][] = [
        [skinR, skinG, skinB],
        [shirtR, shirtG, shirtB],
        [pantsR, pantsG, pantsB],
      ];

      // Pick animation frame: sleeping, walking, or idle
      // Slow, smooth walk cycle: alternate legs every 12 ticks
      const sleeping = atmo.daylight < 0.2;
      const walkPhase = Math.floor(particle.lifetime / 12) % 4; // 0,1=frame A, 2,3=frame B
      const frame = sleeping
        ? HUMAN_FRAME_SLEEP
        : walkPhase < 2
          ? HUMAN_FRAME_A
          : HUMAN_FRAME_B;

      // Direction: flip sprite horizontally if facing left
      const facingLeft = (particle.b & 0x01) === 0;

      for (const [dx, dy, colorIdx] of frame) {
        const sdx = facingLeft ? -dx : dx;
        const px = gx + sdx;
        const py = gy + dy;
        if (px < 0 || px >= grid.width || py < 0 || py >= grid.height) continue;

        // Draw over everything except tree trunks (depth effect)
        const targetCell = grid.cells[py * grid.width + px];
        if (targetCell?.element === "stem") continue;

        const color = palette[colorIdx];
        if (!color) continue;
        const pixX = px * cellSize;
        const pixY = py * cellSize;
        for (let pdy = 0; pdy < cellSize; pdy++) {
          const rowStart = ((pixY + pdy) * canvasW + pixX) * 4;
          for (let pdx = 0; pdx < cellSize; pdx++) {
            const i = rowStart + pdx * 4;
            data[i] = color[0];
            data[i + 1] = color[1];
            data[i + 2] = color[2];
            data[i + 3] = 255;
          }
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}
