import type { Challenge } from "../types";

import { molecularStabilityChallenges } from "./molecular-stability";
import { acidStrengthChallenges } from "./acid-strength";
import { bondEnergyChallenges } from "./bond-energy";
import { electronegativityChallenges } from "./electronegativity";
import { reactionFavorabilityChallenges } from "./reaction-favorability";
import { solubilityChallenges } from "./solubility";
import { oxidationReductionChallenges } from "./oxidation-reduction";
import { functionalGroupsChallenges } from "./functional-groups";
import { structuralFormulasChallenges } from "./structural-formulas";
import { molecularGeometryChallenges } from "./molecular-geometry";
import { periodicTrendsChallenges } from "./periodic-trends";
import { electronConfigurationChallenges } from "./electron-configuration";
import { energyDiagramsChallenges } from "./energy-diagrams";
import { stereochemistryChallenges } from "./stereochemistry";
import { electrostaticMapsChallenges } from "./electrostatic-maps";

export const challenges: Challenge[] = [
  ...molecularStabilityChallenges,
  ...acidStrengthChallenges,
  ...bondEnergyChallenges,
  ...electronegativityChallenges,
  ...reactionFavorabilityChallenges,
  ...solubilityChallenges,
  ...oxidationReductionChallenges,
  ...functionalGroupsChallenges,
  ...structuralFormulasChallenges,
  ...molecularGeometryChallenges,
  ...periodicTrendsChallenges,
  ...electronConfigurationChallenges,
  ...energyDiagramsChallenges,
  ...stereochemistryChallenges,
  ...electrostaticMapsChallenges,
];
