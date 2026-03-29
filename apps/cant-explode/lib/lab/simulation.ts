import type { Grid, Particle } from "./types";
import { ELEMENTS, variedColor } from "./elements";
import { getCell, setCell, swapCells, inBounds } from "./grid";
import { REACTIONS } from "./reactions";

/** Current daylight level for this tick (0=night, 1=day). Set by tickSimulation. */
let currentDaylight = 1;

export function createParticle(element: Particle["element"]): Particle {
  const def = ELEMENTS[element];
  const [r, g, b] = variedColor(def.baseColor, element);
  return { element, r, g, b, lifetime: def.lifetime ?? 0, updated: false };
}

function randomBool(): boolean {
  return Math.random() < 0.5;
}

function isEmpty(grid: Grid, x: number, y: number): boolean {
  return inBounds(grid, x, y) && getCell(grid, x, y) === null;
}

function hasNeighbor(grid: Grid, x: number, y: number, element: string): boolean {
  const offsets: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  for (const [dx, dy] of offsets) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell && cell.element === element) return true;
  }
  return false;
}

function hasAnyNeighbor(grid: Grid, x: number, y: number, elements: string[]): boolean {
  const offsets: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0]];
  for (const [dx, dy] of offsets) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell && elements.includes(cell.element)) return true;
  }
  return false;
}

const SOLID_BEHAVIORS = new Set(["static", "plant", "vine", "fuse", "explosive", "powder"]);

function hasSolidBelow(grid: Grid, x: number, y: number): boolean {
  const below = getCell(grid, x, y + 1);
  if (!below) return !inBounds(grid, x, y + 1);
  return SOLID_BEHAVIORS.has(ELEMENTS[below.element].behavior);
}

function countNearby(grid: Grid, x: number, y: number, element: string, radius: number): number {
  let count = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cell = getCell(grid, x + dx, y + dy);
      if (cell && cell.element === element) count++;
    }
  }
  return count;
}

function countNearbyAny(grid: Grid, x: number, y: number, elements: string[], radius: number): number {
  let count = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cell = getCell(grid, x + dx, y + dy);
      if (cell && elements.includes(cell.element)) count++;
    }
  }
  return count;
}

function consumeWater(grid: Grid, x: number, y: number): boolean {
  const dirs: [number, number][] = [[0, -1], [0, 1], [-1, 0], [1, 0], [-1, -1], [1, -1], [-1, 1], [1, 1]];
  for (const [dx, dy] of dirs) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell && cell.element === "water") {
      setCell(grid, x + dx, y + dy, null);
      return true;
    }
  }
  return false;
}

function spawnAt(grid: Grid, x: number, y: number, element: Particle["element"]): boolean {
  if (!isEmpty(grid, x, y)) return false;
  const p = createParticle(element);
  p.updated = true;
  setCell(grid, x, y, p);
  return true;
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
  const source = getCell(grid, x, y);
  if (
    source &&
    target &&
    !target.updated &&
    ELEMENTS[source.element].density > ELEMENTS[target.element].density &&
    ELEMENTS[target.element].behavior !== "static" &&
    ELEMENTS[target.element].behavior !== "plant" &&
    ELEMENTS[target.element].behavior !== "vine" &&
    ELEMENTS[target.element].behavior !== "fuse" &&
    ELEMENTS[target.element].behavior !== "explosive"
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
  // Always fall
  if (tryMove(grid, x, y, x, y + 1)) return;
  const leftFirst = randomBool();
  const dx1 = leftFirst ? -1 : 1;
  const dx2 = leftFirst ? 1 : -1;
  if (tryMove(grid, x, y, x + dx1, y + 1)) return;
  if (tryMove(grid, x, y, x + dx2, y + 1)) return;
  // Horizontal spread: slower, not every tick
  if (Math.random() < 0.6) {
    if (tryMove(grid, x, y, x + dx1, y)) return;
    tryMove(grid, x, y, x + dx2, y);
  }
}

function updateGas(grid: Grid, x: number, y: number): void {
  // Gases move less often for a calmer look
  if (Math.random() < 0.3) return;
  const drift = Math.random() < 0.3 ? (randomBool() ? -1 : 1) : 0;
  if (tryMove(grid, x, y, x + drift, y - 1)) return;
  if (tryMove(grid, x, y, x, y - 1)) return;
  const dx = randomBool() ? -1 : 1;
  if (tryMove(grid, x, y, x + dx, y)) return;
  tryMove(grid, x, y, x - dx, y);
}

function updateFire(grid: Grid, x: number, y: number, particle: Particle): void {
  particle.lifetime--;

  if (particle.element === "spark") {
    if (particle.lifetime <= 0) {
      setCell(grid, x, y, null);
      return;
    }
    // Sparks drift gently upward
    if (Math.random() < 0.5) {
      const dx = Math.random() < 0.4 ? (randomBool() ? -1 : 1) : 0;
      tryMove(grid, x, y, x + dx, y - 1);
    }
    return;
  }

  // Animate fire colors
  const maxLife = ELEMENTS.fire.lifetime ?? 25;
  const t = particle.lifetime / maxLife;
  particle.r = Math.floor(255 * Math.min(1, t + 0.3));
  particle.g = Math.floor(180 * t);
  particle.b = 0;

  if (particle.lifetime <= 0) {
    // Fire dies: leave ash, charcoal, or smoke
    const roll = Math.random();
    if (roll < 0.25) {
      const smoke = createParticle("smoke");
      smoke.updated = true;
      setCell(grid, x, y, smoke);
    } else if (roll < 0.4) {
      const ash = createParticle("ash");
      ash.updated = true;
      setCell(grid, x, y, ash);
    } else {
      setCell(grid, x, y, null);
    }
    return;
  }

  // Wildfire spread: fire actively ignites flammable neighbors (including diagonals)
  if (Math.random() < 0.3) {
    const spreadDirs: [number, number][] = [
      [-1, -1], [0, -1], [1, -1],
      [-1, 0],           [1, 0],
      [-1, 1],  [0, 1],  [1, 1],
    ];
    const sd = spreadDirs[Math.floor(Math.random() * spreadDirs.length)];
    if (sd) {
      const neighbor = getCell(grid, x + sd[0], y + sd[1]);
      if (neighbor && ELEMENTS[neighbor.element].flammable && Math.random() < 0.15) {
        const fire = createParticle("fire");
        fire.updated = true;
        setCell(grid, x + sd[0], y + sd[1], fire);
      }
    }
  }

  updateGas(grid, x, y);
}

// ===== Seed: falls, then sprouts a stem when watered =====
function updateSeed(grid: Grid, x: number, y: number, particle: Particle): void {
  // Try to fall first
  if (tryMove(grid, x, y, x, y + 1)) return;
  const leftFirst = randomBool();
  if (tryMove(grid, x, y, x + (leftFirst ? -1 : 1), y + 1)) return;
  if (tryMove(grid, x, y, x + (leftFirst ? 1 : -1), y + 1)) return;

  // Settled: need water within 2 cells
  if (!hasSolidBelow(grid, x, y) || countNearby(grid, x, y, "water", 2) === 0) return;

  // Seeds near a wall/surface sprout into vine (on any ground)
  const surfaces = ["stone", "wood", "glass", "iron", "copper", "rust", "patina"];
  if (hasAnyNeighbor(grid, x, y, surfaces)) {
    particle.lifetime++;
    particle.g = Math.min(255, particle.g + 2);
    if (particle.lifetime <= 8) return;
    consumeWater(grid, x, y);
    const vine = createParticle("vine");
    vine.updated = true;
    setCell(grid, x, y, vine);
    return;
  }

  // For trees and grass, seeds require fertile ground (soil or ash)
  if (!hasAnyNeighbor(grid, x, y, ["soil", "ash"])) return;

  particle.lifetime++;
  // Color shift to show germination
  particle.g = Math.min(255, particle.g + 2);
  if (particle.lifetime <= 8) return;

  consumeWater(grid, x, y);

  // Determine biome from position (low-frequency spatial variation)
  // Nearby seeds get similar biomes, creating local forest consistency
  const biomeHash = Math.sin(x * 0.07 + 3.7) * Math.sin(x * 0.13 + 1.1);
  const biomeVal = (biomeHash + 1) / 2; // 0-1

  // Biome sets the tree's DNA via color channels
  const p = createParticle("plant");
  p.lifetime = 0;

  // Encode biome into RGB (overrides random color)
  if (biomeVal < 0.2) {
    // Scrubland: short bushy shrubs (3-6 tall, wide canopy)
    p.r = 3 + Math.floor(Math.random() * 4);     // height 3-6
    p.g = 180 + Math.floor(Math.random() * 40);   // wide canopy, moderate lean
    p.b = 10 + Math.floor(Math.random() * 20);    // low branching
  } else if (biomeVal < 0.55) {
    // Temperate forest: medium trees (7-12 tall, moderate canopy)
    p.r = 7 + Math.floor(Math.random() * 6);      // height 7-12
    p.g = 100 + Math.floor(Math.random() * 60);   // moderate canopy
    p.b = 40 + Math.floor(Math.random() * 40);    // moderate branching
  } else if (biomeVal < 0.85) {
    // Tall forest: tall narrow trees (10-18 tall, narrow canopy)
    p.r = 10 + Math.floor(Math.random() * 9);     // height 10-18
    p.g = 40 + Math.floor(Math.random() * 40);    // narrow canopy, slight lean
    p.b = 60 + Math.floor(Math.random() * 50);    // frequent branching
  } else {
    // Ancient grove: mammoth trees (16-25 tall, massive canopy, rare)
    p.r = 16 + Math.floor(Math.random() * 10);    // height 16-25
    p.g = 200 + Math.floor(Math.random() * 50);   // huge canopy
    p.b = 80 + Math.floor(Math.random() * 60);    // heavy branching
  }

  p.updated = true;
  setCell(grid, x, y, p);
  spawnAt(grid, x - 1, y, "grass");
  spawnAt(grid, x + 1, y, "grass");
}

// ===== Plant (growth engine): the active tip that builds the tree =====
// Each tree's "DNA" is encoded in the particle's initial color values:
//   r: trunk height (6-13), lean direction, branch tendency
//   g: canopy width/shape
//   b: branching frequency
function updatePlant(grid: Grid, x: number, y: number, particle: Particle): void {
  if (currentDaylight < 0.1) return;

  const waterNearby = countNearby(grid, x, y, "water", 5);
  if (waterNearby === 0) return;

  const growChance = Math.min(0.2, 0.04 * waterNearby) * currentDaylight;
  if (Math.random() > growChance) return;

  particle.lifetime++;
  const stage = particle.lifetime;

  // Tree DNA: r=trunk height, g=canopy/lean, b=branching
  const trunkHeight = particle.r;                                   // direct height value
  const lean = particle.g > 160 ? 1 : particle.g < 80 ? -1 : 0;   // lean from g range
  const leanChance = 0.1 + (particle.g % 30) * 0.01;               // 0.1-0.4
  const branchFreq = particle.b / 500;                               // 0.0-0.28
  const canopyWidth = Math.max(3, Math.floor(particle.g / 30));     // 1-8+ radius

  // ---- Trunk growing phase ----
  if (stage <= trunkHeight) {
    // Determine growth direction: mostly up, sometimes lean
    let dx = 0;
    const dy = -1;
    if (stage > 2 && Math.random() < leanChance) {
      dx = lean;
    }

    const tx = x + dx;
    const ty = y + dy;
    const above = getCell(grid, tx, ty);
    const canGrow = !above || above.element === "leaf" || above.element === "grass" || above.element === "water";

    if (canGrow) {
      consumeWater(grid, x, y);
      // Leave a stem where we were
      const stem = createParticle("stem");
      stem.lifetime = 100;
      stem.updated = true;
      setCell(grid, x, y, stem);
      // Move the plant tip
      particle.updated = true;
      setCell(grid, tx, ty, particle);

      // Branching: occasionally spawn a new growth tip sideways
      if (stage > 3 && Math.random() < branchFreq) {
        const branchDir = lean === 0 ? (randomBool() ? -1 : 1) : -lean;
        const bx = x + branchDir;
        const by = y - 1;
        const branchTarget = getCell(grid, bx, by);
        if (!branchTarget || branchTarget.element === "water") {
          // Create a branch tip with shorter trunk height
          const branch = createParticle("plant");
          branch.lifetime = Math.max(stage, trunkHeight - 3);
          // Inherit DNA but with smaller canopy
          branch.r = particle.r;
          branch.g = Math.max(0, particle.g - 30);
          branch.b = Math.max(0, particle.b - 20);
          branch.updated = true;
          setCell(grid, bx, by, branch);
        }
      }
    }
    if (canGrow) return;
  }

  // ---- Canopy phase ----
  const canopyAge = stage - trunkHeight;
  const radius = Math.min(canopyAge, canopyWidth);
  let grew = false;

  for (let attempt = 0; attempt < 5; attempt++) {
    // Canopy shape: dome, wider than tall
    const cdx = Math.floor(Math.random() * (radius * 2 + 1)) - radius;
    const maxUp = Math.floor(radius * 0.6) + 1;
    const cdy = -Math.floor(Math.random() * maxUp);
    const tx = x + cdx;
    const ty = y + cdy;

    const target = getCell(grid, tx, ty);
    if (target && target.element !== "water") continue;

    const support = countNearbyAny(grid, tx, ty, ["stem", "leaf", "plant"], 2);
    if (support === 0) continue;

    const dist = Math.abs(cdx) + Math.abs(cdy);
    let element: Particle["element"];
    if (dist >= radius - 1 && Math.random() < 0.12) {
      element = "flower";
    } else {
      element = "leaf";
    }

    const newP = createParticle(element);
    newP.updated = true;
    setCell(grid, tx, ty, newP);
    consumeWater(grid, x, y);
    grew = true;
  }

  if (canopyAge > 14 || (!grew && canopyAge > 7)) {
    const leaf = createParticle("leaf");
    leaf.updated = true;
    setCell(grid, x, y, leaf);
  }
}

// ===== Stem: structural trunk, stable once placed =====
function updateStem(_grid: Grid, _x: number, _y: number, _particle: Particle): void {
  // Stems are structural - they don't grow on their own.
  // The plant particle (growth tip) builds the trunk by placing stems.
  // Stems just exist as the tree's skeleton.
}

// ===== Leaf: can spread, fruit, and decay only when disconnected =====
function updateLeaf(grid: Grid, x: number, y: number, particle: Particle): void {
  if (currentDaylight > 0.1) particle.lifetime++;

  // Only decay if disconnected from the tree (no stem/plant nearby)
  const connected = countNearbyAny(grid, x, y, ["stem", "plant", "leaf"], 1) >= 2;
  if (!connected && particle.lifetime > 100 && Math.random() < 0.003) {
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  const waterNearby = countNearby(grid, x, y, "water", 3);

  // Mature leaves near flowers can grow fruit
  if (particle.lifetime > 20 && waterNearby > 0 && Math.random() < 0.003) {
    if (hasNeighbor(grid, x, y, "flower")) {
      const dirs: [number, number][] = [[0, 1], [-1, 1], [1, 1], [-1, 0], [1, 0]];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      if (dir && isEmpty(grid, x + dir[0], y + dir[1])) {
        spawnAt(grid, x + dir[0], y + dir[1], "fruit");
      }
    }
  }

  if (waterNearby === 0) return;
  if (Math.random() > 0.02) return;

  // Leaves spread outward and upward
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const tx = x + dx;
  const ty = y + dy;

  // Can grow into empty cells or displace water
  const leafTarget = getCell(grid, tx, ty);
  if (leafTarget && leafTarget.element !== "water") return;

  // Need structural support: solid below or attached to other vegetation
  const vegSupport = countNearbyAny(grid, tx, ty, ["stem", "leaf", "plant", "vine"], 1);
  if (vegSupport === 0 && !hasSolidBelow(grid, tx, ty)) return;

  // Don't grow too dense
  const leafCount = countNearbyAny(grid, tx, ty, ["leaf", "flower", "plant", "fruit"], 1);
  if (leafCount >= 3) return;

  // Spawn new growth, displacing water if present
  const element = Math.random() < 0.06 ? "flower" : "leaf";
  const newLeaf = createParticle(element);
  newLeaf.updated = true;
  setCell(grid, tx, ty, newLeaf);
}

// ===== Flower: releases pollen during daytime, eventually wilts =====
function updateFlower(grid: Grid, x: number, y: number, particle: Particle): void {
  if (currentDaylight > 0.1) particle.lifetime++;

  // Flowers only wilt if disconnected from the plant
  const flowerConnected = hasAnyNeighbor(grid, x, y, ["stem", "leaf", "plant"]);
  if (!flowerConnected && particle.lifetime > 150 && Math.random() < 0.003) {
    const ash = createParticle("compost");
    ash.updated = true;
    setCell(grid, x, y, ash);
    return;
  }

  // Release pollen from mature flowers during the day
  if (particle.lifetime < 20 || currentDaylight < 0.3) return;
  const waterNearby = countNearby(grid, x, y, "water", 4);
  if (waterNearby === 0 && Math.random() > 0.001) return;
  if (Math.random() > 0.01) return;

  // Release pollen upward
  const pollenDirs: [number, number][] = [[-1, -1], [0, -1], [1, -1], [-1, -2], [0, -2], [1, -2]];
  const dir = pollenDirs[Math.floor(Math.random() * pollenDirs.length)];
  if (dir && isEmpty(grid, x + dir[0], y + dir[1])) {
    spawnAt(grid, x + dir[0], y + dir[1], "pollen");
  }

  // Flowers attract bees (rare spawn)
  if (particle.lifetime > 40 && Math.random() < 0.0004) {
    // Spawn bee above flower if space is available
    for (const [bx, by] of [[-1, -1], [0, -2], [1, -1]] as [number, number][]) {
      if (isEmpty(grid, x + bx, y + by)) {
        spawnAt(grid, x + bx, y + by, "bee");
        break;
      }
    }
  }
}

// ===== Grass: spreads horizontally along soil, eventually decays =====
function updateGrass(grid: Grid, x: number, y: number, particle: Particle): void {
  particle.lifetime++;

  // Grass only decays if isolated (no other grass, stem, or soil nearby)
  const grassConnected = hasAnyNeighbor(grid, x, y, ["grass", "stem", "plant", "soil"]);
  if (!grassConnected && particle.lifetime > 200 && Math.random() < 0.003) {
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  if (currentDaylight < 0.1) return;
  if (!hasAnyNeighbor(grid, x, y, ["grass", "stem", "plant", "soil"])) return;
  const waterNearby = countNearby(grid, x, y, "water", 2);
  if (waterNearby === 0 && Math.random() > 0.002) return;
  if (Math.random() > 0.03) return;

  // Spread sideways, only on soil or near other grass
  let grew = false;
  const side = randomBool() ? -1 : 1;
  const belowTarget = getCell(grid, x + side, y + 1);
  const onSoil = belowTarget && belowTarget.element === "soil";
  if (isEmpty(grid, x + side, y) && (onSoil || (hasSolidBelow(grid, x + side, y) && hasNeighbor(grid, x + side, y, "grass")))) {
    if (spawnAt(grid, x + side, y, "grass")) grew = true;
  }
  // Occasionally grow one cell up
  if (Math.random() < 0.1 && isEmpty(grid, x, y - 1)) {
    if (spawnAt(grid, x, y - 1, "grass")) grew = true;
  }
  if (grew && waterNearby > 0) consumeWater(grid, x, y);
}

// ===== Moss: grows on hard surfaces (stone, wood, metal) =====
function updateMoss(grid: Grid, x: number, y: number): void {
  const surfaces = ["stone", "wood", "glass", "iron", "copper", "rust", "patina"];
  if (!hasAnyNeighbor(grid, x, y, surfaces) && !hasNeighbor(grid, x, y, "moss")) return;

  const waterNearby = countNearby(grid, x, y, "water", 2);
  if (waterNearby === 0 && Math.random() > 0.001) return;
  if (Math.random() > 0.02) return;

  // Grow along surfaces in any direction
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const tx = x + dx;
  const ty = y + dy;

  if (!isEmpty(grid, tx, ty)) return;
  // Must be next to a surface
  if (!hasAnyNeighbor(grid, tx, ty, surfaces) && !hasNeighbor(grid, tx, ty, "moss")) return;

  if (spawnAt(grid, tx, ty, "moss") && waterNearby > 0) {
    consumeWater(grid, x, y);
  }
}

// ===== Algae: grows inside water =====
function updateAlgae(grid: Grid, x: number, y: number): void {
  if (Math.random() > 0.015) return;

  // Algae spreads to water cells
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const cell = getCell(grid, x + dx, y + dy);
  if (cell && cell.element === "water") {
    const algae = createParticle("algae");
    algae.updated = true;
    setCell(grid, x + dx, y + dy, algae);
  }
}

// ===== Vine: creeps along surfaces =====
function updateVine(grid: Grid, x: number, y: number, _particle: Particle): void {
  const waterNearby = countNearby(grid, x, y, "water", 2);
  if (waterNearby === 0 && Math.random() > 0.001) return;
  if (Math.random() > 0.02) return;

  const surfaces = ["stone", "wood", "glass", "iron", "copper", "rust", "patina"];
  const hasSurface = hasAnyNeighbor(grid, x, y, surfaces);
  if (!hasSurface && !hasNeighbor(grid, x, y, "vine")) return;

  // Vine prefers sideways and downward, hugging walls
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, 1], [-1, 1], [1, 1], [0, -1]];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const tx = x + dx;
  const ty = y + dy;

  if (!isEmpty(grid, tx, ty)) return;

  // Don't overgrow
  const vineCount = countNearby(grid, tx, ty, "vine", 1);
  if (vineCount >= 2) return;

  if (!spawnAt(grid, tx, ty, "vine")) return;
  if (waterNearby > 0) consumeWater(grid, x, y);

  // Vines occasionally grow leaves
  if (Math.random() < 0.08) {
    const leafDir = dirs[Math.floor(Math.random() * dirs.length)];
    if (leafDir) {
      spawnAt(grid, tx + leafDir[0], ty + leafDir[1], "leaf");
    }
  }
}

// ===== Fruit: grows on mature plants, falls when ripe, becomes a seed on the ground =====
function updateFruit(grid: Grid, x: number, y: number, particle: Particle): void {
  // Fruit hangs on plants until it ripens (lifetime tracks ripeness)
  const attachedToPlant = hasAnyNeighbor(grid, x, y, ["leaf", "stem", "plant", "vine"]);

  if (attachedToPlant) {
    // Still growing on the plant
    particle.lifetime++;
    // Darken slightly as it ripens
    particle.r = Math.min(255, particle.r + 1);

    // When ripe, detach and fall
    if (particle.lifetime > 40 && Math.random() < 0.02) {
      // Fall as powder
      if (tryMove(grid, x, y, x, y + 1)) return;
      const leftFirst = randomBool();
      if (tryMove(grid, x, y, x + (leftFirst ? -1 : 1), y + 1)) return;
      tryMove(grid, x, y, x + (leftFirst ? 1 : -1), y + 1);
    }
    return;
  }

  // Not attached: fall like powder
  if (tryMove(grid, x, y, x, y + 1)) return;
  const leftFirst = randomBool();
  if (tryMove(grid, x, y, x + (leftFirst ? -1 : 1), y + 1)) return;
  if (tryMove(grid, x, y, x + (leftFirst ? 1 : -1), y + 1)) return;

  // On the ground: slowly become a seed
  if (hasSolidBelow(grid, x, y)) {
    particle.lifetime++;
    if (particle.lifetime > 60 && Math.random() < 0.03) {
      const seed = createParticle("seed");
      seed.updated = true;
      setCell(grid, x, y, seed);
    }
  }
}

// ===== Soil: wet soil spontaneously sprouts life =====
function updateSoil(grid: Grid, x: number, y: number): void {
  if (currentDaylight < 0.1) return;
  const waterNearby = countNearby(grid, x, y, "water", 2);
  if (waterNearby === 0) return;

  // Check cell above: must be empty or water (seeds push through water)
  const above = getCell(grid, x, y - 1);
  if (above && above.element !== "water") return;

  // Mushrooms: need nearby decay (ash, charcoal)
  const decay = ["ash", "charcoal"];
  if (hasAnyNeighbor(grid, x, y, decay) || hasNeighbor(grid, x, y, "mushroom")) {
    if (Math.random() < 0.0003) {
      const p = createParticle("mushroom");
      p.updated = true;
      setCell(grid, x, y - 1, p);
      return;
    }
  }

  // Spontaneous seed: life emerges from fertile wet soil
  if (Math.random() < 0.002 * currentDaylight) {
    const seed = createParticle("seed");
    seed.updated = true;
    setCell(grid, x, y - 1, seed);
    return;
  }

  // Worms spawn in wet soil (rare, underground life)
  if (Math.random() < 0.0002) {
    // Worms prefer to spawn below ground (soil below too)
    const below = getCell(grid, x, y + 1);
    if (below && (below.element === "soil" || below.element === "sand")) {
      const worm = createParticle("worm");
      worm.updated = true;
      setCell(grid, x, y, worm);
    }
  }
}

// ===== Mushroom: grows on dead organic matter, spreads slowly in damp conditions =====
function updateMushroom(grid: Grid, x: number, y: number): void {
  const substrate = ["ash", "charcoal", "wood", "soil"];
  if (!hasAnyNeighbor(grid, x, y, substrate) && !hasNeighbor(grid, x, y, "mushroom")) return;

  const waterNearby = countNearby(grid, x, y, "water", 3);
  if (waterNearby === 0 && Math.random() > 0.0005) return;
  if (Math.random() > 0.01) return;

  // Spread to adjacent cells on or near substrate
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, -1], [-1, -1], [1, -1]];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const tx = x + dx;
  const ty = y + dy;

  if (!isEmpty(grid, tx, ty)) return;

  // Don't overgrow
  const count = countNearby(grid, tx, ty, "mushroom", 2);
  if (count >= 3) return;

  if (spawnAt(grid, tx, ty, "mushroom") && waterNearby > 0) {
    consumeWater(grid, x, y);
  }
}

// ===== Pollen: drifts like gas, lands on ground to become a seed =====
function updatePollen(grid: Grid, x: number, y: number, particle: Particle): void {
  particle.lifetime--;

  if (particle.lifetime <= 0) {
    setCell(grid, x, y, null);
    return;
  }

  // Check if pollen lands on fertile ground
  if (hasSolidBelow(grid, x, y)) {
    // Much higher chance on fertile ground (soil, ash)
    const fertile = hasAnyNeighbor(grid, x, y, ["soil", "ash"]);
    const chance = fertile ? 0.3 : 0.08;
    if (Math.random() < chance) {
      const seed = createParticle("seed");
      seed.updated = true;
      setCell(grid, x, y, seed);
      return;
    }
  }

  // Pollen near water settles faster
  if (hasNeighbor(grid, x, y, "water") && Math.random() < 0.2) {
    const seed = createParticle("seed");
    seed.updated = true;
    setCell(grid, x, y, seed);
    return;
  }

  // Float gently: mostly sideways with slight upward drift
  const drift = randomBool() ? -1 : 1;
  const roll = Math.random();
  if (roll < 0.35) {
    tryMove(grid, x, y, x + drift, y);
  } else if (roll < 0.55) {
    tryMove(grid, x, y, x + drift, y - 1);
  } else if (roll < 0.75) {
    tryMove(grid, x, y, x, y + 1);
  } else {
    tryMove(grid, x, y, x, y - 1);
  }
}

// ===== Fuse: catches fire slowly from neighbor fire, burns along its length =====
// ===== Compost: intermediate decay state, slowly becomes soil =====
function updateCompost(grid: Grid, x: number, y: number, particle: Particle): void {
  updatePowder(grid, x, y);
  particle.lifetime++;

  // Compost slowly becomes soil
  if (particle.lifetime > 100 && Math.random() < 0.005) {
    const soil = createParticle("soil");
    soil.updated = true;
    setCell(grid, x, y, soil);
    return;
  }

  // Wet compost converts faster
  if (countNearby(grid, x, y, "water", 2) > 0 && Math.random() < 0.01) {
    const soil = createParticle("soil");
    soil.updated = true;
    setCell(grid, x, y, soil);
    return;
  }

  // Worms can spawn in compost near soil
  if (particle.lifetime > 50 && hasNeighbor(grid, x, y, "soil") && Math.random() < 0.0005) {
    if (isEmpty(grid, x, y - 1)) {
      spawnAt(grid, x, y - 1, "worm");
    }
  }
}

// ===== Worm: burrows through soil, enriches it, spawns from wet soil =====
function updateWorm(grid: Grid, x: number, y: number, particle: Particle): void {
  particle.lifetime--;
  if (particle.lifetime <= 0) {
    // Worm dies, becomes compost
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  // Worms move through soil, compost, and ash (burrowing)
  const burrowable = ["soil", "compost", "ash", "sand"];
  const dirs: [number, number][] = [[-1, 0], [1, 0], [0, 1], [0, -1], [-1, 1], [1, 1]];

  // Prefer downward and sideways movement
  if (Math.random() < 0.3) {
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    if (!dir) return;
    const nx = x + dir[0];
    const ny = y + dir[1];
    const target = getCell(grid, nx, ny);
    if (target && burrowable.includes(target.element)) {
      // Swap with the soil/compost (burrow through it)
      swapCells(grid, x, y, nx, ny);
      const moved = getCell(grid, nx, ny);
      if (moved) moved.updated = true;

      // Enrichment: soil the worm passes through becomes more fertile
      // Convert sand/ash/compost to soil as the worm passes
      const left = getCell(grid, x, y);
      if (left && (left.element === "sand" || left.element === "ash" || left.element === "compost")) {
        const soil = createParticle("soil");
        soil.updated = true;
        setCell(grid, x, y, soil);
      }
      return;
    }

    // If in open air, fall
    if (!target) {
      tryMove(grid, x, y, nx, ny);
      return;
    }
  }

  // If somehow in open air, act like powder (fall)
  const below = getCell(grid, x, y + 1);
  if (!below) {
    tryMove(grid, x, y, x, y + 1);
  }
}

// ===== Bee: flies between flowers, boosts pollination =====
function updateBee(grid: Grid, x: number, y: number, particle: Particle): void {
  particle.lifetime--;
  if (particle.lifetime <= 0) {
    setCell(grid, x, y, null);
    return;
  }

  // If adjacent to a flower, "visit" it - boost pollen production
  if (hasNeighbor(grid, x, y, "flower")) {
    // Pollinate: occasionally spawn pollen near the flower
    if (Math.random() < 0.01) {
      const dirs: [number, number][] = [[-1, -1], [0, -1], [1, -1], [0, -2]];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      if (dir && isEmpty(grid, x + dir[0], y + dir[1])) {
        spawnAt(grid, x + dir[0], y + dir[1], "pollen");
      }
    }
    // Extend bee lifetime when feeding on flowers
    particle.lifetime = Math.min(particle.lifetime + 2, 800);
  }

  // Movement: purposeful flight toward flowers, with random wandering
  if (Math.random() < 0.5) return; // Don't move every tick (calmer)

  // Look for nearby flowers (within 6 cells) to fly toward
  let targetDx = 0;
  let targetDy = 0;
  let foundFlower = false;
  for (let dy = -6; dy <= 6 && !foundFlower; dy++) {
    for (let dx = -6; dx <= 6; dx++) {
      const cell = getCell(grid, x + dx, y + dy);
      if (cell && cell.element === "flower") {
        targetDx = dx > 0 ? 1 : dx < 0 ? -1 : 0;
        targetDy = dy > 0 ? 1 : dy < 0 ? -1 : 0;
        foundFlower = true;
        break;
      }
    }
  }

  if (foundFlower) {
    // Fly toward flower
    tryMove(grid, x, y, x + targetDx, y + targetDy);
  } else {
    // Random wandering flight
    const dx = Math.random() < 0.33 ? -1 : Math.random() < 0.5 ? 1 : 0;
    const dy = Math.random() < 0.33 ? -1 : Math.random() < 0.5 ? 1 : 0;
    tryMove(grid, x, y, x + dx, y + dy);
  }
}

function updateFuse(grid: Grid, x: number, y: number, _particle: Particle): void {
  if (!hasAnyNeighbor(grid, x, y, ["fire", "spark", "lava"])) return;
  if (Math.random() > 0.08) return; // Slow burn rate = suspense

  const fire = createParticle("fire");
  fire.lifetime = 8; // Short fire, just enough to ignite the next fuse cell
  fire.updated = true;
  setCell(grid, x, y, fire);
}

// ===== TNT: explodes when touched by fire/spark, blasts particles outward =====
function explode(grid: Grid, cx: number, cy: number, radius: number): void {
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > radius) continue;

      const x = cx + dx;
      const y = cy + dy;
      if (!inBounds(grid, x, y)) continue;

      const cell = getCell(grid, x, y);

      // Inner core: fire and sparks
      if (dist < radius * 0.4) {
        const p = createParticle(Math.random() < 0.5 ? "fire" : "spark");
        p.updated = true;
        setCell(grid, x, y, p);
        continue;
      }

      // Middle ring: destroy or ignite
      if (dist < radius * 0.7) {
        if (!cell) {
          if (Math.random() < 0.4) {
            const p = createParticle(Math.random() < 0.6 ? "smoke" : "fire");
            p.updated = true;
            setCell(grid, x, y, p);
          }
        } else if (cell.element === "tnt") {
          // Chain reaction: other TNT explodes too
          explode(grid, x, y, radius);
        } else if (ELEMENTS[cell.element].flammable) {
          const p = createParticle("fire");
          p.updated = true;
          setCell(grid, x, y, p);
        } else if (ELEMENTS[cell.element].behavior !== "static" || cell.element === "stone") {
          // Blast pushes or destroys non-static particles
          if (Math.random() < 0.6) {
            setCell(grid, x, y, null);
          }
        }
        continue;
      }

      // Outer ring: smoke and shockwave
      if (!cell) {
        if (Math.random() < 0.2) {
          const p = createParticle("smoke");
          p.updated = true;
          setCell(grid, x, y, p);
        }
      } else if (ELEMENTS[cell.element].flammable && Math.random() < 0.3) {
        const p = createParticle("fire");
        p.updated = true;
        setCell(grid, x, y, p);
      }
    }
  }
}

function updateExplosive(grid: Grid, x: number, y: number, _particle: Particle): void {
  if (!hasAnyNeighbor(grid, x, y, ["fire", "spark", "lava"])) return;

  // TNT goes boom
  setCell(grid, x, y, null);
  explode(grid, x, y, 12);
}

// ===== Wax: melts into oil when near fire/lava =====
function updateWax(grid: Grid, x: number, y: number): void {
  if (!hasAnyNeighbor(grid, x, y, ["fire", "lava", "spark"])) return;
  if (Math.random() > 0.05) return;

  const oil = createParticle("oil");
  oil.updated = true;
  setCell(grid, x, y, oil);
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

      return;
    }
  }
}

export function tickSimulation(grid: Grid, tick: number, daylight: number = 1): void {
  currentDaylight = daylight;

  // Reset updated flags
  for (let i = 0; i < grid.cells.length; i++) {
    const cell = grid.cells[i];
    if (cell) cell.updated = false;
  }

  const leftToRight = tick % 2 === 0;

  for (let y = grid.height - 1; y >= 0; y--) {
    const startX = leftToRight ? 0 : grid.width - 1;
    const endX = leftToRight ? grid.width : -1;
    const stepX = leftToRight ? 1 : -1;

    for (let x = startX; x !== endX; x += stepX) {
      const particle = getCell(grid, x, y);
      if (!particle || particle.updated) continue;

      const def = ELEMENTS[particle.element];

      // Handle lifetime for gases (except pollen which has custom logic)
      if (def.lifetime && def.behavior === "gas" && particle.element !== "pollen") {
        particle.lifetime--;
        if (particle.lifetime <= 0) {
          setCell(grid, x, y, null);
          continue;
        }
      }

      switch (def.behavior) {
        case "powder":
          if (particle.element === "seed") {
            updateSeed(grid, x, y, particle);
          } else if (particle.element === "fruit") {
            updateFruit(grid, x, y, particle);
          } else if (particle.element === "soil") {
            updatePowder(grid, x, y);
            updateSoil(grid, x, y);
          } else if (particle.element === "compost") {
            updateCompost(grid, x, y, particle);
          } else if (particle.element === "ash" || particle.element === "charcoal") {
            updatePowder(grid, x, y);
            // Wet ash/charcoal decomposes into soil
            if (countNearby(grid, x, y, "water", 2) > 0 && Math.random() < 0.015) {
              const soil = createParticle("soil");
              soil.updated = true;
              setCell(grid, x, y, soil);
            }
          } else {
            updatePowder(grid, x, y);
          }
          break;
        case "liquid":
          updateLiquid(grid, x, y);
          // Solar evaporation: exposed water slowly becomes steam during the day
          if (particle.element === "water" && currentDaylight > 0.3) {
            const exposed = isEmpty(grid, x, y - 1);
            if (exposed && Math.random() < 0.0015 * currentDaylight) {
              const steam = createParticle("steam");
              steam.updated = true;
              setCell(grid, x, y, steam);
            }
          }
          break;
        case "gas":
          if (particle.element === "pollen") {
            updatePollen(grid, x, y, particle);
          } else {
            updateGas(grid, x, y);
          }
          break;
        case "fire":
          updateFire(grid, x, y, particle);
          break;
        case "plant":
          updatePlant(grid, x, y, particle);
          break;
        case "vine":
          updateVine(grid, x, y, particle);
          break;
        case "fuse":
          updateFuse(grid, x, y, particle);
          break;
        case "explosive":
          updateExplosive(grid, x, y, particle);
          break;
        case "critter":
          if (particle.element === "worm") {
            updateWorm(grid, x, y, particle);
          } else if (particle.element === "bee") {
            updateBee(grid, x, y, particle);
          }
          break;
        case "static":
          switch (particle.element) {
            case "wax":
              updateWax(grid, x, y);
              break;
            case "stem":
              updateStem(grid, x, y, particle);
              break;
            case "leaf":
              updateLeaf(grid, x, y, particle);
              break;
            case "flower":
              updateFlower(grid, x, y, particle);
              break;
            case "grass":
              updateGrass(grid, x, y, particle);
              break;
            case "moss":
              updateMoss(grid, x, y);
              break;
            case "algae":
              updateAlgae(grid, x, y);
              break;
            case "mushroom":
              updateMushroom(grid, x, y);
              break;
          }
          break;
      }

      // Check reactions after movement
      checkReactions(grid, x, y);
    }
  }
}
