import { createActivityStore } from "@cant/shared/lib/game";

const store = createActivityStore("cant-explode:activity");
export const { recordActivity, getActivity, getActivityGrid } = store;
export type { ActivityMap } from "@cant/shared/lib/game";
