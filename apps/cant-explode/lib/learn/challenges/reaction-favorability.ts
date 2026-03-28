import type { Challenge } from "../types";

export const reactionFavorabilityChallenges: Challenge[] = [
  {
    id: "rf-001",
    category: "reaction-favorability",
    difficulty: "easy",
    title: "Exothermic vs endothermic reaction",
    prompt: "Which reaction is thermodynamically favorable?",
    content: {
      type: "molecule",
      left: {
        name: "Combustion of hydrogen",
        formula: "2H₂ + O₂ → 2H₂O",
        properties: {
          "Delta H": "-572 kJ/mol",
          Type: "Exothermic",
          "Delta G": "-457 kJ/mol",
        },
      },
      right: {
        name: "Decomposition of water",
        formula: "2H₂O → 2H₂ + O₂",
        properties: {
          "Delta H": "+572 kJ/mol",
          Type: "Endothermic",
          "Delta G": "+457 kJ/mol",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "The combustion of hydrogen is thermodynamically favorable with a large negative Gibbs free energy (Delta G = -457 kJ/mol). The reaction releases energy because the O-H bonds formed in water are stronger than the H-H and O=O bonds broken.",
    explanationWrong:
      "The decomposition of water is thermodynamically unfavorable under standard conditions. It requires a continuous input of energy (such as electrolysis) because the reaction has a large positive Delta G.",
    sourceUrl: "https://en.wikipedia.org/wiki/Hydrogen#Combustion",
    sourceLabel: "Wikipedia: Hydrogen combustion",
  },
  {
    id: "rf-002",
    category: "reaction-favorability",
    difficulty: "hard",
    title: "SN2 reaction rate and steric effects",
    prompt: "Which substrate reacts faster via SN2?",
    content: {
      type: "molecule",
      left: {
        name: "Methyl bromide (primary)",
        formula: "CH₃Br",
        smiles: "CBr",
        properties: {
          "Carbon type": "Primary (methyl)",
          "Steric hindrance": "Minimal",
          "Relative SN2 rate": "~30",
        },
      },
      right: {
        name: "Tert-butyl bromide (tertiary)",
        formula: "(CH₃)₃CBr",
        smiles: "CC(C)(C)Br",
        properties: {
          "Carbon type": "Tertiary",
          "Steric hindrance": "Very high",
          "Relative SN2 rate": "~0",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "SN2 reactions proceed much faster at primary carbons because the nucleophile can easily access the electrophilic carbon from the back side. Methyl and primary substrates have minimal steric hindrance, allowing the concerted mechanism to proceed readily.",
    explanationWrong:
      "Tertiary substrates are essentially unreactive via SN2 because three bulky methyl groups block backside attack by the nucleophile. Instead, tertiary substrates react through the SN1 mechanism, which does not require backside approach.",
    sourceUrl: "https://en.wikipedia.org/wiki/SN2_reaction",
    sourceLabel: "Wikipedia: SN2 reaction",
  },
  {
    id: "rf-003",
    category: "reaction-favorability",
    difficulty: "medium",
    title: "Formation enthalpy comparison",
    prompt: "Which compound forms more exothermically?",
    content: {
      type: "molecule",
      left: {
        name: "Sodium chloride",
        formula: "NaCl",
        smiles: "[Na+].[Cl-]",
        properties: {
          "Delta Hf": "-411 kJ/mol",
          "Bond type": "Ionic",
          "Lattice energy": "787 kJ/mol",
        },
      },
      right: {
        name: "Gold(III) chloride",
        formula: "AuCl₃",
        smiles: "[Au+3].[Cl-].[Cl-].[Cl-]",
        properties: {
          "Delta Hf": "-118 kJ/mol",
          "Bond type": "Covalent/Ionic",
          Stability: "Decomposes above 160°C",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "NaCl formation is far more thermodynamically favorable (Delta Hf = -411 kJ/mol vs -118 kJ/mol). Sodium readily gives up its single valence electron to chlorine, forming a strong ionic lattice with high lattice energy.",
    explanationWrong:
      "Gold(III) chloride has a much less negative enthalpy of formation and decomposes at relatively low temperatures. Gold's high ionization energy and reluctance to lose electrons make the formation less favorable.",
    sourceUrl: "https://en.wikipedia.org/wiki/Standard_enthalpy_of_formation",
    sourceLabel: "Wikipedia: Standard enthalpy of formation",
  },
];
