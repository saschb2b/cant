import type { BaseChallenge } from "../../game/types";

export const functionalGroupsChallenges: BaseChallenge[] = [
  {
    id: "fg-001",
    category: "functional-groups",
    difficulty: "easy",
    title: "Reactivity with NaOH",
    prompt: "Which compound reacts more readily with NaOH?",
    content: {
      type: "visual",
      left: { componentId: "CarboxylicAcidStructure" },
      right: { componentId: "AlcoholStructure" },
    },
    correctSide: "left",
    explanationCorrect:
      "Carboxylic acids react readily with NaOH through a straightforward acid-base neutralization. Acetic acid (pKa 4.76) is acidic enough to donate a proton to the strong base hydroxide, forming sodium acetate and water.",
    explanationWrong:
      "Ethanol (pKa ~16) is far too weak an acid to react appreciably with NaOH under normal conditions. You would need a much stronger base, such as sodium metal or sodium hydride, to deprotonate an alcohol.",
    sourceUrl: "https://en.wikipedia.org/wiki/Carboxylic_acid#Reactions",
    sourceLabel: "Wikipedia: Carboxylic acid reactions",
  },
  {
    id: "fg-002",
    category: "functional-groups",
    difficulty: "medium",
    title: "Nucleophilic addition susceptibility",
    prompt: "Which carbonyl is more reactive with nucleophiles?",
    content: {
      type: "visual",
      left: { componentId: "AldehydeStructure" },
      right: { componentId: "KetoneStructure" },
    },
    correctSide: "left",
    explanationCorrect:
      "Aldehydes are more susceptible to nucleophilic addition than ketones for two reasons. First, the carbonyl carbon has less steric hindrance with only one alkyl substituent. Second, the single alkyl group donates less electron density to the carbonyl carbon, keeping it more electrophilic.",
    explanationWrong:
      "Ketones are less reactive toward nucleophilic addition because the two alkyl groups create steric crowding around the carbonyl carbon. Additionally, the two electron-donating alkyl groups partially reduce the positive character of the carbonyl carbon.",
    sourceUrl:
      "https://en.wikipedia.org/wiki/Nucleophilic_addition#Aldehydes_and_ketones",
    sourceLabel: "Wikipedia: Nucleophilic addition",
  },
  {
    id: "fg-003",
    category: "functional-groups",
    difficulty: "medium",
    title: "Basicity of nitrogen compounds",
    prompt: "Which nitrogen compound is a stronger base?",
    content: {
      type: "visual",
      left: { componentId: "AmineStructure" },
      right: { componentId: "AmideStructure" },
    },
    correctSide: "left",
    explanationCorrect:
      "Primary amines are much more basic than amides. In methylamine, the nitrogen lone pair is freely available to accept a proton. The pKb of 3.36 makes methylamine a moderately strong base.",
    explanationWrong:
      "Amides are extremely weak bases (pKb ~14) because the nitrogen lone pair is delocalized into the adjacent carbonyl group through resonance. This resonance stabilization makes the lone pair far less available for protonation.",
    sourceUrl: "https://en.wikipedia.org/wiki/Amide#Basicity",
    sourceLabel: "Wikipedia: Amide, Basicity",
  },
];
