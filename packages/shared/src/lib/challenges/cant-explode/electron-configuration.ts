import type { BaseChallenge } from "../../game/types";

export const electronConfigurationChallenges: BaseChallenge[] = [
  {
    id: "ec-001",
    category: "electron-configuration",
    difficulty: "easy",
    title: "Nitrogen electron configuration",
    prompt: "Which orbital diagram correctly shows nitrogen's 2p electrons?",
    content: {
      type: "visual",
      left: { componentId: "NitrogenCorrectConfig" },
      right: { componentId: "NitrogenWrongConfig" },
    },
    correctSide: "left",
    explanationCorrect:
      "Hund's rule states that electrons fill degenerate orbitals singly before pairing. Nitrogen's three 2p electrons each occupy a separate p orbital with parallel spins, maximizing exchange energy and minimizing electron-electron repulsion.",
    explanationWrong:
      "Pairing two electrons in one 2p orbital while leaving another empty violates Hund's rule. This configuration has higher energy because paired electrons in the same orbital experience greater repulsion than electrons in separate orbitals.",
    sourceUrl: "https://en.wikipedia.org/wiki/Hund%27s_rules",
    sourceLabel: "Wikipedia: Hund's rules",
  },
  {
    id: "ec-002",
    category: "electron-configuration",
    difficulty: "hard",
    title: "Chromium electron configuration",
    prompt: "Which electron configuration is correct for chromium?",
    content: {
      type: "visual",
      left: { componentId: "ChromiumCorrectConfig" },
      right: { componentId: "ChromiumWrongConfig" },
    },
    correctSide: "left",
    explanationCorrect:
      "Chromium adopts [Ar] 4s1 3d5 instead of the expected [Ar] 4s2 3d4. A half-filled d subshell provides extra stability through maximized exchange energy. The energy gained from five unpaired d electrons outweighs the cost of leaving 4s half-filled.",
    explanationWrong:
      "The [Ar] 4s2 3d4 configuration follows the standard filling order but is not what chromium actually adopts. The extra exchange energy from having all five d orbitals singly occupied makes the 4s1 3d5 configuration about 8 kJ/mol more stable.",
    sourceUrl: "https://en.wikipedia.org/wiki/Chromium#Electron_configuration",
    sourceLabel: "Wikipedia: Chromium electron configuration",
  },
  {
    id: "ec-003",
    category: "electron-configuration",
    difficulty: "easy",
    title: "Oxygen electron configuration",
    prompt: "Which orbital diagram correctly shows oxygen's 2p electrons?",
    content: {
      type: "visual",
      left: { componentId: "OxygenCorrectConfig" },
      right: { componentId: "OxygenWrongConfig" },
    },
    correctSide: "left",
    explanationCorrect:
      "Oxygen has four 2p electrons. Following Hund's rule, the first three electrons fill each 2p orbital singly, and the fourth pairs with one of them. This gives a configuration of 2p with one paired and two unpaired electrons.",
    explanationWrong:
      "Filling two orbitals completely before starting the third violates Hund's rule. Electrons preferentially occupy empty orbitals before pairing because electron-electron repulsion within an orbital costs energy.",
    sourceUrl: "https://en.wikipedia.org/wiki/Hund%27s_rules",
    sourceLabel: "Wikipedia: Hund's rules",
  },
  {
    id: "ec-004",
    category: "electron-configuration",
    difficulty: "medium",
    title: "Iron electron configuration",
    prompt: "Which orbital diagram correctly shows iron's 3d electrons?",
    content: {
      type: "visual",
      left: { componentId: "IronCorrectConfig" },
      right: { componentId: "IronWrongConfig" },
    },
    correctSide: "left",
    explanationCorrect:
      "Iron ([Ar] 4s2 3d6) fills its five 3d orbitals singly first, then pairs the sixth electron in the first orbital. This gives four unpaired electrons, consistent with iron's observed paramagnetism and its common +2 and +3 oxidation states.",
    explanationWrong:
      "Filling three orbitals completely while leaving two empty violates Hund's rule. This arrangement would give only two unpaired electrons and predict weaker paramagnetism than what is experimentally observed for iron compounds.",
    sourceUrl: "https://en.wikipedia.org/wiki/Iron#Electron_configuration",
    sourceLabel: "Wikipedia: Iron electron configuration",
  },
];
