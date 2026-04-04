import type { BaseChallenge } from "../../game/types";

export const reactionFavorabilityChallenges: BaseChallenge[] = [
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
