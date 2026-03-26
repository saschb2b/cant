"use client";

import { createContext, useContext } from "react";

type TrackEventFn = (event: string, data: Record<string, unknown>) => void;

const AnalyticsContext = createContext<TrackEventFn>(() => {
  // No-op default — analytics are optional
});

export const AnalyticsProvider = AnalyticsContext.Provider;

export function useTrackEvent(): TrackEventFn {
  return useContext(AnalyticsContext);
}
