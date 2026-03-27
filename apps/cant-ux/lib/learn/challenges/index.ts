import type { Challenge } from "../types";
import { typographyChallenges } from "./typography";
import { spacingChallenges } from "./spacing";
import { colorChallenges } from "./color";
import { hierarchyChallenges } from "./hierarchy";
import { layoutChallenges } from "./layout";
import { formsChallenges } from "./forms";
import { feedbackChallenges } from "./feedback";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...typographyChallenges,
  ...spacingChallenges,
  ...colorChallenges,
  ...hierarchyChallenges,
  ...layoutChallenges,
  ...formsChallenges,
  ...feedbackChallenges,
];
