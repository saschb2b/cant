import type { BaseChallenge } from "../../game/types";

import { acceptanceCriteriaChallenges } from "./acceptance-criteria";
import { bugsSpikesTasksChallenges } from "./bugs-spikes-tasks";
import { ceremoniesChallenges } from "./ceremonies";
import { connextraTemplateChallenges } from "./connextra-template";
import { definitionOfDoneChallenges } from "./definition-of-done";
import { definitionOfReadyChallenges } from "./definition-of-ready";
import { epicStoryTaskChallenges } from "./epic-story-task";
import { estimationRitualsChallenges } from "./estimation-rituals";
import { investChallenges } from "./invest";
import { prioritizationChallenges } from "./prioritization";
import { splittingPatternsChallenges } from "./splitting-patterns";
import { splittingVerticalChallenges } from "./splitting-vertical";
import { storyPointsChallenges } from "./story-points";
import { storyVsBraindumpChallenges } from "./story-vs-braindump";
import { teamFlowChallenges } from "./team-flow";

export {
  acceptanceCriteriaChallenges,
  bugsSpikesTasksChallenges,
  ceremoniesChallenges,
  connextraTemplateChallenges,
  definitionOfDoneChallenges,
  definitionOfReadyChallenges,
  epicStoryTaskChallenges,
  estimationRitualsChallenges,
  investChallenges,
  prioritizationChallenges,
  splittingPatternsChallenges,
  splittingVerticalChallenges,
  storyPointsChallenges,
  storyVsBraindumpChallenges,
  teamFlowChallenges,
};

export const challenges: BaseChallenge[] = [
  ...epicStoryTaskChallenges,
  ...storyVsBraindumpChallenges,
  ...connextraTemplateChallenges,
  ...bugsSpikesTasksChallenges,
  ...investChallenges,
  ...acceptanceCriteriaChallenges,
  ...definitionOfReadyChallenges,
  ...definitionOfDoneChallenges,
  ...storyPointsChallenges,
  ...estimationRitualsChallenges,
  ...splittingVerticalChallenges,
  ...splittingPatternsChallenges,
  ...prioritizationChallenges,
  ...teamFlowChallenges,
  ...ceremoniesChallenges,
];
