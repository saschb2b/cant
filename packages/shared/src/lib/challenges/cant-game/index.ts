import type { BaseChallenge } from "../../game/types";

import { aiChallenges } from "./ai";
import { gameLoopChallenges } from "./game-loop";
import { inputChallenges } from "./input";
import { netcodeChallenges } from "./netcode";
import { physicsChallenges } from "./physics";
import { renderingChallenges } from "./rendering";
import { shadersChallenges } from "./shaders";
import { stateChallenges } from "./state";

export {
  aiChallenges,
  gameLoopChallenges,
  inputChallenges,
  netcodeChallenges,
  physicsChallenges,
  renderingChallenges,
  shadersChallenges,
  stateChallenges,
};

export const challenges: BaseChallenge[] = [
  ...aiChallenges,
  ...gameLoopChallenges,
  ...inputChallenges,
  ...netcodeChallenges,
  ...physicsChallenges,
  ...renderingChallenges,
  ...shadersChallenges,
  ...stateChallenges,
];
