import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Foundations
  "molecular-stability",
  "acid-strength",
  "bond-energy",
  "electronegativity",
  // Reactions & Properties
  "reaction-favorability",
  "solubility",
  "oxidation-reduction",
  "functional-groups",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "molecular-stability": "Molecular Stability",
  "acid-strength": "Acid Strength",
  "bond-energy": "Bond Energy",
  electronegativity: "Electronegativity",
  "reaction-favorability": "Reaction Favorability",
  solubility: "Solubility",
  "oxidation-reduction": "Oxidation & Reduction",
  "functional-groups": "Functional Groups",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Foundations",
    categories: [
      "molecular-stability",
      "acid-strength",
      "bond-energy",
      "electronegativity",
    ],
  },
  {
    label: "Reactions & Properties",
    categories: [
      "reaction-favorability",
      "solubility",
      "oxidation-reduction",
      "functional-groups",
    ],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "electronegativity",
  "bond-energy",
  "molecular-stability",
  "acid-strength",
  "solubility",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "molecular-stability":
    "Aromaticity, resonance stabilization, ring strain, and carbocation stability. These determine which molecules persist and which decompose. You will encounter this when predicting whether a compound will survive reaction conditions or fall apart.",
  "acid-strength":
    "pKa values, conjugate base stability, and the factors that make a proton easy or hard to remove. Electronegativity, resonance, induction, and atom size all play a role. Essential for understanding buffer systems and organic reaction mechanisms.",
  "bond-energy":
    "Single, double, and triple bond energies and what makes one bond stronger than another. Bond length, orbital overlap, and electronegativity differences matter. This determines reaction enthalpies and which bonds break first.",
  electronegativity:
    "The tendency of an atom to attract shared electrons. Trends across the periodic table, Pauling scale values, and how electronegativity differences create polar bonds and influence molecular properties.",
  "reaction-favorability":
    "Thermodynamic and kinetic factors that determine whether a reaction proceeds. Gibbs free energy, enthalpy, entropy, activation energy, and Le Chatelier's principle. Predicting which direction a reaction will go under given conditions.",
  solubility:
    "Like dissolves like, solubility rules for ionic compounds, and the role of intermolecular forces. Hydrogen bonding, polarity, and lattice energy determine whether a substance dissolves in water or organic solvents.",
  "oxidation-reduction":
    "Electron transfer reactions, standard reduction potentials, and the activity series. Identifying oxidizing and reducing agents, balancing redox equations, and predicting spontaneous reactions in electrochemistry.",
  "functional-groups":
    "Reactivity patterns of alcohols, aldehydes, ketones, carboxylic acids, amines, and esters. How functional group identity determines chemical behavior, acidity, basicity, and reaction pathways in organic chemistry.",
};
