/**
 * Re-exports challenge types from the learn module and adds game-specific
 * state types used by the /play game mode.
 */

import type { Challenge } from "../learn/types";
import { type GameState as SharedGameState } from "@cant/shared/lib/game";

export type { Challenge, ChallengeCategory, Difficulty } from "../learn/types";

/** Snapshot of the current game state. */
export type GameState = SharedGameState<Challenge>;
