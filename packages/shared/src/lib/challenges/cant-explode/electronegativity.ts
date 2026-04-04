import type { BaseChallenge } from "../../game/types";

export const electronegativityChallenges: BaseChallenge[] = [
  {
    id: "en-001",
    category: "electronegativity",
    difficulty: "easy",
    title: "Most electronegative element",
    prompt: "Which element attracts bonding electrons more?",
    content: {
      type: "molecule",
      left: {
        name: "Fluorine",
        formula: "F",
        smiles: "[F]",
        properties: {
          "Pauling electronegativity": "3.98",
          Period: "2",
          Group: "17 (Halogens)",
        },
      },
      right: {
        name: "Oxygen",
        formula: "O",
        smiles: "[O]",
        properties: {
          "Pauling electronegativity": "3.44",
          Period: "2",
          Group: "16 (Chalcogens)",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Fluorine (3.98) is the most electronegative element on the Pauling scale. In period 2, electronegativity increases from left to right as the nuclear charge grows while the atomic radius shrinks, and fluorine sits at the far right.",
    explanationWrong:
      "Oxygen (3.44) is the second most electronegative element. While it attracts electrons very strongly, fluorine's additional proton and smaller atomic radius give it an even greater pull on bonding electrons.",
    sourceUrl: "https://en.wikipedia.org/wiki/Electronegativity",
    sourceLabel: "Wikipedia: Electronegativity",
  },
  {
    id: "en-002",
    category: "electronegativity",
    difficulty: "easy",
    title: "Oxygen vs nitrogen electronegativity",
    prompt: "Which has a higher Pauling electronegativity?",
    content: {
      type: "molecule",
      left: {
        name: "Nitrogen",
        formula: "N",
        smiles: "[N]",
        properties: {
          "Pauling electronegativity": "3.04",
          "Atomic number": "7",
        },
      },
      right: {
        name: "Oxygen",
        formula: "O",
        smiles: "[O]",
        properties: {
          "Pauling electronegativity": "3.44",
          "Atomic number": "8",
        },
      },
    },
    correctSide: "right",
    explanationCorrect:
      "Oxygen (3.44) is more electronegative than nitrogen (3.04). Moving one position to the right in period 2, oxygen has one more proton in its nucleus while the atomic radius barely changes, resulting in a stronger pull on electrons.",
    explanationWrong:
      "Nitrogen is less electronegative than oxygen because it has one fewer proton. Both elements are in period 2, but the trend of increasing electronegativity across a period places nitrogen below oxygen.",
    sourceUrl: "https://en.wikipedia.org/wiki/Electronegativity",
    sourceLabel: "Wikipedia: Electronegativity",
  },
  {
    id: "en-003",
    category: "electronegativity",
    difficulty: "medium",
    title: "Carbon vs silicon electronegativity",
    prompt: "Which group 14 element is more electronegative?",
    content: {
      type: "molecule",
      left: {
        name: "Carbon",
        formula: "C",
        smiles: "[C]",
        properties: {
          "Pauling electronegativity": "2.55",
          Period: "2",
        },
      },
      right: {
        name: "Silicon",
        formula: "Si",
        smiles: "[Si]",
        properties: {
          "Pauling electronegativity": "1.90",
          Period: "3",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Carbon (2.55) is more electronegative than silicon (1.90). They are in the same group, but carbon is one period higher. Moving down a group, electronegativity decreases because the valence electrons are farther from the nucleus and more shielded.",
    explanationWrong:
      "Silicon is less electronegative because its valence electrons are in the third shell, farther from the nucleus and shielded by more inner electrons. This reduced attraction to bonding electrons is why silicon forms more ionic-character bonds than carbon.",
    sourceUrl: "https://en.wikipedia.org/wiki/Electronegativity",
    sourceLabel: "Wikipedia: Electronegativity",
  },
  {
    id: "en-004",
    category: "electronegativity",
    difficulty: "medium",
    title: "Chlorine vs bromine electronegativity",
    prompt: "Which halogen pulls electrons more strongly?",
    content: {
      type: "molecule",
      left: {
        name: "Chlorine",
        formula: "Cl",
        smiles: "[Cl]",
        properties: {
          "Pauling electronegativity": "3.16",
          Period: "3",
          "Atomic radius": "99 pm",
        },
      },
      right: {
        name: "Bromine",
        formula: "Br",
        smiles: "[Br]",
        properties: {
          "Pauling electronegativity": "2.96",
          Period: "4",
          "Atomic radius": "114 pm",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Chlorine (3.16) is more electronegative than bromine (2.96). Both are halogens, but chlorine is one period higher with a smaller atomic radius. Its valence electrons are closer to the nucleus, giving it a stronger pull on shared electrons.",
    explanationWrong:
      "Bromine is less electronegative than chlorine because its valence electrons occupy the fourth shell, farther from the nucleus. The additional electron shielding reduces the effective nuclear charge felt by bonding electrons.",
    sourceUrl: "https://en.wikipedia.org/wiki/Electronegativity",
    sourceLabel: "Wikipedia: Electronegativity",
  },
];
