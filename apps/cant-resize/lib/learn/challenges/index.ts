import type { Challenge } from "../types";
import { mediaQueryChallenges } from "./media-queries";
import { containerQueryChallenges } from "./container-queries";
import { fluidTypographyChallenges } from "./fluid-typography";
import { viewportUnitChallenges } from "./viewport-units";
import { flexboxPatternChallenges } from "./flexbox-patterns";
import { gridPatternChallenges } from "./grid-patterns";
import { responsiveSpacingChallenges } from "./responsive-spacing";
import { overflowHandlingChallenges } from "./overflow-handling";
import { breakpointHooksChallenges } from "./breakpoint-hooks";
import { responsivePropsChallenges } from "./responsive-props";
import { conditionalRenderingChallenges } from "./conditional-rendering";
import { responsiveImageChallenges } from "./responsive-images";
import { muiResponsiveChallenges } from "./mui-responsive";
import { tailwindResponsiveChallenges } from "./tailwind-responsive";
import { commonMistakeChallenges } from "./common-mistakes";
import { testingResponsiveChallenges } from "./testing-responsive";

/**
 * All challenges, combined from per-category modules.
 *
 * To add a new challenge, find the relevant category file in this directory
 * and append your challenge to its array.
 */
export const challenges: Challenge[] = [
  ...mediaQueryChallenges,
  ...containerQueryChallenges,
  ...fluidTypographyChallenges,
  ...viewportUnitChallenges,
  ...flexboxPatternChallenges,
  ...gridPatternChallenges,
  ...responsiveSpacingChallenges,
  ...overflowHandlingChallenges,
  ...breakpointHooksChallenges,
  ...responsivePropsChallenges,
  ...conditionalRenderingChallenges,
  ...responsiveImageChallenges,
  ...muiResponsiveChallenges,
  ...tailwindResponsiveChallenges,
  ...commonMistakeChallenges,
  ...testingResponsiveChallenges,
];
