import { createTracker } from "@cant/shared/lib";

interface NotFoundVisitedData {
  path: string;
}

interface ContributeClickedData {
  location: string;
}

interface EventMap {
  "404-visited": NotFoundVisitedData;
  "contribute-clicked": ContributeClickedData;
}

export const trackEvent = createTracker<EventMap>();
