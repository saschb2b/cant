/**
 * Event payloads shared by every app's Umami tracker.
 *
 * Apps compose these with their own events and pass the result to
 * `createTracker`:
 *
 * ```ts
 * import { createTracker } from "@cant/shared/lib";
 * import type { GameEventMap } from "@cant/shared/lib/analytics-events";
 *
 * interface AppEventMap extends GameEventMap {
 *   "inspector-url-submitted": { url: string };
 * }
 *
 * export const trackEvent = createTracker<AppEventMap>();
 * ```
 */

/** Which of the three round types a game session was. */
export type GameTypeEvent = "daily" | "weekly" | "custom";

/** Events every app fires, including apps with no game (cant-hub). */
export interface CoreEventMap {
  "404-visited": { path: string };
  "contribute-clicked": { location: string };
}

/** Everything the game and learn surfaces fire, on top of the core events. */
export interface GameEventMap extends CoreEventMap {
  "search-opened": { trigger: "hotkey" | "button" };
  "search-selected": {
    query: string;
    selectedTitle: string;
    selectedHref: string;
  };
  "source-link-clicked": {
    challengeId: string;
    category: string;
    label: string;
  };
  "learn-link-clicked": {
    challengeId: string;
    category: string;
    label: string;
  };
  "game-started": {
    seed: string;
    type: GameTypeEvent;
    categories: number;
  };
  "challenge-answered": {
    challengeId: string;
    category: string;
    difficulty: string;
    result: "correct" | "wrong";
    timeSec: number;
  };
  "game-finished": {
    score: number;
    total: number;
    bestStreak: number;
    durationSec: number;
    seed: string;
    gameType: GameTypeEvent;
  };
  "game-restarted": { previousScore: number; previousTotal: number };
  "game-shared": { score: number; total: number };
  "history-replayed": {
    seed: string;
    previousBestScore: number;
    plays: number;
  };
  /** Fired when a player clears their locally stored challenge progress. */
  "progress-reset": { completed: number };
  "buymeacoffee-clicked": { location: string };
}
