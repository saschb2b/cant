import type { Grid, Particle } from "./types";
import { ELEMENTS, variedColor } from "./elements";
import { getCell, setCell, swapCells, inBounds } from "./grid";
import { REACTIONS } from "./reactions";

export function createParticle(element: Particle["element"]): Particle {
  const def = ELEMENTS[element];
  const [r, g, b] = variedColor(def.baseColor);
  return { element, r, g, b, lifetime: def.lifetime ?? 0, updated: false };
}

function randomBool(): boolean {
  return Math.random() < 0.5;
}

function tryMove(grid: Grid, x: number, y: number, nx: number, ny: number): boolean {
  if (!inBounds(grid, nx, ny)) return false;
  const target = getCell(grid, nx, ny);
  if (target === null) {
    swapCells(grid, x, y, nx, ny);
    const moved = getCell(grid, nx, ny);
    if (moved) moved.updated = true;
    return true;
  }
  // Denser particles sink through less dense ones
  const source = getCell(grid, x, y);
  if (
    source &&
    target &&
    !target.updated &&
    ELEMENTS[source.element].density > ELEMENTS[target.element].density &&
    ELEMENTS[target.element].behavior !== "static"
  ) {
    swapCells(grid, x, y, nx, ny);
    const moved = getCell(grid, nx, ny);
    if (moved) moved.updated = true;
    return true;
  }
  return false;
}

function updatePowder(grid: Grid, x: number, y: number): void {
  if (tryMove(grid, x, y, x, y + 1)) return;
  const leftFirst = randomBool();
  const dx1 = leftFirst ? -1 : 1;
  const dx2 = leftFirst ? 1 : -1;
  if (tryMove(grid, x, y, x + dx1, y + 1)) return;
  tryMove(grid, x, y, x + dx2, y + 1);
}

function updateLiquid(grid: Grid, x: number, y: number): void {
  if (tryMove(grid, x, y, x, y + 1)) return;
  const leftFirst = randomBool();
  const dx1 = leftFirst ? -1 : 1;
  const dx2 = leftFirst ? 1 : -1;
  if (tryMove(grid, x, y, x + dx1, y + 1)) return;
  if (tryMove(grid, x, y, x + dx2, y + 1)) return;
  // Liquids spread horizontally
  if (tryMove(grid, x, y, x + dx1, y)) return;
  tryMove(grid, x, y, x + dx2, y);
}

function updateGas(grid: Grid, x: number, y: number): void {
  // Gases rise with slight horizontal drift
  const drift = Math.random() < 0.3 ? (randomBool() ? -1 : 1) : 0;
  if (tryMove(grid, x, y, x + drift, y - 1)) return;
  if (tryMove(grid, x, y, x, y - 1)) return;
  // Spread sideways
  const dx = randomBool() ? -1 : 1;
  if (tryMove(grid, x, y, x + dx, y)) return;
  tryMove(grid, x, y, x - dx, y);
}

function updateFire(grid: Grid, x: number, y: number, particle: Particle): void {
  particle.lifetime--;

  if (particle.element === "spark") {
    // Sparks are bright and short-lived
    if (particle.lifetime <= 0) {
      setCell(grid, x, y, null);
      return;
    }
    // Sparks move erratically upward
    const dx = Math.random() < 0.5 ? (randomBool() ? -1 : 1) : 0;
    tryMove(grid, x, y, x + dx, y - 1);
    return;
  }

  // Animate fire colors
  const maxLife = ELEMENTS.fire.lifetime ?? 25;
  const t = particle.lifetime / maxLife;
  particle.r = Math.floor(255 * Math.min(1, t + 0.3));
  particle.g = Math.floor(180 * t);
  particle.b = 0;

  if (particle.lifetime <= 0) {
    // Fire dies, maybe leave smoke
    if (Math.random() < 0.3) {
      const smoke = createParticle("smoke");
      smoke.updated = true;
      setCell(grid, x, y, smoke);
    } else {
      setCell(grid, x, y, null);
    }
    return;
  }
  // Fire rises
  updateGas(grid, x, y);
}

function checkReactions(grid: Grid, x: number, y: number): void {
  const particle = getCell(grid, x, y);
  if (!particle) return;

  const neighbors: [number, number][] = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  for (const [nx, ny] of neighbors) {
    const neighbor = getCell(grid, nx, ny);
    if (!neighbor) continue;

    for (const rule of REACTIONS) {
      const match =
        (particle.element === rule.a && neighbor.element === rule.b) ||
        (particle.element === rule.b && neighbor.element === rule.a);

      if (!match) continue;
      if (Math.random() > rule.probability) continue;

      // Determine which is a and which is b
      const isForward = particle.element === rule.a;
      const prodSelf = isForward ? rule.produceA : rule.produceB;
      const prodNeighbor = isForward ? rule.produceB : rule.produceA;

      if (prodSelf) {
        const p = createParticle(prodSelf);
        p.updated = true;
        setCell(grid, x, y, p);
      } else {
        setCell(grid, x, y, null);
      }

      if (prodNeighbor) {
        const p = createParticle(prodNeighbor);
        p.updated = true;
        setCell(grid, nx, ny, p);
      } else {
        setCell(grid, nx, ny, null);
      }

      return; // One reaction per tick per particle
    }
  }
}

export function tickSimulation(grid: Grid, tick: number): void {
  // Reset updated flags
  for (let i = 0; i < grid.cells.length; i++) {
    const cell = grid.cells[i];
    if (cell) cell.updated = false;
  }

  // Alternate scan direction to prevent bias
  const leftToRight = tick % 2 === 0;

  // Bottom-to-top so falling particles don't cascade in one tick
  for (let y = grid.height - 1; y >= 0; y--) {
    const startX = leftToRight ? 0 : grid.width - 1;
    const endX = leftToRight ? grid.width : -1;
    const stepX = leftToRight ? 1 : -1;

    for (let x = startX; x !== endX; x += stepX) {
      const particle = getCell(grid, x, y);
      if (!particle || particle.updated) continue;

      const def = ELEMENTS[particle.element];

      // Handle lifetime for gases
      if (def.lifetime && def.behavior === "gas") {
        particle.lifetime--;
        if (particle.lifetime <= 0) {
          setCell(grid, x, y, null);
          continue;
        }
      }

      switch (def.behavior) {
        case "powder":
          updatePowder(grid, x, y);
          break;
        case "liquid":
          updateLiquid(grid, x, y);
          break;
        case "gas":
          updateGas(grid, x, y);
          break;
        case "fire":
          updateFire(grid, x, y, particle);
          break;
        case "static":
          break;
      }

      // Check reactions after movement
      checkReactions(grid, x, y);
    }
  }
}
