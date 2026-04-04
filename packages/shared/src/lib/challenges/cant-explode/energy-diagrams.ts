import type { BaseChallenge } from "../../game/types";

export const energyDiagramsChallenges: BaseChallenge[] = [
  {
    id: "ed-001",
    category: "energy-diagrams",
    difficulty: "easy",
    title: "Exothermic reaction profile",
    prompt: "Which energy diagram represents an exothermic reaction?",
    content: {
      type: "visual",
      left: { componentId: "ExothermicProfile" },
      right: { componentId: "EndothermicProfile" },
    },
    correctSide: "left",
    explanationCorrect:
      "An exothermic reaction has products at lower energy than reactants, giving a negative enthalpy change. Energy is released to the surroundings, often as heat. Combustion reactions and many neutralization reactions are exothermic.",
    explanationWrong:
      "An endothermic reaction has products at higher energy than reactants, requiring continuous energy input. The positive enthalpy change means the system absorbs heat from the surroundings. Photosynthesis and thermal decomposition are endothermic processes.",
    sourceUrl: "https://en.wikipedia.org/wiki/Exothermic_reaction",
    sourceLabel: "Wikipedia: Exothermic reaction",
  },
  {
    id: "ed-002",
    category: "energy-diagrams",
    difficulty: "easy",
    title: "Effect of a catalyst",
    prompt: "Which energy diagram shows the catalyzed reaction?",
    content: {
      type: "visual",
      left: { componentId: "CatalyzedReaction" },
      right: { componentId: "UncatalyzedReaction" },
    },
    correctSide: "left",
    explanationCorrect:
      "A catalyst lowers the activation energy by providing an alternative reaction pathway. It does not change the overall thermodynamics (same reactant and product energies) but increases the reaction rate by making the transition state more accessible.",
    explanationWrong:
      "The uncatalyzed reaction has a higher activation energy barrier, meaning fewer molecules have sufficient energy to react at a given temperature. This results in a slower reaction rate, not a different equilibrium position.",
    sourceUrl: "https://en.wikipedia.org/wiki/Catalysis",
    sourceLabel: "Wikipedia: Catalysis",
  },
  {
    id: "ed-003",
    category: "energy-diagrams",
    difficulty: "hard",
    title: "SN1 vs SN2 mechanism",
    prompt: "Which energy profile corresponds to an SN1 reaction?",
    content: {
      type: "visual",
      left: { componentId: "SN1EnergyProfile" },
      right: { componentId: "SN2EnergyProfile" },
    },
    correctSide: "left",
    explanationCorrect:
      "The SN1 mechanism is a two-step process with a carbocation intermediate. The energy diagram shows two humps (two transition states) separated by an energy minimum (the intermediate). The first step, ionization, is typically rate-determining.",
    explanationWrong:
      "The SN2 mechanism is a one-step concerted process with a single transition state. The nucleophile attacks as the leaving group departs simultaneously, producing only one energy maximum. No intermediate is formed.",
    sourceUrl: "https://en.wikipedia.org/wiki/SN1_reaction",
    sourceLabel: "Wikipedia: SN1 reaction",
  },
  {
    id: "ed-004",
    category: "energy-diagrams",
    difficulty: "medium",
    title: "Activation energy and reaction rate",
    prompt: "Which reaction proceeds faster at room temperature?",
    content: {
      type: "visual",
      left: { componentId: "LowActivationEnergy" },
      right: { componentId: "HighActivationEnergy" },
    },
    correctSide: "left",
    explanationCorrect:
      "A lower activation energy means more molecules have sufficient kinetic energy to overcome the barrier at any given temperature. According to the Arrhenius equation, the rate constant increases exponentially as activation energy decreases.",
    explanationWrong:
      "A high activation energy means only a small fraction of molecular collisions have enough energy to reach the transition state. This results in a slow reaction rate, even if the overall reaction is thermodynamically favorable.",
    sourceUrl: "https://en.wikipedia.org/wiki/Activation_energy",
    sourceLabel: "Wikipedia: Activation energy",
  },
];
