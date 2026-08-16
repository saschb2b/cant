/**
 * Thin wrapper around Umami's `umami.track()` for type-safe custom events.
 *
 * @see https://umami.is/docs/tracker-functions
 */

import { createTracker } from "@cant/shared/lib";
import type { GameEventMap } from "@cant/shared/lib";

interface EventMap extends GameEventMap {
  "viewer-url-loaded": { url: string };
  "device-added": { device: string; width: number; height: number };
}

export const trackEvent = createTracker<EventMap>();
