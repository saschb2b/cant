import type { Grid, Particle } from "./types";

export function createGrid(width: number, height: number): Grid {
  return {
    width,
    height,
    cells: new Array<Particle | null>(width * height).fill(null),
  };
}

export function inBounds(grid: Grid, x: number, y: number): boolean {
  return x >= 0 && x < grid.width && y >= 0 && y < grid.height;
}

export function getCell(grid: Grid, x: number, y: number): Particle | null {
  if (!inBounds(grid, x, y)) return null;
  return grid.cells[y * grid.width + x] ?? null;
}

export function setCell(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle | null,
): void {
  if (!inBounds(grid, x, y)) return;
  grid.cells[y * grid.width + x] = particle;
}

export function swapCells(
  grid: Grid,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): void {
  if (!inBounds(grid, x1, y1) || !inBounds(grid, x2, y2)) return;
  const i1 = y1 * grid.width + x1;
  const i2 = y2 * grid.width + x2;
  const temp = grid.cells[i1] ?? null;
  grid.cells[i1] = grid.cells[i2] ?? null;
  grid.cells[i2] = temp;
}

export function clearGrid(grid: Grid): void {
  grid.cells.fill(null);
}
