import { createActivityStore } from "@cant/shared/lib/game";

const store = createActivityStore("cant-game:activity");
export const { recordActivity, getActivity, getActivityGrid } = store;
export type { ActivityMap } from "@cant/shared/lib/game";
