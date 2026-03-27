"use client";

import type { ReactNode } from "react";
import { AnalyticsProvider } from "../lib/analytics-context";

interface AnalyticsProviderWrapperProps {
  children: ReactNode;
}

/**
 * Client-side analytics provider that reads umami.track from window.
 * Use this in layout.tsx to avoid passing functions across server/client boundary.
 */
export function AnalyticsProviderWrapper({
  children,
}: AnalyticsProviderWrapperProps) {
  function trackEvent(event: string, data: Record<string, unknown>) {
    window.umami?.track(event, data);
  }

  return <AnalyticsProvider value={trackEvent}>{children}</AnalyticsProvider>;
}
