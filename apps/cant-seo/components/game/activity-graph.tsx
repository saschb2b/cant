"use client";

import { ActivityGraph as SharedActivityGraph } from "@cant/shared/components/game";
import { getActivityGrid } from "@/lib/game/activity";

export function ActivityGraph() {
  return <SharedActivityGraph getActivityGrid={getActivityGrid} />;
}
