import type { BaseChallenge } from "../../game/types";

export const netcodeChallenges: BaseChallenge[] = [
  {
    id: "net-001",
    category: "netcode",
    difficulty: "easy",
    title: "Authority model",
    prompt:
      "Which multiplayer architecture handles cheating and consistency better?",
    content: {
      type: "code",

      left: `// Client-authoritative: trust the client
// Client sends final position to server
function onPlayerMove(client: Client, data: MoveData) {
  client.player.x = data.x;
  client.player.y = data.y;
  client.player.health = data.health;
  broadcast(client.player);
}

// Client can send any position
// Client can set health to 9999
// Server has no way to detect cheating`,

      right: `// Server-authoritative: server validates
// Client sends inputs, server simulates
function onPlayerInput(
  client: Client,
  input: InputData,
) {
  const player = client.player;
  const newPos = simulate(player, input);

  // Server validates the move
  if (isValidPosition(newPos)) {
    player.x = newPos.x;
    player.y = newPos.y;
  }

  broadcast(player);
}

// Client predicts locally for responsiveness
// Server corrects if prediction diverges`,
    },

    correctSide: "right",
    explanationCorrect:
      "A server-authoritative model treats clients as input devices: they send button presses, not positions. The server runs the simulation, validates every action, and broadcasts the canonical state. Cheating is limited to information the server chooses to share. Client-side prediction keeps the game feeling responsive despite the round trip.",
    explanationWrong:
      "Trusting the client means any player with a modified client can teleport, give themselves infinite health, or move at any speed. The server has no ground truth to compare against, so there is no reliable way to detect or prevent cheating. This is why nearly every competitive multiplayer game uses server authority.",
    sourceUrl: "https://gafferongames.com/post/client_server_connection/",
    sourceLabel: "Gaffer On Games: Client Server Connection",
  },
  {
    id: "net-002",
    category: "netcode",
    difficulty: "hard",
    title: "Remote entity rendering",
    prompt:
      "Which approach to rendering remote players produces smoother movement?",
    content: {
      type: "visual",
      left: { componentId: "NetcodeSnapping" },
      right: { componentId: "NetcodeInterpolation" },
    },

    correctSide: "right",
    explanationCorrect:
      "Entity interpolation renders remote entities slightly in the past, smoothly blending between two known server states. Since both endpoints are real server snapshots, the result is always accurate. The 100ms delay is barely perceptible but provides enough buffer to absorb network jitter. This is how Source Engine, Overwatch, and most competitive games handle remote entities.",
    explanationWrong:
      "Snapping to the latest server position creates visible teleporting every time a network update arrives. At 20 ticks per second, entities move in 50ms jerks. Increasing the tick rate helps but wastes bandwidth. Extrapolation (predicting forward) can overshoot and cause rubber-banding. Interpolation between known states avoids both problems.",
    sourceUrl: "https://gafferongames.com/post/snapshot_interpolation/",
    sourceLabel: "Gaffer On Games: Snapshot Interpolation",
  },
];
