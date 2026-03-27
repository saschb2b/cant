import { createTracker } from "@cant/shared/lib";

interface NotFoundVisitedData {
  path: string;
}

interface EventMap {
  "404-visited": NotFoundVisitedData;
}

export const trackEvent = createTracker<EventMap>();
