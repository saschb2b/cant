export type Difficulty = "easy" | "medium" | "hard";

// ---------------------------------------------------------------------------
// Content-type variants
// ---------------------------------------------------------------------------

/** Code snippet comparison (syntax-highlighted via Shiki). */
export interface CodeContent {
  type: "code";
  left: string;
  right: string;
  lang?: string;
}

/** Static image comparison (e.g. UX screenshots). */
export interface ImageContent {
  type: "image";
  left: { src: string; alt?: string };
  right: { src: string; alt?: string };
}

/** Live rendered component comparison (references a component registry key). */
export interface VisualContent {
  type: "visual";
  left: { componentId: string };
  right: { componentId: string };
}

/** Data describing a single molecule for display. */
export interface MoleculeData {
  /** Display name of the molecule (e.g. "Benzene"). */
  name: string;
  /** Chemical formula using Unicode subscripts (e.g. "C₆H₆"). */
  formula: string;
  /** SMILES notation for 2D structure rendering. */
  smiles?: string;
  /** Key-value properties shown below the structure (e.g. { "pKa": "4.75" }). */
  properties?: Record<string, string>;
}

/** Chemical molecule comparison (two molecules side by side). */
export interface MoleculeContent {
  type: "molecule";
  left: MoleculeData;
  right: MoleculeData;
}

/** All supported content shapes. */
export type ChallengeContent =
  | CodeContent
  | ImageContent
  | VisualContent
  | MoleculeContent;

// ---------------------------------------------------------------------------
// Base challenge
// ---------------------------------------------------------------------------

/**
 * Base challenge type used by shared game components.
 *
 * The `content` field is a discriminated union on `content.type`:
 * - `"code"`   : two code snippets, syntax-highlighted via Shiki
 * - `"image"`  : two static images (UX screenshots, diagrams)
 * - `"visual"` : two live React components from a registry
 *
 * `correctSide` indicates which side of `content` is the better option.
 * In game mode, sides are randomized at runtime.
 */
export interface BaseChallenge<Category extends string = string> {
  id: string;
  title: string;
  /** Question shown as the game prompt, e.g. "Which molecule is the stronger base?" */
  prompt: string;
  category: Category;
  difficulty: Difficulty;
  content: ChallengeContent;
  correctSide: "left" | "right";
  /** Explanation shown when the user picks correctly (or in learn mode). */
  explanationCorrect: string;
  /** Explanation shown when the user picks incorrectly. */
  explanationWrong: string;
  sourceUrl: string;
  sourceLabel: string;
}

/** Snapshot of the current game state. */
export interface GameState<T extends BaseChallenge = BaseChallenge> {
  challenges: T[];
  currentIndex: number;
  score: number;
  streak: number;
  bestStreak: number;
  answers: Record<
    string,
    { result: "correct" | "wrong"; side: "left" | "right" }
  >;
  reviewIndex: number | null;
  isFinished: boolean;
  startedAt: number;
  finishedAt: number | null;
  /** Accumulated thinking time in seconds (only counts time spent deciding). */
  thinkingTimeSec: number;
  seed: string;
  gameType: "daily" | "weekly" | "custom";
}
