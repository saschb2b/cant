import type { Challenge } from "../types";

export const aiChallenges: Challenge[] = [
  {
    id: "ai-001",
    category: "ai",
    difficulty: "easy",
    title: "Decision structure",
    prompt:
      "Which AI decision structure is easier to extend with new behaviors?",
    content: {
      type: "code",

      left: `function updateEnemy(enemy: Enemy, player: Player) {
  if (enemy.health < 20) {
    if (distanceTo(player) < 100) {
      flee(enemy, player);
    } else {
      heal(enemy);
    }
  } else if (distanceTo(player) < 50) {
    if (enemy.ammo > 0) {
      shoot(enemy, player);
    } else {
      melee(enemy, player);
    }
  } else if (distanceTo(player) < 200) {
    chase(enemy, player);
  } else {
    patrol(enemy);
  }
}`,

      right: `const enemyBehavior = selector([
  sequence([
    condition((e) => e.health < 20),
    selector([
      sequence([
        condition((e, p) => distanceTo(e, p) < 100),
        action(flee),
      ]),
      action(heal),
    ]),
  ]),
  sequence([
    condition((e, p) => distanceTo(e, p) < 50),
    selector([
      sequence([
        condition((e) => e.ammo > 0),
        action(shoot),
      ]),
      action(melee),
    ]),
  ]),
  sequence([
    condition((e, p) => distanceTo(e, p) < 200),
    action(chase),
  ]),
  action(patrol),
]);`,
    },

    correctSide: "right",
    explanationCorrect:
      "A behavior tree makes the decision hierarchy explicit and composable. Each node is a reusable building block: selectors try children until one succeeds, sequences run children in order. Adding 'take cover' behavior means inserting a node, not restructuring nested if/else. Trees can be serialized, visualized in debug tools, and edited by designers.",
    explanationWrong:
      "Nested if/else chains encode the decision tree implicitly in control flow. Adding a new behavior means finding the right nesting level and carefully inserting conditions without breaking existing branches. The structure is invisible to debugging tools, and two developers editing the same function will almost certainly cause merge conflicts.",
    sourceUrl:
      "https://www.gamedeveloper.com/programming/behavior-trees-for-ai-how-they-work",
    sourceLabel: "Game Developer: Behavior Trees for AI",
  },
  {
    id: "ai-002",
    category: "ai",
    difficulty: "medium",
    title: "Pathfinding heuristic",
    prompt:
      "Which A* heuristic produces shorter paths on a grid that allows diagonal movement?",
    content: {
      type: "code",

      left: `// Manhattan distance heuristic
function heuristic(a: Node, b: Node): number {
  return Math.abs(a.x - b.x)
       + Math.abs(a.y - b.y);
}

// A* with Manhattan on a grid
// where diagonal moves cost sqrt(2)
// Overestimates diagonal paths
// Still finds a path, but may explore
// more nodes than necessary`,

      right: `// Octile distance heuristic
function heuristic(a: Node, b: Node): number {
  const dx = Math.abs(a.x - b.x);
  const dy = Math.abs(a.y - b.y);
  // Diagonal cost: sqrt(2) ~ 1.414
  return dx + dy + (Math.SQRT2 - 2) * Math.min(dx, dy);
}

// Matches actual movement cost on a grid
// with 8-directional movement
// Never overestimates, so A* finds
// the optimal path efficiently`,
    },

    correctSide: "right",
    explanationCorrect:
      "Octile distance is the correct heuristic for 8-directional grids because it accounts for diagonal moves costing sqrt(2) instead of 1. It never overestimates, so A* remains optimal while exploring fewer nodes than a looser heuristic. The formula takes min(dx, dy) diagonal steps and the remainder as cardinal steps.",
    explanationWrong:
      "Manhattan distance assumes only 4-directional movement. On an 8-directional grid, it overestimates the cost of diagonal paths, which can cause A* to explore unnecessary nodes and return suboptimal paths if the implementation does not handle inadmissible heuristics. It works, but it is not the right tool for the grid.",
    sourceUrl:
      "http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html",
    sourceLabel: "Red Blob Games: A* Heuristics",
  },
];
