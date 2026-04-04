import type { BaseChallenge } from "../../game/types";

import { acidStrengthChallenges } from "./acid-strength";
import { bondEnergyChallenges } from "./bond-energy";
import { electronConfigurationChallenges } from "./electron-configuration";
import { electronegativityChallenges } from "./electronegativity";
import { electrostaticMapsChallenges } from "./electrostatic-maps";
import { energyDiagramsChallenges } from "./energy-diagrams";
import { functionalGroupsChallenges } from "./functional-groups";
import { molecularGeometryChallenges } from "./molecular-geometry";
import { molecularStabilityChallenges } from "./molecular-stability";
import { oxidationReductionChallenges } from "./oxidation-reduction";
import { periodicTrendsChallenges } from "./periodic-trends";
import { proteinStructureChallenges } from "./protein-structure";
import { reactionFavorabilityChallenges } from "./reaction-favorability";
import { solubilityChallenges } from "./solubility";
import { stereochemistryChallenges } from "./stereochemistry";
import { structuralFormulasChallenges } from "./structural-formulas";

export {
  acidStrengthChallenges,
  bondEnergyChallenges,
  electronConfigurationChallenges,
  electronegativityChallenges,
  electrostaticMapsChallenges,
  energyDiagramsChallenges,
  functionalGroupsChallenges,
  molecularGeometryChallenges,
  molecularStabilityChallenges,
  oxidationReductionChallenges,
  periodicTrendsChallenges,
  proteinStructureChallenges,
  reactionFavorabilityChallenges,
  solubilityChallenges,
  stereochemistryChallenges,
  structuralFormulasChallenges,
};

export const challenges: BaseChallenge[] = [
  ...acidStrengthChallenges,
  ...bondEnergyChallenges,
  ...electronConfigurationChallenges,
  ...electronegativityChallenges,
  ...electrostaticMapsChallenges,
  ...energyDiagramsChallenges,
  ...functionalGroupsChallenges,
  ...molecularGeometryChallenges,
  ...molecularStabilityChallenges,
  ...oxidationReductionChallenges,
  ...periodicTrendsChallenges,
  ...proteinStructureChallenges,
  ...reactionFavorabilityChallenges,
  ...solubilityChallenges,
  ...stereochemistryChallenges,
  ...structuralFormulasChallenges,
];
