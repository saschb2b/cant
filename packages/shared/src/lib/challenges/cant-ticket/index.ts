import type { BaseChallenge } from "../../game/types";

import { epicStoryTaskChallenges } from "./epic-story-task";

export { epicStoryTaskChallenges };

export const challenges: BaseChallenge[] = [...epicStoryTaskChallenges];
