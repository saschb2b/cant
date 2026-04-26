import type { BaseChallenge } from "../../game/types";

import { bugsSpikesTasksChallenges } from "./bugs-spikes-tasks";
import { connextraTemplateChallenges } from "./connextra-template";
import { epicStoryTaskChallenges } from "./epic-story-task";
import { storyVsBraindumpChallenges } from "./story-vs-braindump";

export {
  bugsSpikesTasksChallenges,
  connextraTemplateChallenges,
  epicStoryTaskChallenges,
  storyVsBraindumpChallenges,
};

export const challenges: BaseChallenge[] = [
  ...epicStoryTaskChallenges,
  ...storyVsBraindumpChallenges,
  ...connextraTemplateChallenges,
  ...bugsSpikesTasksChallenges,
];
