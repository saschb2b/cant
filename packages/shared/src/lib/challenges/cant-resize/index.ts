import type { BaseChallenge } from "../../game/types";

import { breakpointHooksChallenges } from "./breakpoint-hooks";
import { commonMistakeChallenges } from "./common-mistakes";
import { conditionalRenderingChallenges } from "./conditional-rendering";
import { containerQueryChallenges } from "./container-queries";
import { flexboxPatternChallenges } from "./flexbox-patterns";
import { fluidTypographyChallenges } from "./fluid-typography";
import { gridPatternChallenges } from "./grid-patterns";
import { mediaQueryChallenges } from "./media-queries";
import { muiResponsiveChallenges } from "./mui-responsive";
import { overflowHandlingChallenges } from "./overflow-handling";
import { responsiveImageChallenges } from "./responsive-images";
import { responsivePropsChallenges } from "./responsive-props";
import { responsiveSpacingChallenges } from "./responsive-spacing";
import { tailwindResponsiveChallenges } from "./tailwind-responsive";
import { testingResponsiveChallenges } from "./testing-responsive";
import { viewportUnitChallenges } from "./viewport-units";

export {
  breakpointHooksChallenges,
  commonMistakeChallenges,
  conditionalRenderingChallenges,
  containerQueryChallenges,
  flexboxPatternChallenges,
  fluidTypographyChallenges,
  gridPatternChallenges,
  mediaQueryChallenges,
  muiResponsiveChallenges,
  overflowHandlingChallenges,
  responsiveImageChallenges,
  responsivePropsChallenges,
  responsiveSpacingChallenges,
  tailwindResponsiveChallenges,
  testingResponsiveChallenges,
  viewportUnitChallenges,
};

export const challenges: BaseChallenge[] = [
  ...breakpointHooksChallenges,
  ...commonMistakeChallenges,
  ...conditionalRenderingChallenges,
  ...containerQueryChallenges,
  ...flexboxPatternChallenges,
  ...fluidTypographyChallenges,
  ...gridPatternChallenges,
  ...mediaQueryChallenges,
  ...muiResponsiveChallenges,
  ...overflowHandlingChallenges,
  ...responsiveImageChallenges,
  ...responsivePropsChallenges,
  ...responsiveSpacingChallenges,
  ...tailwindResponsiveChallenges,
  ...testingResponsiveChallenges,
  ...viewportUnitChallenges,
];
