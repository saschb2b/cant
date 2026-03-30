import type { Challenge } from "../types";

export const inputChallenges: Challenge[] = [
  {
    id: "input-001",
    category: "input",
    difficulty: "easy",
    title: "Key binding strategy",
    prompt: "Which input handling approach is more flexible?",
    content: {
      type: "code",

      left: `document.addEventListener("keydown", (e) => {
  if (e.code === "Space") player.jump();
  if (e.code === "KeyX") player.attack();
  if (e.code === "ShiftLeft") player.dash();
  if (e.code === "KeyE") player.interact();
});

// Adding gamepad support means
// duplicating every binding
gamepad.onButtonPress(0, () => player.jump());
gamepad.onButtonPress(2, () => player.attack());`,

      right: `// Define actions, not keys
const actions = new ActionMap({
  jump:     [Key.Space, Pad.A],
  attack:   [Key.X, Pad.X],
  dash:     [Key.ShiftLeft, Pad.LB],
  interact: [Key.E, Pad.Y],
});

function update() {
  if (actions.justPressed("jump")) player.jump();
  if (actions.justPressed("attack")) player.attack();
  if (actions.justPressed("dash")) player.dash();
  if (actions.justPressed("interact")) player.interact();
}

// Rebinding is a data change, not a code change
actions.rebind("jump", Key.W);`,
    },

    correctSide: "right",
    explanationCorrect:
      "An action mapping layer separates 'what the player wants to do' from 'which physical button they pressed.' Game logic only references action names, so adding gamepad support, remapping keys, or supporting multiple control schemes is a data change. Players expect rebindable controls, and this pattern makes that trivial.",
    explanationWrong:
      "Hardcoding physical key checks scatters input logic across the codebase and locks players into a fixed control scheme. Supporting a second input device means duplicating every binding. Letting players remap keys requires rewriting the event handlers instead of just swapping a data table.",
    sourceUrl: "https://gameprogrammingpatterns.com/command.html",
    sourceLabel: "Game Programming Patterns: Command",
  },
  {
    id: "input-002",
    category: "input",
    difficulty: "medium",
    title: "Jump responsiveness",
    prompt: "Which jump implementation feels more responsive to players?",
    content: {
      type: "code",

      left: `function update(dt: number) {
  if (input.jumpPressed && isOnGround) {
    velocity.y = JUMP_FORCE;
  }

  velocity.y += GRAVITY * dt;
  position.y += velocity.y * dt;

  isOnGround = position.y >= groundLevel;
}`,

      right: `let coyoteTimer = 0;
let jumpBuffer = 0;
const COYOTE_TIME = 0.1;  // seconds
const BUFFER_TIME = 0.12; // seconds

function update(dt: number) {
  if (isOnGround) coyoteTimer = COYOTE_TIME;
  else coyoteTimer -= dt;

  if (input.jumpPressed) jumpBuffer = BUFFER_TIME;
  else jumpBuffer -= dt;

  const canJump = coyoteTimer > 0;
  const wantsJump = jumpBuffer > 0;

  if (canJump && wantsJump) {
    velocity.y = JUMP_FORCE;
    coyoteTimer = 0;
    jumpBuffer = 0;
  }

  velocity.y += GRAVITY * dt;
  position.y += velocity.y * dt;
  isOnGround = position.y >= groundLevel;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Coyote time gives a brief grace period after leaving a platform, so pressing jump one frame late still works. Input buffering remembers a jump press for a few frames, so pressing slightly before landing still triggers. Together they make platforming feel responsive and forgiving, which players perceive as 'tight controls' rather than leniency.",
    explanationWrong:
      "Requiring the player to press jump on the exact frame they are grounded feels unresponsive. Players running off a ledge lose their jump the instant they leave the ground, which feels like a bug. Players pressing jump one frame before landing get nothing, which feels laggy. Both are solvable with small timing windows.",
    sourceUrl: "https://www.youtube.com/watch?v=2S3g8CgBG1g",
    sourceLabel: "Game Maker's Toolkit: Platformer Mechanics",
  },
];
