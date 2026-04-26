import type { BaseChallenge } from "../../game/types";

export const inputChallenges: BaseChallenge[] = [
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
      type: "visual",
      left: { componentId: "JumpStrict" },
      right: { componentId: "JumpCoyoteTime" },
    },

    correctSide: "right",
    explanationCorrect:
      "Coyote time gives a brief grace period after leaving a platform, so pressing jump one frame late still works. Input buffering remembers a jump press for a few frames, so pressing slightly before landing still triggers. Together they make platforming feel responsive and forgiving, which players perceive as 'tight controls' rather than leniency.",
    explanationWrong:
      "Requiring the player to press jump on the exact frame they are grounded feels unresponsive. Players running off a ledge lose their jump the instant they leave the ground, which feels like a bug. Players pressing jump one frame before landing get nothing, which feels laggy. Both are solvable with small timing windows.",
    sourceUrl: "https://www.youtube.com/watch?v=2S3g8CgBG1g",
    sourceLabel: "Game Maker's Toolkit: Platformer Mechanics",
  },
  {
    id: "input-003",
    category: "input",
    difficulty: "easy",
    title: "Analog stick deadzone",
    prompt:
      "Which analog stick handling keeps the character still when the player is not touching the stick?",
    content: {
      type: "visual",
      left: { componentId: "DeadzoneRaw" },
      right: { componentId: "DeadzoneCircular" },
    },

    correctSide: "right",
    explanationCorrect:
      "A circular deadzone ignores input below a magnitude threshold, filtering out stick drift and noise. Radial remapping then rescales the remaining range so that the first detectable movement starts from zero, not from the deadzone edge. This prevents both idle drift and the 'dead spot' where small intentional movements are lost.",
    explanationWrong:
      "Passing raw stick values straight to movement means the character drifts even when the player is not touching the stick. Physical sticks rarely rest at exactly (0, 0) due to manufacturing tolerances. Per-axis clamping (square deadzone) is better than nothing but creates diagonal bias where the deadzone corners let more input through than the edges.",
    sourceUrl:
      "https://www.gamedeveloper.com/disciplines/doing-thumbstick-dead-zones-right",
    sourceLabel: "Game Developer: Thumbstick Dead Zones",
  },
  {
    id: "input-004",
    category: "input",
    difficulty: "medium",
    title: "Jump height control",
    prompt:
      "Which jump system gives the player more expressive control over movement?",
    content: {
      type: "visual",
      left: { componentId: "JumpFixed" },
      right: { componentId: "JumpVariable" },
    },

    correctSide: "right",
    explanationCorrect:
      "Variable jump height ties the arc to how long the player holds the button. Releasing early cuts the upward velocity, producing a short hop. Holding longer lets the full impulse play out. This gives players fine-grained control over their trajectory, which is essential for precise platforming. Nearly every modern platformer from Mario to Celeste uses this technique.",
    explanationWrong:
      "A fixed-height jump always applies the same impulse regardless of how the player presses the button. Every jump is identical, which feels robotic and removes a layer of skill expression. Players cannot adjust mid-air to thread through tight gaps or land on small platforms because the arc is predetermined.",
    sourceUrl: "https://www.youtube.com/watch?v=2S3g8CgBG1g",
    sourceLabel: "Game Maker's Toolkit: Platformer Mechanics",
  },
  {
    id: "input-005",
    category: "input",
    difficulty: "hard",
    title: "Target tracking assistance",
    prompt:
      "Which aiming approach helps players hit moving targets more consistently?",
    content: {
      type: "visual",
      left: { componentId: "AimRaw" },
      right: { componentId: "AimAssist" },
    },

    correctSide: "right",
    explanationCorrect:
      "Aim assist applies a subtle velocity bias toward nearby targets when the crosshair is within a magnetism radius. The player still controls the crosshair, but the assist compensates for the imprecision of analog sticks. Most console shooters use some combination of aim slowdown (reduced sensitivity near targets) and bullet magnetism. The goal is to match the precision that mouse input gets for free.",
    explanationWrong:
      "Raw analog input without any assistance makes it extremely difficult to track moving targets precisely. Analog sticks have lower resolution and higher latency than mice, so demanding the same precision from both devices creates an unfair gap. Players experience constant overshooting and frustration rather than the intended challenge.",
    sourceUrl:
      "https://www.gamedeveloper.com/design/game-design-deep-dive-the-aim-assist-of-halo",
    sourceLabel: "Game Developer: Aim Assist in Halo",
  },
];
