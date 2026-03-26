/** Difficulty tier for sorting and (future) game mode. */
export type Difficulty = "easy" | "medium" | "hard";

/** Category tag for grouping and filtering challenges. */
export type ChallengeCategory =
  | "media-queries"
  | "container-queries"
  | "fluid-typography"
  | "viewport-units"
  | "flexbox-patterns"
  | "grid-patterns"
  | "responsive-spacing"
  | "overflow-handling"
  | "breakpoint-hooks"
  | "responsive-props"
  | "conditional-rendering"
  | "responsive-images"
  | "mui-responsive"
  | "tailwind-responsive"
  | "common-mistakes"
  | "testing-responsive";

/** The language used for syntax highlighting a challenge's code. */
export type CodeLanguage = "tsx" | "css";

/**
 * A single responsive-design challenge.
 *
 * Each challenge shows a fragile/wrong approach (`badCode`) next to
 * the resilient/correct approach (`goodCode`) with an explanation.
 */
export interface Challenge {
  /** Unique identifier, prefixed by category abbreviation (e.g. "mq-001"). */
  id: string;
  category: ChallengeCategory;
  difficulty: Difficulty;
  /** Short title shown above the code panels. */
  title: string;
  /** The "bad" code snippet. */
  badCode: string;
  /** The "good" code snippet. */
  goodCode: string;
  /** Language for syntax highlighting (defaults to "tsx"). */
  lang?: CodeLanguage;
  /** Which side the good code appears on. Randomized at render in game mode. */
  correctSide: "left" | "right";
  /** Explanation shown when the user picks correctly (or in learn mode). */
  explanationCorrect: string;
  /** Explanation shown when the user picks incorrectly. */
  explanationWrong: string;
  /** URL to an authoritative source for learning more. */
  sourceUrl: string;
  /** Display label for the source link. */
  sourceLabel: string;
}
