import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Core architecture
  "game-loop",
  "state",
  "input",
  // Simulation
  "physics",
  "ai",
  // Graphics
  "rendering",
  "shaders",
  // Multiplayer
  "netcode",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "game-loop": "Game Loop",
  state: "State Management",
  input: "Input Handling",
  physics: "Physics & Collision",
  ai: "Game AI",
  rendering: "Rendering",
  shaders: "Shaders",
  netcode: "Netcode",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Core Architecture",
    categories: ["game-loop", "state", "input"],
  },
  {
    label: "Simulation",
    categories: ["physics", "ai"],
  },
  {
    label: "Graphics",
    categories: ["rendering", "shaders"],
  },
  {
    label: "Multiplayer",
    categories: ["netcode"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "game-loop",
  "state",
  "input",
  "physics",
  "rendering",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "game-loop":
    "Timesteps, update ordering, ECS vs inheritance, and object pooling. You'll hit this when physics breaks at low FPS, entities interact in unpredictable order, or garbage collection causes frame drops.",
  state:
    "Finite state machines, scene transitions, save systems, and entity lifecycle. You'll hit this when adding a new enemy behavior breaks three others, or when your pause menu doesn't actually pause everything.",
  input:
    "Input buffering, dead zones, action mapping, and frame-independent input. You'll hit this when jumps feel unresponsive, analog sticks drift, or rebinding keys requires a code change.",
  physics:
    "Collision detection, spatial partitioning, fixed timesteps, and continuous collision. You'll hit this when bullets pass through walls, collision checks tank your framerate, or physics behaves differently on fast machines.",
  ai: "Behavior trees, finite state machines, pathfinding, and steering behaviors. You'll hit this when enemies get stuck on corners, AI decisions feel robotic, or adding a new behavior means rewriting the entire decision tree.",
  rendering:
    "Draw call batching, frustum culling, LOD, texture atlasing, and instanced rendering. You'll hit this when your scene drops below 60 FPS despite simple geometry, or when adding one more particle system halves your framerate.",
  shaders:
    "GPU branching, precision qualifiers, vertex vs fragment computation, and uniform batching. You'll hit this when a shader runs fine on desktop but crawls on mobile, or when a visual effect costs 10x more than it should.",
  netcode:
    "Client prediction, server authority, state interpolation, lag compensation, and snapshot compression. You'll hit this when players teleport, shots don't register, or the game feels unplayable above 100ms latency.",
};
