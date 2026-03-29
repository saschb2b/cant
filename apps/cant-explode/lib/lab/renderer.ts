import type { Grid } from "./types";
import type { Atmosphere } from "./atmosphere";
import { getSkyColor, getAmbientSparkle, getCloudPixel, getCelestialPixel } from "./atmosphere";

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


  for (let gy = 0; gy < grid.height; gy++) {
    const bg = skyColors[gy]!;

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
            g = Math.min(255, g + 5 + ((nightBoost * 3 + 5) / 10) | 0);
            break;
          }
          case "spark":
            r = 255; g = 245; b = 140;
            break;
          case "flower":
            if (Math.random() < 0.005) {
              particle.r = Math.min(255, Math.max(150, particle.r + Math.floor(Math.random() * 4 - 2)));
              particle.b = Math.min(255, Math.max(80, particle.b + Math.floor(Math.random() * 4 - 2)));
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
            const stripe = ((gx + gy) % 2 === 0);
            r = stripe ? 230 : 40;
            g = stripe ? 190 : 30;
            b = stripe ? 20 : 10;
            break;
          }
          case "leaf":
            if (Math.random() < 0.005) {
              particle.g = Math.min(255, Math.max(30, particle.g + Math.floor(Math.random() * 4 - 2)));
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

  ctx.putImageData(imageData, 0, 0);
}
