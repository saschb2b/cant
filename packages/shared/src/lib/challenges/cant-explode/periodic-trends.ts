import type { BaseChallenge } from "../../game/types";

export const periodicTrendsChallenges: BaseChallenge[] = [
  {
    id: "pt-001",
    category: "periodic-trends",
    difficulty: "easy",
    title: "Electronegativity trend",
    prompt: "Which diagram shows the correct electronegativity trend?",
    content: {
      type: "visual",
      left: { componentId: "ElectronegativityCorrectTrend" },
      right: { componentId: "ElectronegativityWrongTrend" },
    },
    correctSide: "left",
    explanationCorrect:
      "Electronegativity increases from left to right across a period (increasing nuclear charge) and from bottom to top within a group (smaller atomic radius). Fluorine in the upper right is the most electronegative element at 3.98 on the Pauling scale.",
    explanationWrong:
      "This diagram incorrectly shows electronegativity increasing downward. Larger atoms have their valence electrons farther from the nucleus, reducing the effective nuclear charge felt by bonding electrons and lowering electronegativity.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Electronegativity#Variation_of_electronegativity",
    sourceLabel: "Wikipedia: Electronegativity trends",
  },
  {
    id: "pt-002",
    category: "periodic-trends",
    difficulty: "easy",
    title: "Atomic radius trend",
    prompt: "Which diagram shows the correct atomic radius trend?",
    content: {
      type: "visual",
      left: { componentId: "AtomicRadiusCorrectTrend" },
      right: { componentId: "AtomicRadiusWrongTrend" },
    },
    correctSide: "left",
    explanationCorrect:
      "Atomic radius increases going down a group (more electron shells) and decreases going left to right across a period (increasing nuclear charge pulls electrons closer). Cesium and francium have the largest atomic radii among naturally occurring elements.",
    explanationWrong:
      "This diagram reverses the trend by showing radius increasing upward and to the right. Adding protons without adding new shells pulls electrons inward, so atoms get smaller across a period from left to right.",
    sourceUrl: "https://en.wikipedia.org/wiki/Atomic_radius",
    sourceLabel: "Wikipedia: Atomic radius",
  },
  {
    id: "pt-003",
    category: "periodic-trends",
    difficulty: "medium",
    title: "Ionization energy trend",
    prompt: "Which diagram shows the correct ionization energy trend?",
    content: {
      type: "visual",
      left: { componentId: "IonizationEnergyCorrect" },
      right: { componentId: "IonizationEnergyWrong" },
    },
    correctSide: "left",
    explanationCorrect:
      "First ionization energy increases from left to right (stronger nuclear attraction) and from bottom to top (valence electrons closer to the nucleus). Noble gases and halogens have the highest ionization energies in each period.",
    explanationWrong:
      "This diagram incorrectly shows ionization energy increasing downward and to the left. Larger atoms hold their outermost electrons more loosely because of increased shielding and greater distance from the nucleus.",
    sourceUrl: "https://en.wikipedia.org/wiki/Ionization_energy",
    sourceLabel: "Wikipedia: Ionization energy",
  },
  {
    id: "pt-004",
    category: "periodic-trends",
    difficulty: "medium",
    title: "Electron affinity trend",
    prompt: "Which diagram shows the correct electron affinity trend?",
    content: {
      type: "visual",
      left: { componentId: "ElectronAffinityCorrect" },
      right: { componentId: "ElectronAffinityWrong" },
    },
    correctSide: "left",
    explanationCorrect:
      "Electron affinity generally becomes more exothermic (more negative) toward the upper right of the periodic table. Halogens have the highest electron affinities because adding one electron completes their valence shell. Chlorine has the most exothermic electron affinity at -349 kJ/mol.",
    explanationWrong:
      "This diagram incorrectly shows electron affinity increasing toward the lower left. Elements in the lower left are metals that tend to lose electrons rather than gain them, giving them low or even positive (endothermic) electron affinities.",
    sourceUrl: "https://en.wikipedia.org/wiki/Electron_affinity",
    sourceLabel: "Wikipedia: Electron affinity",
  },
];
