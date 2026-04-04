import type { BaseChallenge } from "../../game/types";

export const oxidationReductionChallenges: BaseChallenge[] = [
  {
    id: "or-001",
    category: "oxidation-reduction",
    difficulty: "medium",
    title: "Strongest reducing agent",
    prompt: "Which metal loses electrons more readily?",
    content: {
      type: "molecule",
      left: {
        name: "Lithium",
        formula: "Li",
        smiles: "[Li]",
        properties: {
          "Standard reduction potential": "-3.04 V",
          "Electron configuration": "[He] 2s¹",
          "Ionization energy": "520 kJ/mol",
        },
      },
      right: {
        name: "Copper",
        formula: "Cu",
        smiles: "[Cu]",
        properties: {
          "Standard reduction potential": "+0.34 V",
          "Electron configuration": "[Ar] 3d¹⁰ 4s¹",
          "Ionization energy": "745 kJ/mol",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Lithium is a far stronger reducing agent than copper. Its very negative standard reduction potential (-3.04 V) means it has an extremely strong tendency to lose electrons. Lithium is in fact the strongest metallic reducing agent in aqueous solution.",
    explanationWrong:
      "Copper is a poor reducing agent with a positive standard reduction potential (+0.34 V). It prefers to gain electrons rather than lose them, which is why copper does not dissolve in most acids and is found in its native metallic form.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Standard_electrode_potential_(data_page)",
    sourceLabel: "Wikipedia: Standard electrode potential data",
  },
  {
    id: "or-002",
    category: "oxidation-reduction",
    difficulty: "medium",
    title: "Strongest oxidizing agent among halogens",
    prompt: "Which halogen accepts electrons more eagerly?",
    content: {
      type: "molecule",
      left: {
        name: "Fluorine",
        formula: "F₂",
        smiles: "FF",
        properties: {
          "Standard reduction potential": "+2.87 V",
          "Electron affinity": "-328 kJ/mol",
          "Oxidizing strength": "Strongest known",
        },
      },
      right: {
        name: "Iodine",
        formula: "I₂",
        smiles: "II",
        properties: {
          "Standard reduction potential": "+0.54 V",
          "Electron affinity": "-295 kJ/mol",
          "Oxidizing strength": "Weak",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "F₂ is the strongest known elemental oxidizing agent with a standard reduction potential of +2.87 V. Its small size, high electronegativity, and weak F-F bond (which is easy to break) all contribute to its extreme oxidizing power.",
    explanationWrong:
      "I₂ is a relatively weak oxidizing agent (+0.54 V). Its large atomic radius and lower electronegativity make it much less eager to accept electrons than fluorine. Iodine is actually a mild enough oxidizing agent to be used as a wound disinfectant.",
    sourceUrl: "https://en.wikipedia.org/wiki/Fluorine#Reactivity",
    sourceLabel: "Wikipedia: Fluorine, Reactivity",
  },
  {
    id: "or-003",
    category: "oxidation-reduction",
    difficulty: "hard",
    title: "Ease of oxidation comparison",
    prompt: "Which metal is oxidized more easily?",
    content: {
      type: "molecule",
      left: {
        name: "Zinc",
        formula: "Zn",
        smiles: "[Zn]",
        properties: {
          "Standard reduction potential": "-0.76 V",
          "Common oxidation state": "+2",
          Reactivity: "Dissolves in dilute acids",
        },
      },
      right: {
        name: "Gold",
        formula: "Au",
        smiles: "[Au]",
        properties: {
          "Standard reduction potential": "+1.50 V",
          "Common oxidation state": "+3",
          Reactivity: "Requires aqua regia",
        },
      },
    },
    correctSide: "left",
    explanationCorrect:
      "Zinc is much more easily oxidized than gold. Its negative standard reduction potential (-0.76 V) indicates a strong tendency to lose electrons and form Zn²⁺ ions. Zinc dissolves readily in dilute acids, releasing hydrogen gas.",
    explanationWrong:
      "Gold is extremely resistant to oxidation, with a very positive standard reduction potential (+1.50 V). It does not react with most acids and requires aqua regia (a mixture of concentrated nitric and hydrochloric acids) to dissolve. This resistance to oxidation is why gold remains untarnished for millennia.",
    sourceUrl: "https://en.wikipedia.org/wiki/Reactivity_series",
    sourceLabel: "Wikipedia: Reactivity series",
  },
];
