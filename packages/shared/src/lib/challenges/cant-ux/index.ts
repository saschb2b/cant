import type { BaseChallenge } from "../../game/types";

import { accessibilityChallenges } from "./accessibility";
import { colorChallenges } from "./color";
import { contentCopyChallenges } from "./content-copy";
import { dataDisplayChallenges } from "./data-display";
import { feedbackChallenges } from "./feedback";
import { formsChallenges } from "./forms";
import { hierarchyChallenges } from "./hierarchy";
import { iconsImageryChallenges } from "./icons-imagery";
import { layoutChallenges } from "./layout";
import { listsCardsChallenges } from "./lists-cards";
import { microInteractionsChallenges } from "./micro-interactions";
import { modalsOverlaysChallenges } from "./modals-overlays";
import { navigationChallenges } from "./navigation";
import { spacingChallenges } from "./spacing";
import { typographyChallenges } from "./typography";

export {
  accessibilityChallenges,
  colorChallenges,
  contentCopyChallenges,
  dataDisplayChallenges,
  feedbackChallenges,
  formsChallenges,
  hierarchyChallenges,
  iconsImageryChallenges,
  layoutChallenges,
  listsCardsChallenges,
  microInteractionsChallenges,
  modalsOverlaysChallenges,
  navigationChallenges,
  spacingChallenges,
  typographyChallenges,
};

export const challenges: BaseChallenge[] = [
  ...accessibilityChallenges,
  ...colorChallenges,
  ...contentCopyChallenges,
  ...dataDisplayChallenges,
  ...feedbackChallenges,
  ...formsChallenges,
  ...hierarchyChallenges,
  ...iconsImageryChallenges,
  ...layoutChallenges,
  ...listsCardsChallenges,
  ...microInteractionsChallenges,
  ...modalsOverlaysChallenges,
  ...navigationChallenges,
  ...spacingChallenges,
  ...typographyChallenges,
];
