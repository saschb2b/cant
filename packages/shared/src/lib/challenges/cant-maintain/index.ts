import type { BaseChallenge } from "../../game/types";

import { accessibilityPropsChallenges } from "./accessibility-props";
import { booleanNamingChallenges } from "./boolean-naming";
import { callbackNamingChallenges } from "./callback-naming";
import { childrenPatternChallenges } from "./children-pattern";
import { componentNamingChallenges } from "./component-naming";
import { controlledUncontrolledChallenges } from "./controlled-uncontrolled";
import { defaultValuesChallenges } from "./default-values";
import { discriminatedUnionsChallenges } from "./discriminated-unions";
import { enumeratedVariantsChallenges } from "./enumerated-variants";
import { extendingHtmlChallenges } from "./extending-html";
import { genericPropsChallenges } from "./generic-props";
import { jsdocChallenges } from "./jsdoc";
import { propOrganizationChallenges } from "./prop-organization";
import { propSpecificityChallenges } from "./prop-specificity";
import { refForwardingChallenges } from "./ref-forwarding";
import { renderPropsChallenges } from "./render-props";
import { serverComponentPropsChallenges } from "./server-component-props";
import { stylingApiChallenges } from "./styling-api";

export {
  accessibilityPropsChallenges,
  booleanNamingChallenges,
  callbackNamingChallenges,
  childrenPatternChallenges,
  componentNamingChallenges,
  controlledUncontrolledChallenges,
  defaultValuesChallenges,
  discriminatedUnionsChallenges,
  enumeratedVariantsChallenges,
  extendingHtmlChallenges,
  genericPropsChallenges,
  jsdocChallenges,
  propOrganizationChallenges,
  propSpecificityChallenges,
  refForwardingChallenges,
  renderPropsChallenges,
  serverComponentPropsChallenges,
  stylingApiChallenges,
};

export const challenges: BaseChallenge[] = [
  ...accessibilityPropsChallenges,
  ...booleanNamingChallenges,
  ...callbackNamingChallenges,
  ...childrenPatternChallenges,
  ...componentNamingChallenges,
  ...controlledUncontrolledChallenges,
  ...defaultValuesChallenges,
  ...discriminatedUnionsChallenges,
  ...enumeratedVariantsChallenges,
  ...extendingHtmlChallenges,
  ...genericPropsChallenges,
  ...jsdocChallenges,
  ...propOrganizationChallenges,
  ...propSpecificityChallenges,
  ...refForwardingChallenges,
  ...renderPropsChallenges,
  ...serverComponentPropsChallenges,
  ...stylingApiChallenges,
];
