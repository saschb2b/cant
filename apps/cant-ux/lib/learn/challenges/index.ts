import type { Challenge } from "../types";
import { typographyChallenges } from "./typography";
import { spacingChallenges } from "./spacing";
import { colorChallenges } from "./color";
import { hierarchyChallenges } from "./hierarchy";
import { layoutChallenges } from "./layout";
import { formsChallenges } from "./forms";
import { feedbackChallenges } from "./feedback";
import { navigationChallenges } from "./navigation";
import { accessibilityChallenges } from "./accessibility";
import { microInteractionsChallenges } from "./micro-interactions";
import { contentCopyChallenges } from "./content-copy";
import { dataDisplayChallenges } from "./data-display";
import { modalsOverlaysChallenges } from "./modals-overlays";
import { listsCardsChallenges } from "./lists-cards";
import { iconsImageryChallenges } from "./icons-imagery";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...typographyChallenges,
  ...spacingChallenges,
  ...colorChallenges,
  ...hierarchyChallenges,
  ...layoutChallenges,
  ...formsChallenges,
  ...feedbackChallenges,
  ...navigationChallenges,
  ...accessibilityChallenges,
  ...microInteractionsChallenges,
  ...contentCopyChallenges,
  ...dataDisplayChallenges,
  ...modalsOverlaysChallenges,
  ...listsCardsChallenges,
  ...iconsImageryChallenges,
];
