import type { Viewport } from "./types";

/** A visible guide line to render on the canvas. */
export interface GuideLine {
  /** "h" for horizontal (y-aligned), "v" for vertical (x-aligned) */
  axis: "h" | "v";
  /** Position in canvas space */
  position: number;
  /** Start and end extent for the line */
  from: number;
  to: number;
}

export interface SnapResult {
  x: number;
  y: number;
  guides: GuideLine[];
}

const SNAP_THRESHOLD = 8;

/**
 * Given a viewport being dragged to (rawX, rawY), snap it to
 * neighbor edges/centers and optionally to a grid.
 */
export function computeSnap(
  draggedId: string,
  rawX: number,
  rawY: number,
  draggedWidth: number,
  draggedHeight: number,
  allViewports: Viewport[],
  canvasScale: number,
  gridSnap: boolean,
  gridSize = 20,
): SnapResult {
  const threshold = SNAP_THRESHOLD / canvasScale;
  const guides: GuideLine[] = [];

  // Edges of the dragged viewport
  const dLeft = rawX;
  const dRight = rawX + draggedWidth;
  const dCenterX = rawX + draggedWidth / 2;
  const dTop = rawY;
  const dBottom = rawY + draggedHeight;
  const dCenterY = rawY + draggedHeight / 2;

  let snapX = rawX;
  let snapY = rawY;
  let bestDx = threshold + 1;
  let bestDy = threshold + 1;

  // Check against all other viewports
  for (const vp of allViewports) {
    if (vp.id === draggedId) continue;

    const oLeft = vp.x;
    const oRight = vp.x + vp.width;
    const oCenterX = vp.x + vp.width / 2;
    const oTop = vp.y;
    const oBottom = vp.y + vp.height;
    const oCenterY = vp.y + vp.height / 2;

    // Vertical alignment checks (snap X)
    const xChecks = [
      { dragged: dLeft, other: oLeft, offset: 0 }, // left-to-left
      { dragged: dRight, other: oRight, offset: -draggedWidth }, // right-to-right
      { dragged: dLeft, other: oRight, offset: 0 }, // left-to-right
      { dragged: dRight, other: oLeft, offset: -draggedWidth }, // right-to-left
      { dragged: dCenterX, other: oCenterX, offset: -draggedWidth / 2 }, // center-to-center
    ];

    for (const check of xChecks) {
      const dist = Math.abs(check.dragged - check.other);
      if (dist < threshold && dist < bestDx) {
        bestDx = dist;
        snapX = check.other + check.offset;
        // Vertical guide line at the snap position
        const guideX = check.other;
        const minY = Math.min(dTop, oTop) - 20;
        const maxY = Math.max(dBottom, oBottom) + 20;
        // Replace any existing vertical guide at roughly this position
        const existing = guides.findIndex(
          (g) => g.axis === "v" && Math.abs(g.position - guideX) < 1,
        );
        const existingGuide = existing >= 0 ? guides[existing] : undefined;
        if (existingGuide) {
          existingGuide.from = Math.min(existingGuide.from, minY);
          existingGuide.to = Math.max(existingGuide.to, maxY);
        } else {
          guides.push({ axis: "v", position: guideX, from: minY, to: maxY });
        }
      }
    }

    // Horizontal alignment checks (snap Y)
    const yChecks = [
      { dragged: dTop, other: oTop, offset: 0 }, // top-to-top
      { dragged: dBottom, other: oBottom, offset: -draggedHeight }, // bottom-to-bottom
      { dragged: dTop, other: oBottom, offset: 0 }, // top-to-bottom
      { dragged: dBottom, other: oTop, offset: -draggedHeight }, // bottom-to-top
      { dragged: dCenterY, other: oCenterY, offset: -draggedHeight / 2 }, // center-to-center
    ];

    for (const check of yChecks) {
      const dist = Math.abs(check.dragged - check.other);
      if (dist < threshold && dist < bestDy) {
        bestDy = dist;
        snapY = check.other + check.offset;
        const guideY = check.other;
        const minX = Math.min(dLeft, oLeft) - 20;
        const maxX = Math.max(dRight, oRight) + 20;
        const existing = guides.findIndex(
          (g) => g.axis === "h" && Math.abs(g.position - guideY) < 1,
        );
        const existingGuide = existing >= 0 ? guides[existing] : undefined;
        if (existingGuide) {
          existingGuide.from = Math.min(existingGuide.from, minX);
          existingGuide.to = Math.max(existingGuide.to, maxX);
        } else {
          guides.push({ axis: "h", position: guideY, from: minX, to: maxX });
        }
      }
    }
  }

  // Grid snap (only if no neighbor snap fired on that axis)
  if (gridSnap) {
    if (bestDx > threshold) {
      snapX = Math.round(rawX / gridSize) * gridSize;
    }
    if (bestDy > threshold) {
      snapY = Math.round(rawY / gridSize) * gridSize;
    }
  }

  return { x: snapX, y: snapY, guides };
}

/** Arrange viewports in a horizontal row with equal gaps. */
export function arrangeHorizontal(
  viewports: Viewport[],
  gap = 40,
): Partial<Viewport>[] {
  if (viewports.length === 0) return [];

  // Sort by current x position
  const sorted = [...viewports].sort((a, b) => a.x - b.x);
  const first = sorted[0];
  if (!first) return [];
  const startX = first.x;
  const startY = first.y;

  let currentX = startX;
  return sorted.map((vp) => {
    const update = { x: currentX, y: startY };
    currentX += vp.width + gap;
    return { ...update, id: vp.id } as Partial<Viewport> & { id: string };
  });
}

/** Arrange viewports in a wrapping grid, sorted by device width. */
export function arrangeGrid(
  viewports: Viewport[],
  canvasWidth = 1600,
  gap = 40,
): Partial<Viewport>[] {
  if (viewports.length === 0) return [];

  const sorted = [...viewports].sort((a, b) => a.width - b.width);
  const startX = 50;
  const startY = 50;

  let currentX = startX;
  let currentY = startY;
  let rowHeight = 0;

  return sorted.map((vp) => {
    // Wrap to next row if we'd exceed canvas width
    if (currentX + vp.width > canvasWidth && currentX > startX) {
      currentX = startX;
      currentY += rowHeight + gap;
      rowHeight = 0;
    }

    const update = { x: currentX, y: currentY };
    currentX += vp.width + gap;
    rowHeight = Math.max(rowHeight, vp.height);
    return { ...update, id: vp.id } as Partial<Viewport> & { id: string };
  });
}
