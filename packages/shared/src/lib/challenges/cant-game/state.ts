import type { BaseChallenge } from "../../game/types";

export const stateChallenges: BaseChallenge[] = [
  {
    id: "state-001",
    category: "state",
    difficulty: "easy",
    title: "Character behavior modeling",
    prompt: "Which approach to managing character states is more maintainable?",
    content: {
      type: "visual",
      left: { componentId: "StateBooleanFlags" },
      right: { componentId: "StateFiniteMachine" },
    },

    correctSide: "right",
    explanationCorrect:
      "A discriminated union (tagged state) makes it impossible to be in two conflicting states at once. Each state carries only the data it needs, and the switch enforces that every state handles its own transitions explicitly. Adding a new state is a compile-time checklist: the exhaustiveness check tells you exactly which transitions to define.",
    explanationWrong:
      "Boolean flags create a combinatorial explosion: four flags means 16 possible combinations, most of which are invalid. Nothing prevents isJumping and isStunned from both being true, and every update tick must navigate a nest of conditionals that grows with each new ability. Bugs from invalid flag combinations are subtle and hard to test.",
    sourceUrl: "https://gameprogrammingpatterns.com/state.html",
    sourceLabel: "Game Programming Patterns: State",
  },
  {
    id: "state-002",
    category: "state",
    difficulty: "medium",
    title: "Scene transition approach",
    prompt: "Which scene management approach handles transitions more cleanly?",
    content: {
      type: "code",

      left: `let currentScene = "menu";

function update(dt: number) {
  if (currentScene === "menu") {
    updateMenu(dt);
    if (startClicked) currentScene = "game";
  } else if (currentScene === "game") {
    updateGame(dt);
    if (playerDied) currentScene = "gameover";
    if (paused) currentScene = "pause";
  } else if (currentScene === "pause") {
    updatePause(dt);
    if (resumed) currentScene = "game";
  } else if (currentScene === "gameover") {
    updateGameOver(dt);
    if (retryClicked) currentScene = "game";
  }
}`,

      right: `interface Scene {
  enter(): void;
  exit(): void;
  update(dt: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}

class SceneManager {
  private stack: Scene[] = [];

  get active(): Scene {
    return this.stack[this.stack.length - 1];
  }

  push(scene: Scene) {
    scene.enter();
    this.stack.push(scene);
  }

  pop() {
    this.stack.pop()?.exit();
    // Previous scene is still on the stack
  }

  replace(scene: Scene) {
    this.stack.pop()?.exit();
    scene.enter();
    this.stack.push(scene);
  }
}

// Pause pushes on top, resume pops back
manager.push(new PauseScene());`,
    },

    correctSide: "right",
    explanationCorrect:
      "A scene stack with enter/exit lifecycle hooks gives each scene a clear boundary for setup and teardown. Pushing a pause screen on top of the game scene preserves the game state underneath. Each scene is self-contained: it manages its own input, rendering, and transitions without knowing about other scenes.",
    explanationWrong:
      "A string-based scene variable with a giant if/else chain mixes all scene logic in one place and provides no lifecycle management. Transitioning from 'game' to 'pause' and back requires manually saving and restoring state. Adding new scenes means touching the central update function, and nothing enforces cleanup when leaving a scene.",
    sourceUrl: "https://gameprogrammingpatterns.com/state.html",
    sourceLabel: "Game Programming Patterns: State",
  },
];
