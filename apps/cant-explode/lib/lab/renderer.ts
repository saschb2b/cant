import type { Grid } from "./types";
import type { Atmosphere } from "./atmosphere";
import { getSkyColor, getAmbientSparkle, getCloudPixel } from "./atmosphere";

/** Elements that render translucent (blended with background). */
const TRANSLUCENT: Record<string, number> = {
  smoke: 0.4,
  steam: 0.3,
  co2: 0.25,
  hydrogen: 0.2,
  oxygen: 0.2,
  chlorine: 0.5,
  methane: 0.15,
  pollen: 0.6,
};

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
  const imageData = ctx.createImageData(canvasW, canvasH);
  const data = imageData.data;

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

        // Translucent gases: blend with background
        const opacity = TRANSLUCENT[particle.element];
        if (opacity !== undefined) {
          const inv = 1 - opacity;
          r = Math.round(r * opacity + bg[0] * inv);
          g = Math.round(g * opacity + bg[1] * inv);
          b = Math.round(b * opacity + bg[2] * inv);
        }

        // Fire glow: brighter at night
        if (particle.element === "fire") {
          const nightBoost = Math.floor((1 - atmo.daylight) * 25);
          r = Math.min(255, r + 40 + nightBoost);
          g = Math.min(255, g + 15 + Math.floor(nightBoost * 0.4));
        }

        // Lava glow: brighter at night
        if (particle.element === "lava") {
          const nightBoost = Math.floor((1 - atmo.daylight) * 15);
          r = Math.min(255, r + 20 + nightBoost);
          g = Math.min(255, g + 5 + Math.floor(nightBoost * 0.3));
        }

        // Spark: warm white-yellow glow
        if (particle.element === "spark") {
          r = 255;
          g = 245;
          b = 140;
        }

        // Flower: very subtle color drift
        if (particle.element === "flower" && Math.random() < 0.005) {
          particle.r = Math.min(255, Math.max(150, particle.r + Math.floor(Math.random() * 4 - 2)));
          particle.b = Math.min(255, Math.max(80, particle.b + Math.floor(Math.random() * 4 - 2)));
        }

        // TNT: steady red
        if (particle.element === "tnt") {
          r = Math.min(255, r + 5);
        }

        // Fruit: gentle glow to stand out against leaves
        if (particle.element === "fruit" && Math.random() < 0.05) {
          r = Math.min(255, r + 15);
          g = Math.min(255, g + 5);
        }

        // Pollen: gentle golden tint
        if (particle.element === "pollen") {
          r = Math.min(255, r + 15);
          g = Math.min(255, g + 10);
        }

        // Leaf: age-based color shift (young=bright, old=dark/autumn)
        if (particle.element === "leaf") {
          if (particle.lifetime > 200) {
            // Aging: leaves slowly shift toward yellow/brown
            const age = Math.min(1, (particle.lifetime - 200) / 200);
            r = Math.min(255, r + Math.floor(age * 40));
            g = Math.max(40, g - Math.floor(age * 30));
          }
          // Subtle shimmer for canopy depth
          if (Math.random() < 0.01) {
            particle.g = Math.min(255, Math.max(30, particle.g + Math.floor(Math.random() * 6 - 3)));
          }
        }

        // Algae: subtle underwater shimmer
        if (particle.element === "algae") {
          const algaeOpacity = 0.7;
          const inv = 1 - algaeOpacity;
          r = Math.round(r * algaeOpacity + bg[0] * inv);
          g = Math.round(g * algaeOpacity + bg[1] * inv);
          b = Math.round(b * algaeOpacity + bg[2] * inv);
        }
      } else {
        // Empty cell: start with sky gradient
        r = bg[0];
        g = bg[1];
        b = bg[2];

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
