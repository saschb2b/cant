import type { BaseChallenge } from "../../game/types";

export const molecularStabilityChallenges: BaseChallenge[] = [
  {
    id: "ms-001",
    category: "molecular-stability",
    difficulty: "easy",
    title: "Aromatic vs non-aromatic stability",
    prompt: "Which cyclic molecule is more thermodynamically stable?",
    content: {
      type: "visual",
      left: { componentId: "BenzeneAromatic" },
      right: { componentId: "CyclohexadieneNonAromatic" },
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
    id: "ms-003",
    category: "molecular-stability",
    difficulty: "medium",
    title: "Tertiary vs primary carbocation stability",
    prompt: "Which carbocation is more stable in solution?",
    content: {
      type: "visual",
      left: { componentId: "TertButylCation" },
      right: { componentId: "MethylCation" },
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
      type: "visual",
      left: { componentId: "CyclohexaneRing" },
      right: { componentId: "CyclopropaneRing" },
    },
    correctSide: "left",
    explanationCorrect:
      "Cyclohexane is nearly strain-free because its chair conformation allows bond angles close to the ideal tetrahedral angle of 109.5 degrees. It has essentially zero ring strain.",
    explanationWrong:
      "Cyclopropane is highly strained because its 60-degree bond angles deviate enormously from the ideal tetrahedral angle of 109.5 degrees. This gives it about 115 kJ/mol of ring strain energy.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ring_strain",
    sourceLabel: "Wikipedia: Ring strain",
  },
];
