import type { Grid, Particle } from "./types";
import { ELEMENTS, variedColor } from "./elements";
import { getCell, setCell, swapCells, inBounds } from "./grid";
import { REACTION_MAP } from "./reactions";

/** Current daylight level for this tick (0=night, 1=day). Set by tickSimulation. */
let currentDaylight = 1;
/** Current wind direction (-1 or 1). Slowly oscillates. Set by tickSimulation. */
let currentWindDir = 1;

export function createParticle(element: Particle["element"]): Particle {
  const def = ELEMENTS[element];
  const [r, g, b] = variedColor(def.baseColor, element);
  const p: Particle = {
    element,
    r,
    g,
    b,
    lifetime: def.lifetime ?? 0,
    updated: false,
  };
  if (element === "bird") {
    p.r = 150; // hunger (starts moderately full)
    p.g = 0; // seeds carried (none initially)
    p.b = Math.random() < 0.5 ? 1 : 0; // random direction
  }
  if (element === "human") {
    // State encoding: r=hunger, g=thirst, b=packed behavior bits, lifetime=age
    p.r = 200; // hunger (full)
    p.g = 200; // thirst (full)
    // b bits: 0-1=direction, 2=carrying, 3=material type, 4-6=activity, 7=sex
    p.b = (Math.random() < 0.5 ? 0x80 : 0) | 0x01; // random sex, facing right
    p.lifetime = 0; // age starts at 0
  }
  return p;
}

function randomBool(): boolean {
  return Math.random() < 0.5;
}

function isEmpty(grid: Grid, x: number, y: number): boolean {
  return inBounds(grid, x, y) && getCell(grid, x, y) === null;
}

function hasNeighbor(
  grid: Grid,
  x: number,
  y: number,
  element: string,
): boolean {
  const offsets: [number, number][] = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  for (const [dx, dy] of offsets) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell?.element === element) return true;
  }
  return false;
}

function hasAnyNeighbor(
  grid: Grid,
  x: number,
  y: number,
  elements: string[],
): boolean {
  const offsets: [number, number][] = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
  ];
  for (const [dx, dy] of offsets) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell && elements.includes(cell.element)) return true;
  }
  return false;
}

const SOLID_BEHAVIORS = new Set([
  "static",
  "plant",
  "vine",
  "fuse",
  "explosive",
  "powder",
]);

function hasSolidBelow(grid: Grid, x: number, y: number): boolean {
  const below = getCell(grid, x, y + 1);
  if (!below) return !inBounds(grid, x, y + 1);
  return SOLID_BEHAVIORS.has(ELEMENTS[below.element].behavior);
}

function countNearby(
  grid: Grid,
  x: number,
  y: number,
  element: string,
  radius: number,
): number {
  let count = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cell = getCell(grid, x + dx, y + dy);
      if (cell?.element === element) count++;
    }
  }
  return count;
}

function countNearbyAny(
  grid: Grid,
  x: number,
  y: number,
  elements: string[],
  radius: number,
): number {
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
  const dirs: [number, number][] = [
    [0, -1],
    [0, 1],
    [-1, 0],
    [1, 0],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  // First try actual water particles
  for (const [dx, dy] of dirs) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell?.element === "water") {
      setCell(grid, x + dx, y + dy, null);
      return true;
    }
  }
  // Then try drawing from wet soil moisture
  for (const [dx, dy] of dirs) {
    const cell = getCell(grid, x + dx, y + dy);
    if (cell?.element === "soil" && cell.lifetime > 20) {
      cell.lifetime -= 20;
      return true;
    }
  }
  return false;
}

/** Count available moisture: water particles + wet soil (lifetime > 0) in radius */
function countMoisture(
  grid: Grid,
  x: number,
  y: number,
  radius: number,
): number {
  let moisture = 0;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cell = getCell(grid, x + dx, y + dy);
      if (!cell) continue;
      if (cell.element === "water") moisture++;
      else if (cell.element === "soil" && cell.lifetime > 0) moisture += 0.5;
    }
  }
  return moisture;
}

function spawnAt(
  grid: Grid,
  x: number,
  y: number,
  element: Particle["element"],
): boolean {
  if (!isEmpty(grid, x, y)) return false;
  const p = createParticle(element);
  p.updated = true;
  setCell(grid, x, y, p);
  return true;
}

function tryMove(
  grid: Grid,
  x: number,
  y: number,
  nx: number,
  ny: number,
): boolean {
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

function updateFire(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
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
    // Fire dies: sometimes a wisp of smoke, otherwise just disappears
    if (Math.random() < 0.2) {
      const smoke = createParticle("smoke");
      smoke.updated = true;
      setCell(grid, x, y, smoke);
    } else {
      setCell(grid, x, y, null);
    }
    return;
  }

  // Wildfire spread: fire actively ignites flammable neighbors (including diagonals)
  if (Math.random() < 0.3) {
    const spreadDirs: [number, number][] = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    const sd = spreadDirs[Math.floor(Math.random() * spreadDirs.length)];
    if (sd) {
      const neighbor = getCell(grid, x + sd[0], y + sd[1]);
      if (
        neighbor &&
        ELEMENTS[neighbor.element].flammable &&
        Math.random() < 0.15
      ) {
        const fire = createParticle("fire");
        fire.updated = true;
        setCell(grid, x + sd[0], y + sd[1], fire);
      }
    }
  }

  updateGas(grid, x, y);
}

// ===== Seed: falls, then sprouts a stem when watered =====
function updateSeed(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  // Try to fall first
  if (tryMove(grid, x, y, x, y + 1)) return;
  const leftFirst = randomBool();
  if (tryMove(grid, x, y, x + (leftFirst ? -1 : 1), y + 1)) return;
  if (tryMove(grid, x, y, x + (leftFirst ? 1 : -1), y + 1)) return;

  // Settled: need moisture within 2 cells (water or wet soil)
  if (!hasSolidBelow(grid, x, y) || countMoisture(grid, x, y, 2) === 0) return;

  // Seeds near a wall/surface sprout into vine (on any ground)
  const surfaces = [
    "stone",
    "wood",
    "glass",
    "iron",
    "copper",
    "rust",
    "patina",
  ];
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
    p.r = 3 + Math.floor(Math.random() * 4); // height 3-6
    p.g = 180 + Math.floor(Math.random() * 40); // wide canopy, moderate lean
    p.b = 10 + Math.floor(Math.random() * 20); // low branching
  } else if (biomeVal < 0.55) {
    // Temperate forest: medium trees (7-12 tall, moderate canopy)
    p.r = 7 + Math.floor(Math.random() * 6); // height 7-12
    p.g = 100 + Math.floor(Math.random() * 60); // moderate canopy
    p.b = 40 + Math.floor(Math.random() * 40); // moderate branching
  } else if (biomeVal < 0.85) {
    // Tall forest: tall narrow trees (10-18 tall, narrow canopy)
    p.r = 10 + Math.floor(Math.random() * 9); // height 10-18
    p.g = 40 + Math.floor(Math.random() * 40); // narrow canopy, slight lean
    p.b = 60 + Math.floor(Math.random() * 50); // frequent branching
  } else {
    // Ancient grove: mammoth trees (16-25 tall, massive canopy, rare)
    p.r = 16 + Math.floor(Math.random() * 10); // height 16-25
    p.g = 200 + Math.floor(Math.random() * 50); // huge canopy
    p.b = 80 + Math.floor(Math.random() * 60); // heavy branching
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
function updatePlant(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  if (currentDaylight < 0.1) return;

  const waterNearby = countMoisture(grid, x, y, 5);
  if (waterNearby === 0) return;

  const growChance = Math.min(0.2, 0.04 * waterNearby) * currentDaylight;
  if (Math.random() > growChance) return;

  particle.lifetime++;
  const stage = particle.lifetime;

  // Tree DNA: r=trunk height, g=canopy/lean, b=branching
  const trunkHeight = particle.r; // direct height value
  const lean = particle.g > 160 ? 1 : particle.g < 80 ? -1 : 0; // lean from g range
  const leanChance = 0.1 + (particle.g % 30) * 0.01; // 0.1-0.4
  const branchFreq = particle.b / 500; // 0.0-0.28
  const canopyWidth = Math.max(3, Math.floor(particle.g / 30)); // 1-8+ radius

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
    const canGrow =
      !above ||
      above.element === "leaf" ||
      above.element === "grass" ||
      above.element === "water";

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

  if (canopyAge > 20 || (!grew && canopyAge > 12)) {
    const leaf = createParticle("leaf");
    leaf.updated = true;
    setCell(grid, x, y, leaf);
  }
}

// ===== Stem: structural trunk, slowly grows and branches when watered =====
function updateStem(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  if (currentDaylight < 0.1) return;
  particle.lifetime++;

  const waterNearby = countMoisture(grid, x, y, 4);
  if (waterNearby === 0) return;

  // Mature stems (well-established) can slowly extend the tree
  if (particle.lifetime < 200) return;

  // Wound healing: regrow into adjacent empty gaps between stems
  // Detects holes left by chopping and fills them in
  if (Math.random() < 0.002) {
    const dirs: [number, number][] = [
      [0, -1],
      [0, 1],
      [-1, 0],
      [1, 0],
    ];
    for (const [dx, dy] of dirs) {
      const gap = getCell(grid, x + dx, y + dy);
      if (gap && gap.element !== "stem") continue; // not a gap
      if (gap) continue; // occupied
      if (!isEmpty(grid, x + dx, y + dy)) continue;
      // Check if the other side of the gap has a stem (bridging a hole)
      const beyond = getCell(grid, x + dx * 2, y + dy * 2);
      if (beyond?.element === "stem") {
        consumeWater(grid, x, y);
        const heal = createParticle("stem");
        heal.lifetime = 0;
        heal.updated = true;
        setCell(grid, x + dx, y + dy, heal);
        return;
      }
    }
  }

  // Slow trunk extension: topmost stem grows upward occasionally
  const above = getCell(grid, x, y - 1);
  if (
    above &&
    (above.element === "leaf" || above.element === "flower") &&
    Math.random() < 0.0003
  ) {
    // Only extend if this is near the top of the trunk (has air or leaf above, stem below)
    const below = getCell(grid, x, y + 1);
    if (below?.element === "stem") {
      consumeWater(grid, x, y);
      // Push the leaf up by replacing it with stem and placing leaf above
      const newStem = createParticle("stem");
      newStem.lifetime = 0;
      newStem.updated = true;
      setCell(grid, x, y - 1, newStem);
      // Place leaf where it got displaced to
      if (isEmpty(grid, x, y - 2)) {
        const leaf = createParticle("leaf");
        leaf.updated = true;
        setCell(grid, x, y - 2, leaf);
      }
    }
  }

  // Slow branching: mature stems sprout new growth sideways
  if (particle.lifetime > 400 && Math.random() < 0.0002) {
    const side = randomBool() ? -1 : 1;
    const bx = x + side;
    const by = y - 1;
    const target = getCell(grid, bx, by);
    if (!target || target.element === "water") {
      consumeWater(grid, x, y);
      // Spawn a small branch tip
      const branch = createParticle("plant");
      branch.lifetime = 0;
      branch.r = 2 + Math.floor(Math.random() * 3); // short branch (2-4)
      branch.g = 60 + Math.floor(Math.random() * 40); // small canopy
      branch.b = 10; // minimal sub-branching
      branch.updated = true;
      setCell(grid, bx, by, branch);
    }
  }

  // Slow trunk thickening: grow adjacent stem next to existing stem
  if (particle.lifetime > 600 && Math.random() < 0.0001) {
    const side = randomBool() ? -1 : 1;
    const neighbor = getCell(grid, x + side, y);
    if (!neighbor || neighbor.element === "water") {
      // Only thicken if there's stem above and below (we're mid-trunk)
      const hasAbove = getCell(grid, x, y - 1);
      const hasBelow = getCell(grid, x, y + 1);
      if (hasAbove?.element === "stem" && hasBelow?.element === "stem") {
        consumeWater(grid, x, y);
        const thickStem = createParticle("stem");
        thickStem.lifetime = 0;
        thickStem.updated = true;
        setCell(grid, x + side, y, thickStem);
      }
    }
  }

  // Root spreading: base stems convert nearby sand to soil
  if (particle.lifetime > 300 && Math.random() < 0.0003) {
    const rootDirs: [number, number][] = [
      [-1, 1],
      [0, 1],
      [1, 1],
      [-2, 1],
      [2, 1],
      [-1, 2],
      [0, 2],
      [1, 2],
    ];
    const rd = rootDirs[Math.floor(Math.random() * rootDirs.length)];
    if (rd) {
      const target = getCell(grid, x + rd[0], y + rd[1]);
      if (target?.element === "sand") {
        const soil = createParticle("soil");
        soil.lifetime = 20; // slightly moist from root activity
        soil.updated = true;
        setCell(grid, x + rd[0], y + rd[1], soil);
      }
    }
  }
}

// ===== Leaf: can spread, fruit, and decay only when disconnected =====
function updateLeaf(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  if (currentDaylight > 0.1) particle.lifetime++;

  // Disconnected leaves: fall as litter, decay faster on ground
  const connected =
    countNearbyAny(grid, x, y, ["stem", "plant", "leaf"], 1) >= 2;
  if (!connected) {
    // Detached leaves fall like powder (leaf litter)
    if (!hasSolidBelow(grid, x, y)) {
      if (tryMove(grid, x, y, x, y + 1)) return;
      const fallSide = randomBool() ? -1 : 1;
      if (tryMove(grid, x, y, x + fallSide, y + 1)) return;
    }
    // Faster decay when grounded (becomes compost/soil at forest edge)
    if (
      hasSolidBelow(grid, x, y) &&
      particle.lifetime > 60 &&
      Math.random() < 0.008
    ) {
      const compost = createParticle("compost");
      compost.updated = true;
      setCell(grid, x, y, compost);
      return;
    }
    // Normal slow decay for airborne disconnected leaves
    if (particle.lifetime > 100 && Math.random() < 0.003) {
      const compost = createParticle("compost");
      compost.updated = true;
      setCell(grid, x, y, compost);
      return;
    }
  }

  // Seasonal leaf drop: old connected leaves occasionally detach at night
  if (
    connected &&
    particle.lifetime > 400 &&
    currentDaylight < 0.2 &&
    Math.random() < 0.001
  ) {
    particle.lifetime = 50; // reset so it enters decay path soon
  }

  const waterNearby = countMoisture(grid, x, y, 3);

  // Transpiration: leaves release moisture as steam during the day (drives water cycle)
  if (currentDaylight > 0.3 && waterNearby > 1 && Math.random() < 0.0008) {
    // Release steam above if space is available
    const aboveDirs: [number, number][] = [
      [0, -1],
      [-1, -1],
      [1, -1],
    ];
    const td = aboveDirs[Math.floor(Math.random() * aboveDirs.length)];
    if (td && isEmpty(grid, x + td[0], y + td[1])) {
      spawnAt(grid, x + td[0], y + td[1], "steam");
      consumeWater(grid, x, y);
    }
  }

  // Mature leaves near flowers can grow fruit
  if (particle.lifetime > 20 && waterNearby > 0 && Math.random() < 0.003) {
    if (hasNeighbor(grid, x, y, "flower")) {
      const dirs: [number, number][] = [
        [0, 1],
        [-1, 1],
        [1, 1],
        [-1, 0],
        [1, 0],
      ];
      const dir = dirs[Math.floor(Math.random() * dirs.length)];
      if (dir && isEmpty(grid, x + dir[0], y + dir[1])) {
        spawnAt(grid, x + dir[0], y + dir[1], "fruit");
      }
    }
  }

  if (waterNearby === 0) return;

  // Leaves at canopy edges (fewer neighbors) spread more readily than interior leaves
  const ownDensity = countNearbyAny(grid, x, y, ["leaf", "flower", "fruit"], 1);
  const spreadChance = ownDensity <= 2 ? 0.015 : 0.003; // edge leaves spread 5x more
  if (Math.random() > spreadChance) return;

  // Prefer outward/upward growth at edges, not into dense canopy
  const dirs: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
  ];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const tx = x + dx;
  const ty = y + dy;

  // Can grow into empty cells or displace water
  const leafTarget = getCell(grid, tx, ty);
  if (leafTarget && leafTarget.element !== "water") return;

  // Need structural support: solid below or attached to other vegetation
  const vegSupport = countNearbyAny(
    grid,
    tx,
    ty,
    ["stem", "leaf", "plant", "vine"],
    1,
  );
  if (vegSupport === 0 && !hasSolidBelow(grid, tx, ty)) return;

  // Density check: strongly resist growing into already-dense areas
  const targetDensity = countNearbyAny(
    grid,
    tx,
    ty,
    ["leaf", "flower", "plant", "fruit"],
    2,
  );
  if (targetDensity >= 6) return; // wider radius, higher threshold for natural canopy shape

  // Spawn new growth, displacing water if present
  const element = Math.random() < 0.06 ? "flower" : "leaf";
  const newLeaf = createParticle(element);
  newLeaf.updated = true;
  setCell(grid, tx, ty, newLeaf);
}

// ===== Flower: releases pollen during daytime, eventually wilts =====
function updateFlower(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
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
  const waterNearby = countMoisture(grid, x, y, 4);
  if (waterNearby === 0 && Math.random() > 0.001) return;
  if (Math.random() > 0.01) return;

  // Release pollen upward
  const pollenDirs: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, -2],
    [0, -2],
    [1, -2],
  ];
  const dir = pollenDirs[Math.floor(Math.random() * pollenDirs.length)];
  if (dir && isEmpty(grid, x + dir[0], y + dir[1])) {
    spawnAt(grid, x + dir[0], y + dir[1], "pollen");
  }

  // Flowers attract bees (spawn when enough flowers nearby)
  if (
    particle.lifetime > 40 &&
    countNearby(grid, x, y, "bee", 6) < 2 &&
    Math.random() < 0.0008
  ) {
    // Spawn bee above flower if space is available
    for (const [bx, by] of [
      [-1, -1],
      [0, -2],
      [1, -1],
    ] as [number, number][]) {
      if (isEmpty(grid, x + bx, y + by)) {
        spawnAt(grid, x + bx, y + by, "bee");
        break;
      }
    }
  }
}

// ===== Grass: spreads horizontally along soil, eventually decays =====
function updateGrass(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  particle.lifetime++;

  // Grass only decays if isolated (no other grass, stem, or soil nearby)
  const grassConnected = hasAnyNeighbor(grid, x, y, [
    "grass",
    "stem",
    "plant",
    "soil",
  ]);
  if (!grassConnected && particle.lifetime > 200 && Math.random() < 0.003) {
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  if (currentDaylight < 0.1) return;
  if (!hasAnyNeighbor(grid, x, y, ["grass", "stem", "plant", "soil"])) return;
  const waterNearby = countMoisture(grid, x, y, 2);
  if (waterNearby === 0 && Math.random() > 0.002) return;
  if (Math.random() > 0.03) return;

  // Spread sideways: onto soil, wet sand (pioneer colonization), or near other grass
  let grew = false;
  const side = randomBool() ? -1 : 1;
  const belowTarget = getCell(grid, x + side, y + 1);
  const onSoil = belowTarget?.element === "soil";
  const onWetSand =
    belowTarget?.element === "sand" && countMoisture(grid, x + side, y, 2) > 0;
  if (
    isEmpty(grid, x + side, y) &&
    (onSoil ||
      onWetSand ||
      (hasSolidBelow(grid, x + side, y) &&
        hasNeighbor(grid, x + side, y, "grass")))
  ) {
    if (spawnAt(grid, x + side, y, "grass")) grew = true;
  }
  // Occasionally grow one cell up
  if (Math.random() < 0.1 && isEmpty(grid, x, y - 1)) {
    if (spawnAt(grid, x, y - 1, "grass")) grew = true;
  }
  if (grew && waterNearby > 0) consumeWater(grid, x, y);

  // Grass roots slowly convert sand below into soil (succession)
  if (particle.lifetime > 150 && Math.random() < 0.0005) {
    const below = getCell(grid, x, y + 1);
    if (below?.element === "sand") {
      const soil = createParticle("soil");
      soil.updated = true;
      setCell(grid, x, y + 1, soil);
    }
  }
}

// ===== Moss: grows on hard surfaces (stone, wood, metal) =====
function updateMoss(grid: Grid, x: number, y: number): void {
  const surfaces = [
    "stone",
    "wood",
    "glass",
    "iron",
    "copper",
    "rust",
    "patina",
  ];
  if (!hasAnyNeighbor(grid, x, y, surfaces) && !hasNeighbor(grid, x, y, "moss"))
    return;

  const waterNearby = countMoisture(grid, x, y, 2);
  if (waterNearby === 0 && Math.random() > 0.001) return;
  if (Math.random() > 0.02) return;

  // Grow along surfaces in any direction
  const dirs: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, -1],
    [1, -1],
    [-1, 1],
    [1, 1],
  ];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const tx = x + dx;
  const ty = y + dy;

  if (!isEmpty(grid, tx, ty)) return;
  // Must be next to a surface
  if (
    !hasAnyNeighbor(grid, tx, ty, surfaces) &&
    !hasNeighbor(grid, tx, ty, "moss")
  )
    return;

  if (spawnAt(grid, tx, ty, "moss") && waterNearby > 0) {
    consumeWater(grid, x, y);
  }
}

// ===== Algae: grows inside water =====
function updateAlgae(grid: Grid, x: number, y: number): void {
  if (Math.random() > 0.015) return;

  // Algae spreads to water cells
  const dirs: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];
  const dir = dirs[Math.floor(Math.random() * dirs.length)];
  if (!dir) return;
  const [dx, dy] = dir;
  const cell = getCell(grid, x + dx, y + dy);
  if (cell?.element === "water") {
    const algae = createParticle("algae");
    algae.updated = true;
    setCell(grid, x + dx, y + dy, algae);
  }
}

// ===== Vine: creeps along surfaces =====
function updateVine(grid: Grid, x: number, y: number): void {
  const waterNearby = countMoisture(grid, x, y, 2);
  if (waterNearby === 0 && Math.random() > 0.001) return;
  if (Math.random() > 0.02) return;

  const surfaces = [
    "stone",
    "wood",
    "glass",
    "iron",
    "copper",
    "rust",
    "patina",
  ];
  const hasSurface = hasAnyNeighbor(grid, x, y, surfaces);
  if (!hasSurface && !hasNeighbor(grid, x, y, "vine")) return;

  // Vine prefers sideways and downward, hugging walls
  const dirs: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, 1],
    [-1, 1],
    [1, 1],
    [0, -1],
  ];
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
function updateFruit(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  // Fruit hangs on plants until it ripens (lifetime tracks ripeness)
  const attachedToPlant = hasAnyNeighbor(grid, x, y, [
    "leaf",
    "stem",
    "plant",
    "vine",
  ]);

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

  // On the ground: roll downhill briefly then decompose into seeds
  if (hasSolidBelow(grid, x, y)) {
    particle.lifetime++;

    // Roll downhill for the first 30 ticks (spreads fruit away from parent tree)
    if (particle.lifetime < 30) {
      const rollSide = randomBool() ? -1 : 1;
      if (
        isEmpty(grid, x + rollSide, y) &&
        isEmpty(grid, x + rollSide, y + 1)
      ) {
        tryMove(grid, x, y, x + rollSide, y + 1);
        return;
      }
    }

    // Decompose: multi-seed dispersal
    if (particle.lifetime > 60 && Math.random() < 0.03) {
      const roll = Math.random();
      if (roll < 0.5) {
        // Seed at position + scatter a second seed nearby
        const seed = createParticle("seed");
        seed.updated = true;
        setCell(grid, x, y, seed);
        const scatterSide = randomBool() ? -2 : 2;
        if (isEmpty(grid, x + scatterSide, y)) {
          spawnAt(grid, x + scatterSide, y, "seed");
        }
      } else if (roll < 0.8) {
        // Become compost (enriches soil) + spawn seed adjacent
        const compost = createParticle("compost");
        compost.updated = true;
        setCell(grid, x, y, compost);
        const side = randomBool() ? -1 : 1;
        if (isEmpty(grid, x + side, y)) {
          spawnAt(grid, x + side, y, "seed");
        }
      } else {
        // Just become a seed
        const seed = createParticle("seed");
        seed.updated = true;
        setCell(grid, x, y, seed);
      }
    }
  }

  // Fruit-heavy trees attract birds (spawn from the ecosystem)
  if (
    particle.lifetime > 30 &&
    countNearby(grid, x, y, "fruit", 6) >= 3 &&
    countNearby(grid, x, y, "bird", 15) < 2 &&
    Math.random() < 0.0003
  ) {
    if (isEmpty(grid, x, y - 1)) {
      spawnAt(grid, x, y - 1, "bird");
    }
  }
}

// ===== Soil: wet soil spontaneously sprouts life =====
function updateSoil(grid: Grid, x: number, y: number): void {
  const particle = getCell(grid, x, y);
  if (!particle) return;

  // Absorb water on contact: water nearby increases soil moisture
  const waterNearby = countNearby(grid, x, y, "water", 1);
  if (waterNearby > 0) {
    particle.lifetime = Math.min(particle.lifetime + 3, 300);
  }

  // Soil slowly dries out
  if (particle.lifetime > 0 && Math.random() < 0.02) {
    particle.lifetime--;
  }

  // Spread moisture to dry neighboring soil (capillary action)
  if (particle.lifetime > 50 && Math.random() < 0.03) {
    const dirs: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, 1],
      [0, -1],
    ];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    if (dir) {
      const neighbor = getCell(grid, x + dir[0], y + dir[1]);
      if (
        neighbor?.element === "soil" &&
        neighbor.lifetime < particle.lifetime - 20
      ) {
        neighbor.lifetime += 10;
        particle.lifetime -= 5;
      }
    }
  }

  // Soil evaporation: exposed wet soil releases steam during the day (water cycle)
  if (
    particle.lifetime > 30 &&
    currentDaylight > 0.3 &&
    Math.random() < 0.001
  ) {
    if (isEmpty(grid, x, y - 1)) {
      spawnAt(grid, x, y - 1, "steam");
      particle.lifetime -= 15;
    }
  }

  if (currentDaylight < 0.1) return;
  const moisture = countMoisture(grid, x, y, 2);
  if (moisture === 0 && particle.lifetime === 0) return;

  // Check cell above: must be empty or water (seeds push through water)
  const above = getCell(grid, x, y - 1);
  if (above && above.element !== "water") return;

  // Mushrooms: need nearby decay (ash, charcoal)
  const decay = ["ash", "charcoal"];
  if (
    hasAnyNeighbor(grid, x, y, decay) ||
    hasNeighbor(grid, x, y, "mushroom")
  ) {
    if (Math.random() < 0.0003) {
      const p = createParticle("mushroom");
      p.updated = true;
      setCell(grid, x, y - 1, p);
      return;
    }
  }

  // Spontaneous seed: life emerges from fertile wet soil
  // But not under existing canopy (don't grow new trees on top of old ones)
  if (Math.random() < 0.002 * currentDaylight) {
    const vegAbove = countNearbyAny(
      grid,
      x,
      y - 2,
      ["leaf", "stem", "plant", "flower"],
      3,
    );
    if (vegAbove < 2) {
      const seed = createParticle("seed");
      seed.updated = true;
      setCell(grid, x, y - 1, seed);
      return;
    }
  }

  // Worms emerge gradually in wet soil (population-limited)
  if (Math.random() < 0.0001) {
    const below = getCell(grid, x, y + 1);
    if (below && (below.element === "soil" || below.element === "sand")) {
      // Don't overpopulate: max 3 worms within radius 5
      if (countNearby(grid, x, y, "worm", 5) < 3) {
        const worm = createParticle("worm");
        worm.updated = true;
        setCell(grid, x, y, worm);
      }
    }
  }
}

// ===== Mushroom: grows on dead organic matter, spreads slowly in damp conditions =====
function updateMushroom(grid: Grid, x: number, y: number): void {
  const substrate = ["ash", "charcoal", "wood", "soil"];
  if (
    !hasAnyNeighbor(grid, x, y, substrate) &&
    !hasNeighbor(grid, x, y, "mushroom")
  )
    return;

  const waterNearby = countMoisture(grid, x, y, 3);
  if (waterNearby === 0 && Math.random() > 0.0005) return;
  if (Math.random() > 0.01) return;

  // Spread to adjacent cells on or near substrate
  const dirs: [number, number][] = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [-1, -1],
    [1, -1],
  ];
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
function updatePollen(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
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

  // Float with wind: biased in wind direction for long-range dispersal
  const drift = Math.random() < 0.7 ? currentWindDir : -currentWindDir;
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
function updateCompost(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
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

  // Worms can spawn in mature compost near soil (rare, population-limited)
  if (
    particle.lifetime > 80 &&
    hasNeighbor(grid, x, y, "soil") &&
    Math.random() < 0.0002
  ) {
    if (isEmpty(grid, x, y - 1) && countNearby(grid, x, y, "worm", 4) < 2) {
      spawnAt(grid, x, y - 1, "worm");
    }
  }
}

// ===== Worm: burrows through soil, enriches it, spawns from wet soil =====
// Realistic behavior: moisture-dependent survival, surface avoidance, gradual population
function updateWorm(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  const waterNearby = countMoisture(grid, x, y, 3);
  const underground = hasAnyNeighbor(grid, x, y, ["soil", "sand", "compost"]);
  const inOpenAir = !underground;

  // Moisture-dependent aging: worms breathe through skin, need moisture to survive
  if (waterNearby > 0 && !inOpenAir) {
    // Moist underground: barely age (can live for many days)
    if (Math.random() < 0.1) particle.lifetime--;
  } else if (waterNearby > 0 && inOpenAir) {
    // Surface but moist: moderate aging
    particle.lifetime -= 2;
  } else if (inOpenAir) {
    // Exposed on surface, dry: desiccate rapidly
    particle.lifetime -= 6;
  } else {
    // Underground but dry: slow drain
    particle.lifetime--;
  }

  // Feeding: worms eat compost and organic matter to restore lifetime
  if (Math.random() < 0.02) {
    const dirs: [number, number][] = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];
    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    if (dir) {
      const food = getCell(grid, x + dir[0], y + dir[1]);
      if (food?.element === "compost") {
        // Eat compost, convert to enriched soil, restore lifetime
        const soil = createParticle("soil");
        soil.lifetime = waterNearby > 0 ? 60 : 0; // pass on some moisture
        soil.updated = true;
        setCell(grid, x + dir[0], y + dir[1], soil);
        particle.lifetime = Math.min(particle.lifetime + 2000, 15000);
      }
    }
  }

  if (particle.lifetime <= 0) {
    // Worm dies, becomes compost
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  // If exposed on surface, urgently seek to burrow down
  if (inOpenAir) {
    const below = getCell(grid, x, y + 1);
    if (!below) {
      tryMove(grid, x, y, x, y + 1);
      return;
    }
    const burrowable = ["soil", "compost", "ash", "sand"];
    if (burrowable.includes(below.element)) {
      swapCells(grid, x, y, x, y + 1);
      const moved = getCell(grid, x, y + 1);
      if (moved) moved.updated = true;
      return;
    }
    // Try sideways to find ground
    const side = randomBool() ? -1 : 1;
    const sideCell = getCell(grid, x + side, y + 1);
    if (!sideCell) {
      tryMove(grid, x, y, x + side, y + 1);
    } else if (burrowable.includes(sideCell.element)) {
      swapCells(grid, x, y, x + side, y + 1);
      const moved = getCell(grid, x + side, y + 1);
      if (moved) moved.updated = true;
    }
    return;
  }

  // Underground burrowing movement
  const burrowable = ["soil", "compost", "ash", "sand"];
  const moveChance = waterNearby > 0 ? 0.25 : 0.15; // More active when moist

  if (Math.random() < moveChance) {
    // Bias movement toward water if nearby and dry
    let dirs: [number, number][];
    if (waterNearby === 0) {
      // Dry: prefer downward (toward water table)
      dirs = [
        [0, 1],
        [0, 1],
        [-1, 1],
        [1, 1],
        [-1, 0],
        [1, 0],
      ];
    } else {
      // Moist: move freely in all underground directions
      dirs = [
        [-1, 0],
        [1, 0],
        [0, 1],
        [0, -1],
        [-1, 1],
        [1, 1],
      ];
    }

    const dir = dirs[Math.floor(Math.random() * dirs.length)];
    if (!dir) return;
    const nx = x + dir[0];
    const ny = y + dir[1];
    const target = getCell(grid, nx, ny);
    if (target && burrowable.includes(target.element)) {
      swapCells(grid, x, y, nx, ny);
      const moved = getCell(grid, nx, ny);
      if (moved) moved.updated = true;

      // Enrichment: convert sand/ash/compost to soil as the worm passes
      const left = getCell(grid, x, y);
      if (
        left &&
        (left.element === "sand" ||
          left.element === "ash" ||
          left.element === "compost")
      ) {
        const soil = createParticle("soil");
        soil.updated = true;
        setCell(grid, x, y, soil);
      }
      return;
    }

    // If target is empty (cavity), fall into it
    if (!target) {
      tryMove(grid, x, y, nx, ny);
      return;
    }
  }

  // Gravity: fall if nothing below
  const below = getCell(grid, x, y + 1);
  if (!below) {
    tryMove(grid, x, y, x, y + 1);
  }
}

// ===== Bee: pollinates flowers, feeds on nectar, reproduces near hive-mates =====
function updateBee(grid: Grid, x: number, y: number, particle: Particle): void {
  // Aging: flower feeding slows aging, no flowers = faster drain
  const nearFlowers = countNearby(grid, x, y, "flower", 3);
  if (nearFlowers > 0) {
    // Near flowers: age very slowly (thriving)
    if (Math.random() < 0.15) particle.lifetime--;
  } else {
    // No flowers: age normally
    particle.lifetime--;
  }

  // Death: becomes compost (completing the cycle)
  if (particle.lifetime <= 0) {
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  // Rest at night: bees don't fly in the dark
  if (currentDaylight < 0.2) return;

  // --- Pollination: visit adjacent flowers ---
  if (hasNeighbor(grid, x, y, "flower")) {
    // Feed on nectar: restore lifetime
    particle.lifetime = Math.min(particle.lifetime + 5, 8000);

    // Pollinate: spread pollen to boost the ecosystem
    if (Math.random() < 0.02) {
      const pollenDirs: [number, number][] = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [0, -2],
        [-1, -2],
        [1, -2],
      ];
      const dir = pollenDirs[Math.floor(Math.random() * pollenDirs.length)];
      if (dir && isEmpty(grid, x + dir[0], y + dir[1])) {
        spawnAt(grid, x + dir[0], y + dir[1], "pollen");
      }
    }

    // Cross-pollinate: occasionally spawn a new flower near a different flower
    if (Math.random() < 0.003) {
      const flowerDirs: [number, number][] = [
        [-2, 0],
        [2, 0],
        [-1, -1],
        [1, -1],
        [0, -1],
      ];
      const fd = flowerDirs[Math.floor(Math.random() * flowerDirs.length)];
      if (
        fd &&
        isEmpty(grid, x + fd[0], y + fd[1]) &&
        hasAnyNeighbor(grid, x + fd[0], y + fd[1], ["leaf", "stem"])
      ) {
        spawnAt(grid, x + fd[0], y + fd[1], "flower");
      }
    }
  }

  // --- Reproduction: well-fed bees near other bees can spawn new bees ---
  if (particle.lifetime > 5000 && Math.random() < 0.0005) {
    const nearBees = countNearby(grid, x, y, "bee", 4);
    if (nearBees >= 1 && nearBees < 4) {
      // not too crowded
      const spawnDirs: [number, number][] = [
        [-1, -1],
        [0, -1],
        [1, -1],
        [-1, 0],
        [1, 0],
      ];
      const sd = spawnDirs[Math.floor(Math.random() * spawnDirs.length)];
      if (sd && isEmpty(grid, x + sd[0], y + sd[1])) {
        spawnAt(grid, x + sd[0], y + sd[1], "bee");
        particle.lifetime -= 2000; // reproduction costs energy
      }
    }
  }

  // --- Movement: calmer, purposeful flight ---
  if (Math.random() < 0.4) return; // don't move every tick

  // Search for flowers in a wide radius
  const flower = findNearest(grid, x, y, "flower", 15);
  if (flower) {
    // Fly toward the nearest flower
    const fdx = flower[0] > 0 ? 1 : flower[0] < 0 ? -1 : 0;
    const fdy = flower[1] > 0 ? 1 : flower[1] < 0 ? -1 : 0;
    // Bees fly diagonally toward flowers (more natural than straight lines)
    if (Math.random() < 0.6) {
      tryMove(grid, x, y, x + fdx, y + fdy);
    } else {
      // Slight zigzag
      tryMove(grid, x, y, x + fdx, y);
    }
  } else {
    // No flowers: wander looking for them (wider search pattern)
    const dx = Math.random() < 0.33 ? -1 : Math.random() < 0.5 ? 1 : 0;
    const dy = Math.random() < 0.4 ? -1 : Math.random() < 0.5 ? 1 : 0;
    tryMove(grid, x, y, x + dx, y + dy);
  }
}

// ===== Bird: flies between trees, eats fruit, drops seeds far away =====
// State: lifetime=age countdown, r=hunger(0-255), g=seeds carried(0-3), b=direction bit
function updateBird(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  // Aging: near fruit trees = slower aging
  const nearFruit = countNearby(grid, x, y, "fruit", 4);
  if (nearFruit > 0) {
    if (Math.random() < 0.2) particle.lifetime--;
  } else {
    particle.lifetime--;
  }

  // Hunger drain
  if (particle.lifetime % 20 === 0 && particle.r > 0) particle.r--;

  // Death: become compost
  if (particle.lifetime <= 0 || particle.r === 0) {
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  // Rest at night (perch in place)
  if (currentDaylight < 0.2) return;

  // --- Feeding: eat adjacent fruit ---
  if (particle.r < 180) {
    const dirs8: [number, number][] = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ];
    for (const [dx, dy] of dirs8) {
      const cell = getCell(grid, x + dx, y + dy);
      if (cell?.element === "fruit") {
        setCell(grid, x + dx, y + dy, null);
        particle.r = Math.min(255, particle.r + 80);
        particle.g = Math.min(3, particle.g + 1); // carry a seed
        return;
      }
    }
  }

  // --- Seed dropping: deposit seeds far from parent tree ---
  if (particle.g > 0 && Math.random() < 0.004) {
    // Drop seed below
    if (isEmpty(grid, x, y + 1)) {
      spawnAt(grid, x, y + 1, "seed");
      particle.g--;
      // Bird droppings fertilize: also spawn compost nearby
      if (isEmpty(grid, x + 1, y + 1)) {
        spawnAt(grid, x + 1, y + 1, "compost");
      } else if (isEmpty(grid, x - 1, y + 1)) {
        spawnAt(grid, x - 1, y + 1, "compost");
      }
    }
  }

  // --- Reproduction: well-fed birds near other birds ---
  if (particle.r > 200 && particle.lifetime > 6000 && Math.random() < 0.0003) {
    const nearBirds = countNearby(grid, x, y, "bird", 8);
    if (nearBirds >= 1 && nearBirds < 3) {
      if (isEmpty(grid, x, y - 1)) {
        spawnAt(grid, x, y - 1, "bird");
        particle.r -= 80;
        particle.lifetime -= 3000;
      }
    }
  }

  // --- Flight ---
  if (Math.random() < 0.4) return; // don't move every tick

  // Seek fruit if hungry
  if (particle.r < 120) {
    const fruit = findNearest(grid, x, y, "fruit", 15);
    if (fruit) {
      const fdx = fruit[0] > 0 ? 1 : fruit[0] < 0 ? -1 : 0;
      const fdy = fruit[1] > 0 ? 1 : fruit[1] < 0 ? -1 : 0;
      tryMove(grid, x, y, x + fdx, y + fdy);
      return;
    }
  }

  // Wander with wind bias and horizontal coverage
  const dir = (particle.b & 0x01) === 0 ? -1 : 1;
  const roll = Math.random();
  if (roll < 0.5) {
    // Fly forward with wind
    const windBias = Math.random() < 0.3 ? currentWindDir : dir;
    tryMove(grid, x, y, x + windBias, y);
  } else if (roll < 0.7) {
    // Fly diagonally up
    tryMove(grid, x, y, x + dir, y - 1);
  } else if (roll < 0.85) {
    // Descend
    tryMove(grid, x, y, x + dir, y + 1);
  } else {
    // Change direction
    particle.b = particle.b ^ 0x01;
  }
}

// ===== Human: walks, forages, builds, socializes, reproduces =====
// State encoding: r=hunger(0-255), g=thirst(0-255), b=packed bits, lifetime=age
// b bits: 0-1=direction, 2=carrying, 3=material(0=wood,1=stone), 4-6=activity, 7=sex

function getHumanDir(p: Particle): number {
  return p.b & 0x01;
} // 0=left, 1=right
function setHumanDir(p: Particle, d: number) {
  p.b = (p.b & ~0x01) | (d & 0x01);
}
function isCarrying(p: Particle): boolean {
  return (p.b & 0x04) !== 0;
}
function setCarrying(p: Particle, c: boolean, isStone: boolean) {
  p.b = c ? p.b | 0x04 | (isStone ? 0x08 : 0) : p.b & ~0x0c;
}
function getCarriedMaterial(p: Particle): "stone" | "wood" {
  return p.b & 0x08 ? "stone" : "wood";
}
function getSex(p: Particle): number {
  return (p.b >> 7) & 0x01;
}

/** Elements that block human movement (solid ground and heavy structures) */
const HUMAN_BLOCKING = new Set([
  "stone",
  "iron",
  "copper",
  "gold",
  "glass",
  "ice",
  "sand",
  "soil",
  "salt",
  "tnt",
]);

function canHumanPass(grid: Grid, px: number, py: number): boolean {
  if (isEmpty(grid, px, py)) return true;
  const cell = getCell(grid, px, py);
  if (!cell) return false;
  // Block on solid terrain; pass through everything else (vegetation, wood, stems, liquids, etc.)
  return !HUMAN_BLOCKING.has(cell.element);
}

function tryMoveHuman(
  grid: Grid,
  x: number,
  y: number,
  nx: number,
  ny: number,
): boolean {
  // Direct horizontal move (into empty or passable vegetation with ground below)
  if (canHumanPass(grid, nx, ny) && hasSolidBelow(grid, nx, ny)) {
    swapCells(grid, x, y, nx, ny);
    const moved = getCell(grid, nx, ny);
    if (moved) moved.updated = true;
    return true;
  }
  // Step up 1 block (climbing) - target blocked but above it is passable
  if (
    !canHumanPass(grid, nx, ny) &&
    canHumanPass(grid, nx, ny - 1) &&
    canHumanPass(grid, x, y - 1)
  ) {
    swapCells(grid, x, y, nx, ny - 1);
    const moved = getCell(grid, nx, ny - 1);
    if (moved) moved.updated = true;
    return true;
  }
  return false;
}

/** Find the nearest cell of a given element within a radius. Returns [dx, dy] or null. */
function findNearest(
  grid: Grid,
  x: number,
  y: number,
  element: string,
  radius: number,
): [number, number] | null {
  let bestDist = Infinity;
  let best: [number, number] | null = null;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cell = getCell(grid, x + dx, y + dy);
      if (cell?.element === element) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = [dx, dy];
        }
      }
    }
  }
  return best;
}

function findNearestAny(
  grid: Grid,
  x: number,
  y: number,
  elements: string[],
  radius: number,
): [number, number, string] | null {
  let bestDist = Infinity;
  let best: [number, number, string] | null = null;
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      if (dx === 0 && dy === 0) continue;
      const cell = getCell(grid, x + dx, y + dy);
      if (cell && elements.includes(cell.element)) {
        const dist = Math.abs(dx) + Math.abs(dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = [dx, dy, cell.element];
        }
      }
    }
  }
  return best;
}

function updateHuman(
  grid: Grid,
  x: number,
  y: number,
  particle: Particle,
): void {
  particle.lifetime++; // age

  // --- Metabolism (slow: one full day ~7200 ticks, drain ~1 per 35/25 ticks) ---
  if (particle.lifetime % 35 === 0 && particle.r > 0) particle.r--; // hunger drain
  if (particle.lifetime % 25 === 0 && particle.g > 0) particle.g--; // thirst drain

  // --- Death (old age ~5 full days) ---
  if (particle.r === 0 || particle.g === 0 || particle.lifetime > 30000) {
    const compost = createParticle("compost");
    compost.updated = true;
    setCell(grid, x, y, compost);
    return;
  }

  // --- Gravity ---
  if (!hasSolidBelow(grid, x, y)) {
    if (tryMove(grid, x, y, x, y + 1)) return;
    const side = randomBool() ? -1 : 1;
    if (tryMove(grid, x, y, x + side, y + 1)) return;
    return;
  }

  // --- Rest at night ---
  if (currentDaylight < 0.2) return;

  // --- Flee from danger (highest priority) ---
  const dangers = ["fire", "lava", "acid"];
  const danger = findNearestAny(grid, x, y, dangers, 3);
  if (danger) {
    const fleeDir =
      danger[0] > 0 ? -1 : danger[0] < 0 ? 1 : randomBool() ? -1 : 1;
    if (tryMoveHuman(grid, x, y, x + fleeDir, y)) return;
    tryMoveHuman(grid, x, y, x + fleeDir, y - 1);
    return;
  }

  const dirs8: [number, number][] = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [-1, 0],
    [1, 0],
    [-1, 1],
    [0, 1],
    [1, 1],
  ];
  const hungry = particle.r < 150;
  const thirsty = particle.g < 150;
  const starving = particle.r < 60;
  const dehydrated = particle.g < 60;

  // --- Drink: from adjacent water or wet soil (opportunistic, always) ---
  if (thirsty) {
    for (const [dx, dy] of dirs8) {
      const cell = getCell(grid, x + dx, y + dy);
      if (cell?.element === "water") {
        setCell(grid, x + dx, y + dy, null);
        particle.g = Math.min(255, particle.g + 100);
        return;
      }
    }
    // Drink from wet soil underfoot
    for (const [dx, dy] of dirs8) {
      const cell = getCell(grid, x + dx, y + dy);
      if (cell?.element === "soil" && cell.lifetime > 40) {
        cell.lifetime -= 40;
        particle.g = Math.min(255, particle.g + 50);
        return;
      }
    }
  }

  // --- Eat: grab adjacent food opportunistically ---
  if (hungry) {
    for (const [dx, dy] of dirs8) {
      const cell = getCell(grid, x + dx, y + dy);
      if (cell && (cell.element === "fruit" || cell.element === "mushroom")) {
        const nutrition = cell.element === "fruit" ? 90 : 60;
        setCell(grid, x + dx, y + dy, null);
        particle.r = Math.min(255, particle.r + nutrition);
        return;
      }
    }
  }

  // --- Forage leaves/grass when desperate ---
  if (starving && Math.random() < 0.1) {
    for (const [dx, dy] of dirs8) {
      const cell = getCell(grid, x + dx, y + dy);
      if (cell && (cell.element === "leaf" || cell.element === "grass")) {
        particle.r = Math.min(255, particle.r + 15);
        if (Math.random() < 0.3) setCell(grid, x + dx, y + dy, null);
        return;
      }
    }
  }

  // --- Seek water (walk toward it when dehydrated) ---
  if (dehydrated) {
    const water = findNearest(grid, x, y, "water", 15);
    if (water) {
      const moveDir = water[0] > 0 ? 1 : water[0] < 0 ? -1 : 0;
      tryMoveHuman(grid, x, y, x + moveDir, y);
      return;
    }
  }

  // --- Seek food (walk toward it when starving) ---
  if (starving) {
    const food = findNearestAny(grid, x, y, ["fruit", "mushroom"], 15);
    if (food) {
      const moveDir = food[0] > 0 ? 1 : food[0] < 0 ? -1 : 0;
      tryMoveHuman(grid, x, y, x + moveDir, y);
      return;
    }
  }

  // --- Reproduction (well-fed, near opposite sex, ~once per day) ---
  if (
    particle.r > 170 &&
    particle.g > 170 &&
    particle.lifetime > 5000 &&
    particle.lifetime % 3000 < 3
  ) {
    for (const [dx, dy] of dirs8) {
      const neighbor = getCell(grid, x + dx, y + dy);
      if (
        neighbor?.element === "human" &&
        getSex(neighbor) !== getSex(particle)
      ) {
        if (neighbor.r > 120 && neighbor.g > 120) {
          for (const [bx, by] of dirs8) {
            const tx = x + bx;
            const ty = y + by;
            if (canHumanPass(grid, tx, ty) && hasSolidBelow(grid, tx, ty)) {
              spawnAt(grid, tx, ty, "human");
              particle.r -= 50;
              particle.g -= 40;
              break;
            }
          }
          break;
        }
      }
    }
  }

  // --- Plant seeds near water (farming, when well-fed) ---
  if (particle.r > 170 && Math.random() < 0.005) {
    const waterNear = countMoisture(grid, x, y, 3);
    if (waterNear > 0) {
      const plantSpots: [number, number][] = [
        [1, 0],
        [-1, 0],
        [2, 0],
        [-2, 0],
      ];
      for (const [sx, sy] of plantSpots) {
        if (
          isEmpty(grid, x + sx, y + sy) &&
          hasSolidBelow(grid, x + sx, y + sy)
        ) {
          spawnAt(grid, x + sx, y + sy, "seed");
          return;
        }
      }
    }
  }

  // --- Building: gather materials and construct houses on open ground ---
  const nearHumans = countNearby(grid, x, y, "human", 5);

  if (isCarrying(particle)) {
    // Find a good build site: on solid ground, not inside tree canopy
    const inCanopy =
      countNearbyAny(grid, x, y, ["leaf", "stem", "flower"], 2) > 3;

    // If in the forest, walk toward open ground before placing
    if (inCanopy) {
      const dir = getHumanDir(particle) === 0 ? -1 : 1;
      tryMoveHuman(grid, x, y, x + dir, y);
      return;
    }

    // Place next to existing builds (extend the structure)
    const existingBuild = findNearestAny(grid, x, y, ["wood", "stone"], 4);
    if (existingBuild) {
      // Walk toward the build site if not adjacent
      if (Math.abs(existingBuild[0]) > 2 || Math.abs(existingBuild[1]) > 2) {
        tryMoveHuman(grid, x, y, x + (existingBuild[0] > 0 ? 1 : -1), y);
        return;
      }
      // Place: walls beside existing builds, roofs on top
      const buildSpots: [number, number][] = [
        [existingBuild[0] + 1, existingBuild[1]],
        [existingBuild[0] - 1, existingBuild[1]], // walls
        [existingBuild[0], existingBuild[1] - 1], // roof
        [existingBuild[0] + 1, existingBuild[1] - 1],
        [existingBuild[0] - 1, existingBuild[1] - 1], // upper walls
      ];
      for (const [bx, by] of buildSpots) {
        const tx = x + bx;
        const ty = y + by;
        if (isEmpty(grid, tx, ty)) {
          spawnAt(grid, tx, ty, getCarriedMaterial(particle));
          setCarrying(particle, false, false);
          return;
        }
      }
    }

    // No existing builds: start a new foundation on the ground
    if (hasSolidBelow(grid, x, y)) {
      // Place first block to the side at ground level
      const side = getHumanDir(particle) === 0 ? -1 : 1;
      const spots: [number, number][] = [
        [side, 0],
        [side, -1],
        [-side, 0],
      ];
      for (const [sx, sy] of spots) {
        if (
          isEmpty(grid, x + sx, y + sy) &&
          (sy === 0 || hasSolidBelow(grid, x + sx, y + sy))
        ) {
          spawnAt(grid, x + sx, y + sy, getCarriedMaterial(particle));
          setCarrying(particle, false, false);
          return;
        }
      }
    }
  }

  // Gather materials: chop or collect (community activity, 2+ humans)
  if (!isCarrying(particle) && nearHumans >= 2 && Math.random() < 0.02) {
    // Prefer loose wood/stone first
    const loose = findNearestAny(grid, x, y, ["wood", "stone"], 4);
    if (loose && Math.abs(loose[0]) <= 1 && Math.abs(loose[1]) <= 1) {
      setCell(grid, x + loose[0], y + loose[1], null);
      setCarrying(particle, true, loose[2] === "stone");
      return;
    }
    // Chop wood from a tree (only if plenty of trees)
    if (countNearby(grid, x, y, "stem", 6) > 4) {
      const stem = findNearest(grid, x, y, "stem", 3);
      if (stem && Math.abs(stem[0]) <= 1 && Math.abs(stem[1]) <= 1) {
        setCell(grid, x + stem[0], y + stem[1], null);
        setCarrying(particle, true, false);
        return;
      }
      if (stem) {
        tryMoveHuman(grid, x, y, x + (stem[0] > 0 ? 1 : -1), y);
        return;
      }
    }
  }

  // --- Movement: settle, navigate, or travel ---
  const nearResources = countNearbyAny(
    grid,
    x,
    y,
    ["fruit", "mushroom", "water", "stem", "leaf"],
    5,
  );
  const inGoodArea = nearResources > 5 && !hungry && !thirsty;

  if (inGoodArea) {
    // Settled: relaxed strolls and socializing
    if (Math.random() < 0.12) {
      const other = findNearest(grid, x, y, "human", 6);
      if (other && Math.abs(other[0]) > 2 && Math.random() < 0.3) {
        tryMoveHuman(grid, x, y, x + (other[0] > 0 ? 1 : -1), y);
      } else {
        const dir = getHumanDir(particle) === 0 ? -1 : 1;
        if (Math.random() < 0.15) setHumanDir(particle, dir === -1 ? 1 : 0);
        tryMoveHuman(grid, x, y, x + dir, y);
      }
    }
  } else {
    // Not in a good area: scan wide for resources, then travel determinedly
    // Scan a large area for anything worth walking toward
    if (particle.lifetime % 60 === 0) {
      // Only scan periodically (every 60 ticks) to save perf, but scan wide
      const goal = findNearestAny(
        grid,
        x,
        y,
        ["stem", "water", "fruit", "flower"],
        40,
      );
      if (goal) {
        // Lock direction toward the goal
        setHumanDir(particle, goal[0] > 0 ? 1 : 0);
      }
    }

    // Walk determinedly: only turn at walls, never randomly
    if (Math.random() < 0.45) {
      const dir = getHumanDir(particle) === 0 ? -1 : 1;
      if (!tryMoveHuman(grid, x, y, x + dir, y)) {
        // Hit a wall: try climbing first
        if (!tryMoveHuman(grid, x, y, x + dir, y - 1)) {
          // Can't climb: turn around
          setHumanDir(particle, dir === -1 ? 1 : 0);
        }
      }
    }
  }
}

function updateFuse(grid: Grid, x: number, y: number): void {
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
        } else if (
          ELEMENTS[cell.element].behavior !== "static" ||
          cell.element === "stone"
        ) {
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

function updateExplosive(grid: Grid, x: number, y: number): void {
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

  const dirs: [number, number][] = [
    [x, y - 1],
    [x, y + 1],
    [x - 1, y],
    [x + 1, y],
  ];

  for (const [nx, ny] of dirs) {
    const neighbor = getCell(grid, nx, ny);
    if (!neighbor) continue;

    const key = `${particle.element}|${neighbor.element}`;
    const rules = REACTION_MAP.get(key);
    if (!rules) continue;

    for (const rule of rules) {
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

export function tickSimulation(grid: Grid, tick: number, daylight = 1): void {
  currentDaylight = daylight;
  currentWindDir = Math.sin(tick * 0.008) > 0 ? 1 : -1;

  // Reset updated flags
  for (const cell of grid.cells) {
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
      if (
        def.lifetime &&
        def.behavior === "gas" &&
        particle.element !== "pollen"
      ) {
        particle.lifetime--;
        if (particle.lifetime <= 0) {
          // Steam condenses back into water instead of vanishing
          if (particle.element === "steam") {
            const water = createParticle("water");
            water.updated = true;
            setCell(grid, x, y, water);
          } else {
            setCell(grid, x, y, null);
          }
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
          } else if (
            particle.element === "ash" ||
            particle.element === "charcoal"
          ) {
            updatePowder(grid, x, y);
            // Wet ash/charcoal decomposes into soil
            if (
              countNearby(grid, x, y, "water", 2) > 0 &&
              Math.random() < 0.015
            ) {
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
          if (particle.element === "water") {
            // Canopy drip: water percolates through leaves, flowers, grass
            const vegetation = ["leaf", "flower", "grass", "moss", "vine"];
            const below = getCell(grid, x, y + 1);
            if (
              below &&
              vegetation.includes(below.element) &&
              Math.random() < 0.3
            ) {
              // Find the first non-vegetation cell below (drip through canopy)
              let dripY = y + 1;
              while (dripY < y + 20) {
                const cell = getCell(grid, x, dripY);
                if (!cell) {
                  // Empty space below canopy: move water here
                  swapCells(grid, x, y, x, dripY);
                  const moved = getCell(grid, x, dripY);
                  if (moved) moved.updated = true;
                  break;
                }
                if (!vegetation.includes(cell.element)) {
                  // Hit something solid (stem, soil): place water just above
                  if (dripY > y + 1 && isEmpty(grid, x, dripY - 1)) {
                    swapCells(grid, x, y, x, dripY - 1);
                    const moved = getCell(grid, x, dripY - 1);
                    if (moved) moved.updated = true;
                  }
                  break;
                }
                dripY++;
              }
              if (!getCell(grid, x, y)) break;
            }
            // Soil absorption: water soaks into adjacent soil, increasing its moisture
            if (Math.random() < 0.08) {
              const absDirs: [number, number][] = [
                [0, 1],
                [-1, 0],
                [1, 0],
                [0, -1],
                [-1, 1],
                [1, 1],
              ];
              for (const [adx, ady] of absDirs) {
                const neighbor = getCell(grid, x + adx, y + ady);
                if (
                  neighbor &&
                  (neighbor.element === "soil" ||
                    neighbor.element === "compost" ||
                    neighbor.element === "ash")
                ) {
                  if (neighbor.element === "soil") {
                    neighbor.lifetime = Math.min(neighbor.lifetime + 60, 300);
                  }
                  setCell(grid, x, y, null);
                  break;
                }
              }
              if (!getCell(grid, x, y)) break;
            }
            // Erosion: flowing water occasionally dislodges soil particles
            if (Math.random() < 0.002) {
              const erosionDirs: [number, number][] = [
                [-1, 1],
                [1, 1],
                [0, 1],
              ];
              const ed =
                erosionDirs[Math.floor(Math.random() * erosionDirs.length)];
              if (ed) {
                const target = getCell(grid, x + ed[0], y + ed[1]);
                if (
                  target?.element === "soil" &&
                  isEmpty(grid, x + ed[0], y + ed[1] - 1)
                ) {
                  swapCells(
                    grid,
                    x + ed[0],
                    y + ed[1],
                    x + ed[0],
                    y + ed[1] - 1,
                  );
                }
              }
            }
            // Solar evaporation: exposed water slowly becomes steam during the day
            if (currentDaylight > 0.3) {
              const exposed = isEmpty(grid, x, y - 1);
              if (exposed && Math.random() < 0.0015 * currentDaylight) {
                const steam = createParticle("steam");
                steam.updated = true;
                setCell(grid, x, y, steam);
              }
            }
          }
          break;
        case "gas":
          if (particle.element === "pollen") {
            updatePollen(grid, x, y, particle);
          } else if (particle.element === "steam") {
            updateGas(grid, x, y);
            // Early condensation: steam near top of grid, near cold surfaces, or at night
            const nearTop = y < grid.height * 0.15;
            const nearCold = hasAnyNeighbor(grid, x, y, [
              "stone",
              "glass",
              "iron",
              "copper",
            ]);
            const nightCool = currentDaylight < 0.3;
            let condensChance = 0.002; // base
            if (nearTop) condensChance += 0.02;
            if (nearCold) condensChance += 0.05;
            if (nightCool) condensChance += 0.01;
            if (Math.random() < condensChance) {
              const water = createParticle("water");
              water.updated = true;
              setCell(grid, x, y, water);
            }
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
          updateVine(grid, x, y);
          break;
        case "fuse":
          updateFuse(grid, x, y);
          break;
        case "explosive":
          updateExplosive(grid, x, y);
          break;
        case "critter":
          if (particle.element === "worm") {
            updateWorm(grid, x, y, particle);
          } else if (particle.element === "bee") {
            updateBee(grid, x, y, particle);
          } else if (particle.element === "human") {
            updateHuman(grid, x, y, particle);
          } else if (particle.element === "bird") {
            updateBird(grid, x, y, particle);
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
