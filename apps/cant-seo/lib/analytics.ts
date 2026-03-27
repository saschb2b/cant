/**
 * Thin wrapper around Umami's `umami.track()` for type-safe custom events.
 *
 * @see https://umami.is/docs/tracker-functions
 */

import { createTracker } from "@cant/shared/lib";

interface SearchOpenedData {
  trigger: "hotkey" | "button";
}

interface SearchSelectedData {
  query: string;
  selectedTitle: string;
  selectedHref: string;
}

interface SourceLinkClickedData {
  challengeId: string;
  category: string;
  label: string;
}

interface InspectorUrlSubmittedData {
  url: string;
}

interface InspectorPreviewCopiedData {
  platform: string;
  url: string;
}

interface NotFoundVisitedData {
  path: string;
}

interface GameStartedData {
  seed: string;
  type: string;
  categories: number;
}

interface ChallengeAnsweredData {
  challengeId: string;
  category: string;
  difficulty: string;
  result: string;
  timeSec: number;
}

interface GameFinishedData {
  score: number;
  total: number;
  bestStreak: number;
  durationSec: number;
  seed: string;
  gameType: string;
}

interface GameRestartedData {
  previousScore: number;
  previousTotal: number;
}

interface GameSharedData {
  score: number;
  total: number;
}

interface HistoryReplayedData {
  seed: string;
  previousBestScore: number;
  plays: number;
}

interface LearnLinkClickedData {
  challengeId: string;
  category: string;
  label: string;
}

interface ContributeClickedData {
  location: string;
}

interface BuyMeCoffeeClickedData {
  location: string;
}

interface EventMap {
  "search-opened": SearchOpenedData;
  "search-selected": SearchSelectedData;
  "source-link-clicked": SourceLinkClickedData;
  "inspector-url-submitted": InspectorUrlSubmittedData;
  "inspector-preview-copied": InspectorPreviewCopiedData;
  "404-visited": NotFoundVisitedData;
  "game-started": GameStartedData;
  "challenge-answered": ChallengeAnsweredData;
  "game-finished": GameFinishedData;
  "game-restarted": GameRestartedData;
  "game-shared": GameSharedData;
  "history-replayed": HistoryReplayedData;
  "learn-link-clicked": LearnLinkClickedData;
  "contribute-clicked": ContributeClickedData;
  "buymeacoffee-clicked": BuyMeCoffeeClickedData;
}

export const trackEvent = createTracker<EventMap>();
