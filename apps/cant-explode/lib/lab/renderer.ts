import type { Grid } from "./types";

/** Elements that render translucent (blended with background). */
const TRANSLUCENT: Record<string, number> = {
  smoke: 0.4,
  steam: 0.3,
  co2: 0.25,
  hydrogen: 0.2,
  oxygen: 0.2,
  chlorine: 0.5,
};

/**
 * Render the grid to a canvas context using ImageData for performance.
 */
export function renderGrid(
  ctx: CanvasRenderingContext2D,
  grid: Grid,
  cellSize: number,
  bgColor: [number, number, number],
): void {
  const canvasW = grid.width * cellSize;
  const canvasH = grid.height * cellSize;
  const imageData = ctx.createImageData(canvasW, canvasH);
  const data = imageData.data;

  for (let gy = 0; gy < grid.height; gy++) {
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
          r = Math.round(r * opacity + bgColor[0] * inv);
          g = Math.round(g * opacity + bgColor[1] * inv);
          b = Math.round(b * opacity + bgColor[2] * inv);
        }

        // Fire glow
        if (particle.element === "fire") {
          r = Math.min(255, r + 40);
          g = Math.min(255, g + 15);
        }

        // Lava glow: pulsing warmth
        if (particle.element === "lava") {
          r = Math.min(255, r + 20);
          g = Math.min(255, g + 5);
        }

        // Spark: bright white-yellow flash
        if (particle.element === "spark") {
          r = 255;
          g = Math.min(255, 240 + Math.floor(Math.random() * 15));
          b = Math.min(255, 100 + Math.floor(Math.random() * 80));
        }
      } else {
        r = bgColor[0];
        g = bgColor[1];
        b = bgColor[2];
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
