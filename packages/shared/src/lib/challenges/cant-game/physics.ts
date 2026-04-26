import type { BaseChallenge } from "../../game/types";

export const physicsChallenges: BaseChallenge[] = [
  {
    id: "phys-001",
    category: "physics",
    difficulty: "easy",
    title: "Collision check strategy",
    prompt:
      "Which collision detection approach scales better with many entities?",
    content: {
      type: "visual",
      left: { componentId: "CollisionBruteForce" },
      right: { componentId: "CollisionSpatialHash" },
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
      type: "visual",
      left: { componentId: "CollisionDiscrete" },
      right: { componentId: "CollisionContinuous" },
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
  {
    id: "phys-003",
    category: "physics",
    difficulty: "medium",
    title: "Integration method",
    prompt:
      "Which numerical integration keeps a rope simulation stable over time?",
    content: {
      type: "visual",
      left: { componentId: "RopeEuler" },
      right: { componentId: "RopeVerlet" },
    },

    correctSide: "right",
    explanationCorrect:
      "Verlet integration stores position and previous position instead of position and velocity. The velocity is implicit in the difference between the two. Constraint relaxation (repeatedly nudging points to satisfy distance constraints) is simple and stable because it operates directly on positions. Energy is naturally dissipated rather than accumulated, making it ideal for ropes, cloth, and ragdolls.",
    explanationWrong:
      "Euler integration updates velocity then position each frame. When constraint corrections feed back into velocity, small floating-point errors accumulate over time and inject energy into the system. The rope oscillates with increasing amplitude until it explodes. Reducing the timestep helps but never fully eliminates the instability.",
    sourceUrl:
      "https://www.gamedev.net/tutorials/programming/math-and-physics/a-verlet-based-approach-for-2d-game-physics-r2714/",
    sourceLabel: "GameDev.net: Verlet-based 2D Physics",
  },
];
