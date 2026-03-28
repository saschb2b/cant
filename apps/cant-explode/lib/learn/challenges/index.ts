import type { Challenge } from "../types";

import { molecularStabilityChallenges } from "./molecular-stability";
import { acidStrengthChallenges } from "./acid-strength";
import { bondEnergyChallenges } from "./bond-energy";
import { electronegativityChallenges } from "./electronegativity";
import { reactionFavorabilityChallenges } from "./reaction-favorability";
import { solubilityChallenges } from "./solubility";
import { oxidationReductionChallenges } from "./oxidation-reduction";
import { functionalGroupsChallenges } from "./functional-groups";

export const challenges: Challenge[] = [
  ...molecularStabilityChallenges,
  ...acidStrengthChallenges,
  ...bondEnergyChallenges,
  ...electronegativityChallenges,
  ...reactionFavorabilityChallenges,
  ...solubilityChallenges,
  ...oxidationReductionChallenges,
  ...functionalGroupsChallenges,
];
