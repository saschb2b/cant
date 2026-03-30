import type { Challenge } from "../types";

export const physicsChallenges: Challenge[] = [
  {
    id: "phys-001",
    category: "physics",
    difficulty: "easy",
    title: "Collision check strategy",
    prompt:
      "Which collision detection approach scales better with many entities?",
    content: {
      type: "code",

      left: `// Check every pair of entities
function checkCollisions(entities: Entity[]) {
  for (let i = 0; i < entities.length; i++) {
    for (let j = i + 1; j < entities.length; j++) {
      if (intersects(entities[i], entities[j])) {
        resolve(entities[i], entities[j]);
      }
    }
  }
}
// 1000 entities = 499,500 checks per frame`,

      right: `// Spatial hash: only check nearby entities
class SpatialHash {
  private cells = new Map<string, Entity[]>();
  private cellSize: number;

  constructor(cellSize: number) {
    this.cellSize = cellSize;
  }

  insert(entity: Entity) {
    const key = this.key(entity.x, entity.y);
    const cell = this.cells.get(key) ?? [];
    cell.push(entity);
    this.cells.set(key, cell);
  }

  query(entity: Entity): Entity[] {
    const nearby: Entity[] = [];
    // Check 3x3 neighborhood
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        const key = this.key(
          entity.x + dx * this.cellSize,
          entity.y + dy * this.cellSize,
        );
        nearby.push(...(this.cells.get(key) ?? []));
      }
    }
    return nearby;
  }

  private key(x: number, y: number): string {
    const cx = Math.floor(x / this.cellSize);
    const cy = Math.floor(y / this.cellSize);
    return cx + "," + cy;
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "A spatial hash divides the world into a grid and only checks entities in the same or neighboring cells. For uniformly distributed entities the check count drops from O(n^2) to roughly O(n). Rebuilding the hash each frame is cheap compared to the quadratic comparison cost, and the cell size can be tuned to match your typical entity size.",
    explanationWrong:
      "Brute-force pairwise checks are O(n^2). At 100 entities you do ~5,000 checks per frame, which is fine. At 1,000 entities it is ~500,000, which is not. Most of those checks are between entities on opposite sides of the world that could never collide. Any spatial data structure eliminates the vast majority of this wasted work.",
    sourceUrl:
      "https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/spatial-hashing-r2697/",
    sourceLabel: "GameDev.net: Spatial Hashing",
  },
  {
    id: "phys-002",
    category: "physics",
    difficulty: "medium",
    title: "Fast object collision",
    prompt:
      "Which collision detection handles fast-moving objects more reliably?",
    content: {
      type: "code",

      left: `// Discrete: test position each frame
function update(bullet: Circle, wall: AABB, dt: number) {
  bullet.x += bullet.vx * dt;
  bullet.y += bullet.vy * dt;

  if (overlaps(bullet, wall)) {
    // Bullet already inside the wall
    resolve(bullet, wall);
  }
}
// A fast bullet can skip over a thin wall entirely`,

      right: `// Continuous: sweep the path between frames
function update(bullet: Circle, wall: AABB, dt: number) {
  const dx = bullet.vx * dt;
  const dy = bullet.vy * dt;

  const hit = sweepCircleAABB(bullet, dx, dy, wall);

  if (hit) {
    // Move to exact contact point
    bullet.x += dx * hit.t;
    bullet.y += dy * hit.t;
    reflect(bullet, hit.normal);
  } else {
    bullet.x += dx;
    bullet.y += dy;
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Continuous collision detection (CCD) sweeps the shape along its trajectory and finds the earliest contact point. This prevents tunneling, where a fast-moving object passes through a thin wall in a single frame because neither the start nor end position overlaps. The exact contact time and normal allow precise resolution.",
    explanationWrong:
      "Discrete collision only tests the object's position at the end of each frame. If a bullet moves 500 pixels per frame and a wall is 10 pixels thick, the bullet can teleport through without ever overlapping. Increasing the frame rate or capping velocity are workarounds, not solutions, and both break down in edge cases.",
    sourceUrl:
      "https://www.toptal.com/game/video-game-physics-part-ii-collision-detection-for-solid-objects",
    sourceLabel: "Toptal: Game Physics, Collision Detection",
  },
];
