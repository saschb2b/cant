import type { Challenge } from "../types";
import { gameLoopChallenges } from "./game-loop";
import { stateChallenges } from "./state";
import { inputChallenges } from "./input";
import { physicsChallenges } from "./physics";
import { aiChallenges } from "./ai";
import { renderingChallenges } from "./rendering";
import { shadersChallenges } from "./shaders";
import { netcodeChallenges } from "./netcode";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...gameLoopChallenges,
  ...stateChallenges,
  ...inputChallenges,
  ...physicsChallenges,
  ...aiChallenges,
  ...renderingChallenges,
  ...shadersChallenges,
  ...netcodeChallenges,
];
