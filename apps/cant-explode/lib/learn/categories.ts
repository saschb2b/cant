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
  // Visual Chemistry
  "structural-formulas",
  "molecular-geometry",
  "periodic-trends",
  "electron-configuration",
  "energy-diagrams",
  "stereochemistry",
  "electrostatic-maps",
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
  "structural-formulas": "Structural Formulas",
  "molecular-geometry": "Molecular Geometry",
  "periodic-trends": "Periodic Table Trends",
  "electron-configuration": "Electron Configuration",
  "energy-diagrams": "Energy Diagrams",
  stereochemistry: "Stereochemistry",
  "electrostatic-maps": "Electrostatic Maps",
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
  {
    label: "Visual Chemistry",
    categories: [
      "structural-formulas",
      "molecular-geometry",
      "periodic-trends",
      "electron-configuration",
      "energy-diagrams",
      "stereochemistry",
      "electrostatic-maps",
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
  "structural-formulas",
  "molecular-geometry",
  "periodic-trends",
  "electron-configuration",
  "energy-diagrams",
  "stereochemistry",
  "electrostatic-maps",
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
  "structural-formulas":
    "How molecules are drawn and what those drawings communicate. Covers skeletal structures, resonance notation, constitutional isomers, and the difference between open-chain and cyclic forms of the same compound.",
  "molecular-geometry":
    "Three-dimensional shapes of molecules predicted by VSEPR theory. Covers bond angles, lone pair repulsion, and why water is bent, methane is tetrahedral, and ammonia is pyramidal.",
  "periodic-trends":
    "How atomic properties change across periods and down groups. Electronegativity, atomic radius, ionization energy, and electron affinity follow predictable patterns that explain chemical reactivity.",
  "electron-configuration":
    "How electrons fill orbitals according to the Aufbau principle, Hund's rule, and the Pauli exclusion principle. Includes common exceptions like chromium and copper where half-filled or filled d-subshells are favored.",
  "energy-diagrams":
    "Reaction coordinate diagrams showing activation energy, transition states, and intermediates. Covers exothermic vs endothermic profiles, the effect of catalysts, and how energy barriers determine reaction rates.",
  stereochemistry:
    "Spatial arrangement of atoms in molecules and how it affects properties. Covers Newman projections, Fischer projections, chair conformations, and the difference between cis/trans and R/S configurations.",
  "electrostatic-maps":
    "Visualization of electron density and charge distribution in molecules. Covers polar vs nonpolar bonds, net dipole moments, and the spectrum from ionic to covalent bonding character.",
};
