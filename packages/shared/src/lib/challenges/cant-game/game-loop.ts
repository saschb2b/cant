import type { BaseChallenge } from "../../game/types";

export const gameLoopChallenges: BaseChallenge[] = [
  {
    id: "loop-001",
    category: "game-loop",
    difficulty: "easy",
    title: "Timestep strategy",
    prompt: "Which game loop handles frame rate variation more reliably?",
    content: {
      type: "visual",
      left: { componentId: "TimestepVariable" },
      right: { componentId: "TimestepFixed" },
    },

    correctSide: "right",
    explanationCorrect:
      "A fixed timestep decouples simulation from frame rate. Physics, AI, and gameplay logic receive the same delta every tick, making behavior deterministic and reproducible regardless of whether the game runs at 30 or 144 FPS. The accumulator pattern processes multiple fixed steps per frame when the machine is slow and skips none when it is fast.",
    explanationWrong:
      "Passing the raw frame delta directly to update() ties game behavior to frame rate. At 30 FPS the delta is twice as large as at 60 FPS, which can cause tunneling in physics, inconsistent jump heights, and difficulty spikes on slower hardware. It also makes bugs nearly impossible to reproduce.",
    sourceUrl: "https://gafferongames.com/post/fix_your_timestep/",
    sourceLabel: "Gaffer On Games: Fix Your Timestep!",
  },
  {
    id: "loop-002",
    category: "game-loop",
    difficulty: "medium",
    title: "Entity architecture",
    prompt:
      "Which approach to entity design scales better as complexity grows?",
    content: {
      type: "code",

      left: `class Entity {
  x = 0; y = 0;
  health = 100;
  sprite: Sprite;

  update(dt: number) { /* ... */ }
  render(ctx: CanvasRenderingContext2D) { /* ... */ }
}

class Enemy extends Entity {
  ai: EnemyAI;
  update(dt: number) {
    super.update(dt);
    this.ai.think(dt);
  }
}

class FlyingEnemy extends Enemy {
  altitude = 0;
  update(dt: number) {
    super.update(dt);
    this.altitude += Math.sin(Date.now()) * dt;
  }
}`,

      right: `// Components are plain data
interface Position { x: number; y: number }
interface Health { current: number; max: number }
interface Velocity { vx: number; vy: number }
interface Sprite { texture: string; frame: number }

// Systems operate on components
function movementSystem(
  dt: number,
  entities: [Position, Velocity][],
) {
  for (const [pos, vel] of entities) {
    pos.x += vel.vx * dt;
    pos.y += vel.vy * dt;
  }
}

function renderSystem(
  ctx: CanvasRenderingContext2D,
  entities: [Position, Sprite][],
) {
  for (const [pos, sprite] of entities) {
    draw(ctx, sprite, pos);
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Entity Component System (ECS) separates data (components) from behavior (systems). Adding a new capability means attaching a component, not creating a new subclass. Systems process all entities with a given component set, which keeps logic flat, cache-friendly, and easy to compose. A flying enemy is just an entity with Position, Velocity, and Hover components.",
    explanationWrong:
      "Deep inheritance hierarchies couple data and behavior tightly. Adding a FlyingEnemy that also needs networking means choosing between duplicating code or creating fragile diamond-shaped hierarchies. The deeper the tree, the harder it is to override behavior without breaking parent assumptions, and the more likely you are to pull in unused state.",
    sourceUrl:
      "https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/understanding-component-entity-systems-r3013/",
    sourceLabel: "GameDev.net: Understanding ECS",
  },
  {
    id: "loop-003",
    category: "game-loop",
    difficulty: "medium",
    title: "Object lifecycle",
    prompt:
      "Which approach to creating and destroying game objects performs better at scale?",
    content: {
      type: "code",

      left: `function spawnBullet(x: number, y: number) {
  const bullet = new Bullet(x, y);
  bullets.push(bullet);
}

function update(dt: number) {
  for (const bullet of bullets) {
    bullet.update(dt);
  }
  // Remove dead bullets, creating garbage
  bullets = bullets.filter((b) => b.alive);
}`,

      right: `const pool: Bullet[] = [];
let activeCount = 0;

function spawnBullet(x: number, y: number) {
  let bullet: Bullet;
  if (activeCount < pool.length) {
    bullet = pool[activeCount];
    bullet.reset(x, y);
  } else {
    bullet = new Bullet(x, y);
    pool.push(bullet);
  }
  activeCount++;
}

function update(dt: number) {
  for (let i = 0; i < activeCount; i++) {
    pool[i].update(dt);
    if (!pool[i].alive) {
      // Swap with last active
      [pool[i], pool[activeCount - 1]] =
        [pool[activeCount - 1], pool[i]];
      activeCount--;
      i--;
    }
  }
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Object pooling pre-allocates and recycles objects instead of creating and discarding them every frame. In a bullet-hell scenario with hundreds of projectiles spawning per second, pooling avoids garbage collection pauses that cause visible frame stutters. The swap-with-last trick keeps active objects contiguous for cache-friendly iteration.",
    explanationWrong:
      "Allocating a new object per spawn and filtering the array every frame generates garbage that the GC must eventually collect. In JavaScript and similar managed runtimes, GC pauses are unpredictable and can cause frame drops at the worst possible moment. The filter() call also allocates a new array every frame.",
    sourceUrl: "https://gameprogrammingpatterns.com/object-pool.html",
    sourceLabel: "Game Programming Patterns: Object Pool",
  },
  {
    id: "loop-004",
    category: "game-loop",
    difficulty: "easy",
    title: "Camera follow strategy",
    prompt: "Which camera behavior feels smoother during gameplay?",
    content: {
      type: "visual",
      left: { componentId: "CameraSnap" },
      right: { componentId: "CameraSmooth" },
    },

    correctSide: "right",
    explanationCorrect:
      "A dampened camera (lerping toward the target each frame) creates smooth, natural-feeling movement. The slight delay as the character drifts off-center during direction changes gives the player a sense of momentum and makes the world feel alive. Most 2D and 3D games use some form of smoothed follow, often with configurable lookahead and deadzone parameters.",
    explanationWrong:
      "Snapping the camera to the player every frame keeps the character pixel-perfect centered, but the entire world jerks around with every movement change. This is especially noticeable on direction reversals and during fast movement. The rigid lock makes the scene feel mechanical and can cause motion discomfort in some players.",
    sourceUrl:
      "https://www.gamedeveloper.com/design/scroll-back-the-theory-and-practice-of-cameras-in-side-scrollers",
    sourceLabel: "Game Developer: Cameras in Side-Scrollers",
  },
];
