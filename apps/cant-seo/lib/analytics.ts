/**
 * Thin wrapper around Umami's `umami.track()` for type-safe custom events.
 *
 * @see https://umami.is/docs/tracker-functions
 */

import { createTracker } from "@cant/shared/lib";
import type { GameEventMap } from "@cant/shared/lib";

interface EventMap extends GameEventMap {
  "inspector-url-submitted": { url: string };
  "inspector-preview-copied": { platform: string; url: string };
}

export const trackEvent = createTracker<EventMap>();
