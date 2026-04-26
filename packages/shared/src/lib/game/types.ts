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

// ---------------------------------------------------------------------------
// Ticket content (cant-ticket)
// ---------------------------------------------------------------------------

/** Type of agile work item. Drives the accent color and icon in TicketCard. */
export type TicketKind =
  | "epic"
  | "story"
  | "task"
  | "subtask"
  | "bug"
  | "spike";

/** Status pill rendered in the card header. */
export type TicketStatus =
  | "backlog"
  | "ready"
  | "in-progress"
  | "review"
  | "done";

/** A single acceptance criterion. Either Given/When/Then or a free bullet. */
export type AcceptanceCriterion =
  | { kind: "gwt"; given: string; when: string; then: string }
  | { kind: "bullet"; text: string }
  /**
   * A note that *looks* like an AC in the ticket but is actually an
   * implementation detail. Rendered with a distinct style so the violation
   * is visible. Use for "AC tangled with implementation" challenges.
   */
  | { kind: "implementation-note"; text: string };

/** A reference to another ticket, e.g. a link or a child summary. */
export interface TicketRef {
  key?: string;
  type?: TicketKind;
  title: string;
}

/** Structured ticket data rendered by the shared TicketCard component. */
export interface TicketCardData {
  /** Issue key shown in the header, e.g. "AUTH-482". Optional. */
  key?: string;
  /** Work-item type. Drives accent color and icon. */
  type: TicketKind;
  /** Status pill. Optional. */
  status?: TicketStatus;
  /** Story points chip. Number, "?", or omitted. */
  points?: number | "?";
  /** One-line title. Required. */
  title: string;
  /** Inline labels rendered as small chips. */
  labels?: string[];
  /**
   * Connextra clauses, rendered as labeled fields. If any are set, the
   * "As a / I want / so that" block is shown. Use these *or* `description`,
   * not both, when the story uses the template.
   */
  asA?: string;
  iWant?: string;
  soThat?: string;
  /** Free-form description (markdown not supported, plain text only). */
  description?: string;
  /** Background context. Rendered as its own block under description. */
  context?: string;
  /** Acceptance criteria, rendered as Given/When/Then or bullets. */
  acceptanceCriteria?: AcceptanceCriterion[];
  /** Subtask titles, rendered as a small checklist inside the card. */
  subtasks?: string[];
  /** Out-of-scope note, rendered as a deemphasized line at the bottom. */
  outOfScope?: string;
  /** Children for Epic→Story breakdowns. Rendered as a tree of mini-cards. */
  children?: TicketRef[];
  /** Free-form note shown as a small grey block at the very bottom. */
  footer?: string;
}

/** Two ticket cards compared side by side. */
export interface TicketContent {
  type: "ticket";
  left: TicketCardData;
  right: TicketCardData;
}

/** All supported content shapes. */
export type ChallengeContent =
  | CodeContent
  | ImageContent
  | VisualContent
  | MoleculeContent
  | TicketContent;

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
