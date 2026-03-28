import type { Challenge } from "../types";

export const molecularStabilityChallenges: Challenge[] = [
  {
    id: "ms-001",
    category: "molecular-stability",
    difficulty: "easy",
    title: "Aromatic vs non-aromatic stability",
    prompt: "Which cyclic molecule is more thermodynamically stable?",
    content: {
      type: "molecule",
      left: {
        name: "Benzene",
        formula: "C₆H₆",
        smiles: "c1ccccc1",
        properties: {
          "Resonance energy": "~150 kJ/mol",
          Type: "Aromatic",
        },
      },
      right: {
        name: "1,3-Cyclohexadiene",
        formula: "C₆H₈",
        smiles: "C1CC=CC=C1",
        properties: {
          "Resonance energy": "~0 kJ/mol",
          Type: "Non-aromatic",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Benzene is significantly more stable than 1,3-cyclohexadiene due to aromatic stabilization. Its six pi electrons are fully delocalized across the ring, giving it roughly 150 kJ/mol of extra resonance energy compared to what you would expect from isolated double bonds.",
    explanationWrong:
      "1,3-Cyclohexadiene lacks the full cyclic delocalization that gives benzene its aromatic stability. Without aromaticity, the molecule does not benefit from the ~150 kJ/mol resonance stabilization energy.",
    sourceUrl: "https://en.wikipedia.org/wiki/Aromaticity",
    sourceLabel: "Wikipedia: Aromaticity",
  },
  {
    id: "ms-002",
    category: "molecular-stability",
    difficulty: "easy",
    title: "Trans vs cis alkene stability",
    prompt: "Which geometric isomer has lower energy?",
    content: {
      type: "molecule",
      left: {
        name: "Cis-2-butene",
        formula: "C₄H₈",
        smiles: "C/C=C\\C",
        properties: {
          "Heat of hydrogenation": "~120 kJ/mol",
          Configuration: "Cis (Z)",
        },
      },
      right: {
        name: "Trans-2-butene",
        formula: "C₄H₈",
        smiles: "C/C=C/C",
        properties: {
          "Heat of hydrogenation": "~115 kJ/mol",
          Configuration: "Trans (E)",
        },
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Trans-2-butene is more stable because its methyl groups are on opposite sides of the double bond, minimizing steric strain. This is confirmed by its lower heat of hydrogenation compared to the cis isomer.",
    explanationWrong:
      "Cis-2-butene has its methyl groups on the same side of the double bond, creating steric repulsion that raises the molecule's energy. The higher heat of hydrogenation (~120 vs ~115 kJ/mol) confirms it is less stable.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Cis%E2%80%93trans_isomerism#Stability",
    sourceLabel: "Wikipedia: Cis-trans isomerism, Stability",
  },
  {
    id: "ms-003",
    category: "molecular-stability",
    difficulty: "medium",
    title: "Tertiary vs primary carbocation stability",
    prompt: "Which carbocation is more stable in solution?",
    content: {
      type: "molecule",
      left: {
        name: "Tert-butyl cation",
        formula: "(CH₃)₃C⁺",
        smiles: "CC(C)([CH2+])",
        properties: {
          Type: "Tertiary carbocation",
          "Stabilization mechanism": "Hyperconjugation",
        },
      },
      right: {
        name: "Methyl cation",
        formula: "CH₃⁺",
        smiles: "[CH3+]",
        properties: {
          Type: "Primary carbocation",
          "Stabilization mechanism": "None",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Tertiary carbocations are more stable than primary ones because the three adjacent alkyl groups donate electron density through hyperconjugation and inductive effects, spreading the positive charge over a larger volume.",
    explanationWrong:
      "The methyl cation has no adjacent alkyl groups to stabilize its positive charge through hyperconjugation. This makes it one of the least stable simple carbocations and very difficult to observe experimentally.",
    sourceUrl: "https://en.wikipedia.org/wiki/Carbocation#Stability",
    sourceLabel: "Wikipedia: Carbocation stability",
  },
  {
    id: "ms-004",
    category: "molecular-stability",
    difficulty: "easy",
    title: "Ring strain comparison",
    prompt: "Which cycloalkane has less ring strain?",
    content: {
      type: "molecule",
      left: {
        name: "Cyclopropane",
        formula: "C₃H₆",
        smiles: "C1CC1",
        properties: {
          "Ring strain": "~115 kJ/mol",
          "Bond angle": "60°",
        },
      },
      right: {
        name: "Cyclohexane",
        formula: "C₆H₁₂",
        smiles: "C1CCCCC1",
        properties: {
          "Ring strain": "~0 kJ/mol",
          "Bond angle": "~111°",
        },
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Cyclohexane is nearly strain-free because its chair conformation allows bond angles close to the ideal tetrahedral angle of 109.5 degrees. It has essentially zero ring strain.",
    explanationWrong:
      "Cyclopropane is highly strained because its 60-degree bond angles deviate enormously from the ideal tetrahedral angle of 109.5 degrees. This gives it about 115 kJ/mol of ring strain energy.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ring_strain",
    sourceLabel: "Wikipedia: Ring strain",
  },
];
