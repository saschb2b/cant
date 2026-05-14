"use client";

import type { ComponentType, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Difficulty, TicketCardData } from "../../lib/game/types";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Grow from "@mui/material/Grow";
import { ArrowLeft, ArrowRight } from "lucide-react";

// ---------------------------------------------------------------------------
// Minimum shape the Game component needs from a challenge
// ---------------------------------------------------------------------------

interface BaseChallenge {
  id: string;
  title: string;
  prompt: string;
  category: string;
  difficulty: Difficulty;
  content: { type: string };
  correctSide: "left" | "right";
  explanationCorrect: string;
  explanationWrong?: string;
  sourceUrl: string;
  sourceLabel: string;
}

// ---------------------------------------------------------------------------
// Content map: per-challenge pre-processed content keyed by challenge id
// ---------------------------------------------------------------------------

/** Pre-highlighted HTML for code challenges. */
export interface CodeChallengeEntry {
  type: "code";
  goodHtml: string;
  badHtml: string;
}

/** Image paths for image challenges. */
export interface ImageChallengeEntry {
  type: "image";
  goodImage: string;
  badImage: string;
  goodImageAlt?: string;
  badImageAlt?: string;
}

/** Component IDs for visual (live-rendered) challenges. */
export interface VisualChallengeEntry {
  type: "visual";
  goodComponentId: string;
  badComponentId: string;
}

/** Molecule data for chemistry challenges. */
export interface MoleculeChallengeEntry {
  type: "molecule";
  goodMolecule: {
    name: string;
    formula: string;
    smiles?: string;
    properties?: Record<string, string>;
  };
  badMolecule: {
    name: string;
    formula: string;
    smiles?: string;
    properties?: Record<string, string>;
  };
}

/** Ticket data for agile-ticket challenges (cant-ticket). */
export interface TicketChallengeEntry {
  type: "ticket";
  goodTicket: TicketCardData;
  badTicket: TicketCardData;
}

export type ContentMapEntry =
  | CodeChallengeEntry
  | ImageChallengeEntry
  | VisualChallengeEntry
  | MoleculeChallengeEntry
  | TicketChallengeEntry;

// ---------------------------------------------------------------------------
// Sub-component prop contracts
// ---------------------------------------------------------------------------

export interface CodePanelSlotProps {
  highlightedHtml: string;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export interface ImagePanelSlotProps {
  imageSrc: string;
  imageAlt: string;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export interface VisualPanelSlotProps {
  componentId: string;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export interface MoleculePanelSlotProps {
  molecule: {
    name: string;
    formula: string;
    smiles?: string;
    properties?: Record<string, string>;
  };
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export interface TicketPanelSlotProps {
  ticket: TicketCardData;
  label: string;
  isSelectable: boolean;
  onSelect: () => void;
  result?: "correct" | "wrong" | null;
  isSelected?: boolean;
}

export interface LobbySlotProps {
  onStart: (
    rawSeed: string,
    excludedCategories: Set<string>,
    gameType: "daily" | "weekly" | "custom",
  ) => void;
  defaultSeed?: string;
  defaultExcluded?: Set<string>;
}

export interface ResultsSlotProps<C extends BaseChallenge> {
  state: GameState<C>;
  onRetry: () => void;
  onNewGame: () => void;
}

export interface ExplanationSlotProps {
  isCorrect: boolean;
  explanationText: string;
  sourceUrl: string;
  sourceLabel: string;
  category: string;
  categoryLabel: string;
  challengeId: string;
  title?: string;
  githubUrl?: string;
}

// ---------------------------------------------------------------------------
// Game state shape
// ---------------------------------------------------------------------------

interface GameState<C extends BaseChallenge> {
  challenges: C[];
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
  thinkingTimeSec: number;
  seed: string;
  gameType: "daily" | "weekly" | "custom";
}

interface UseGameReturn<C extends BaseChallenge> {
  state: GameState<C> | null;
  currentChallenge: C | null;
  currentAnswer: {
    result: "correct" | "wrong";
    side: "left" | "right";
  } | null;
  currentDifficulty: Difficulty | null;
  totalChallenges: number;
  isReviewing: boolean;
  /** The challenge currently visible (current or reviewed). */
  displayChallenge: C | null;
  /** The user's answer for the displayed challenge, or null if unanswered. */
  displayAnswer: {
    result: "correct" | "wrong";
    side: "left" | "right";
  } | null;
  submitAnswer: (side: "left" | "right") => void;
  goToNext: () => void;
  restartGame: () => void;
  reviewQuestion: (index: number) => void;
  exitReview: () => void;
}

// ---------------------------------------------------------------------------
// Game component
// ---------------------------------------------------------------------------

export interface GameHeaderSlotProps {
  score: number;
  total: number;
  currentQuestion: number;
  streak: number;
  difficulty: Difficulty | null;
  questionResults: ("correct" | "wrong" | null)[];
  reviewIndex: number | null;
  onQuestionClick: (index: number) => void;
}

interface GameSlots<C extends BaseChallenge> {
  /** Code comparison panel (used for contentType "code" or when omitted). */
  codePanel: ComponentType<CodePanelSlotProps>;
  /** Image comparison panel (used for contentType "image"). Optional; only needed if the app has image challenges. */
  imagePanel?: ComponentType<ImagePanelSlotProps>;
  /** Live component panel (used for contentType "visual"). Optional; only needed if the app has visual challenges. */
  visualPanel?: ComponentType<VisualPanelSlotProps>;
  /** Molecule panel (used for contentType "molecule"). Optional; only needed if the app has chemistry challenges. */
  moleculePanel?: ComponentType<MoleculePanelSlotProps>;
  /** Ticket panel (used for contentType "ticket"). Optional; only needed if the app has agile-ticket challenges. */
  ticketPanel?: ComponentType<TicketPanelSlotProps>;
  /** Lobby/setup screen. */
  lobby: ComponentType<LobbySlotProps>;
  /** Results screen after game ends. */
  results: ComponentType<ResultsSlotProps<C>>;
  /** Post-answer explanation panel. */
  explanation: ComponentType<ExplanationSlotProps>;
  /** Score/progress header. */
  gameHeader: ComponentType<GameHeaderSlotProps>;
}

interface GameProps<C extends BaseChallenge> {
  challenges: C[];
  /**
   * Pre-processed content for each challenge, keyed by challenge id.
   *
   * - Code challenges: `{ type: "code", goodHtml, badHtml }`
   * - Image challenges: `{ type: "image", goodImage, badImage }`
   * - Visual challenges: `{ type: "visual", goodComponentId, badComponentId }`
   */
  contentMap?: Record<string, ContentMapEntry>;
  defaultSeed?: string;
  /** Category label map for the category chip. */
  categoryLabels: Record<string, string>;
  /** Repo URL, used by the explanation panel's "Suggest a fix" link. */
  githubUrl?: string;
  /** Hook that provides game state. */
  useGame: (
    challenges: C[],
    seed: string | null,
    excludedCategories: Set<string>,
    retryKey: number,
    gameType: "daily" | "weekly" | "custom",
  ) => UseGameReturn<C>;
  /** Seed generator function. */
  generateSeed: () => string;
  /** Injected sub-components for each game screen and UI element. */
  slots: GameSlots<C>;
  /**
   * When false, hides correct/wrong feedback on panels, suppresses the
   * explanation, and auto-advances to the next challenge after selection.
   * Used by screening assessments where candidates should not see answers.
   * @default true
   */
  showFeedback?: boolean;
  /** Called after each answer is submitted (e.g. to persist server-side). */
  onAnswerSubmit?: (challengeId: string, side: "left" | "right") => void;
  children?: ReactNode;
}

export function Game<C extends BaseChallenge>({
  challenges,
  contentMap = {},
  defaultSeed,
  categoryLabels,
  githubUrl,
  useGame: useGameHook,
  generateSeed: generateSeedFn,
  slots: {
    codePanel: CodePanelComponent,
    imagePanel: ImagePanelComponent,
    visualPanel: VisualPanelComponent,
    moleculePanel: MoleculePanelComponent,
    ticketPanel: TicketPanelComponent,
    lobby: LobbyComponent,
    results: ResultsComponent,
    explanation: ExplanationComponent,
    gameHeader: GameHeaderComponent,
  },
  showFeedback = true,
  onAnswerSubmit,
}: GameProps<C>) {
  const [activeSeed, setActiveSeed] = useState<string | null>(null);
  const [lobbySeed, setLobbySeed] = useState(defaultSeed);
  const [excludedCategories, setExcludedCategories] = useState(
    new Set<string>(),
  );
  const [retryKey, setRetryKey] = useState(0);
  const [gameType, setGameType] = useState<"daily" | "weekly" | "custom">(
    "custom",
  );

  const {
    state,
    currentChallenge,
    currentAnswer,
    currentDifficulty,
    totalChallenges,
    isReviewing,
    displayChallenge,
    displayAnswer,
    submitAnswer,
    goToNext,
    restartGame,
    reviewQuestion,
    exitReview,
  } = useGameHook(
    challenges,
    activeSeed,
    excludedCategories,
    retryKey,
    gameType,
  );

  const handleLobbyStart = useCallback(
    (
      seed: string,
      excluded: Set<string>,
      type: "daily" | "weekly" | "custom",
    ) => {
      setExcludedCategories(excluded);
      setGameType(type);
      setActiveSeed(seed || generateSeedFn());
    },
    [generateSeedFn],
  );

  const handleRetry = useCallback(() => {
    restartGame();
    setRetryKey((k) => k + 1);
  }, [restartGame]);

  const handleNewGame = useCallback(() => {
    restartGame();
    setActiveSeed(null);
    setLobbySeed(undefined);
  }, [restartGame]);

  const explanationRef = useRef<HTMLDivElement>(null);

  // Resolve per-side content based on contentType and correctSide
  const { leftContent, rightContent, resolvedContentType } = useMemo(() => {
    if (!displayChallenge)
      return {
        leftContent: null,
        rightContent: null,
        resolvedContentType: "code" as const,
      };

    const entry = contentMap[displayChallenge.id];
    if (!entry)
      return {
        leftContent: null,
        rightContent: null,
        resolvedContentType: "code" as const,
      };

    const isLeftCorrect = displayChallenge.correctSide === "left";

    switch (entry.type) {
      case "code": {
        return {
          leftContent: isLeftCorrect ? entry.goodHtml : entry.badHtml,
          rightContent: isLeftCorrect ? entry.badHtml : entry.goodHtml,
          resolvedContentType: "code" as const,
        };
      }
      case "image": {
        return {
          leftContent: isLeftCorrect
            ? { src: entry.goodImage, alt: entry.goodImageAlt ?? "Option A" }
            : { src: entry.badImage, alt: entry.badImageAlt ?? "Option A" },
          rightContent: isLeftCorrect
            ? { src: entry.badImage, alt: entry.badImageAlt ?? "Option B" }
            : { src: entry.goodImage, alt: entry.goodImageAlt ?? "Option B" },
          resolvedContentType: "image" as const,
        };
      }
      case "visual": {
        return {
          leftContent: isLeftCorrect
            ? entry.goodComponentId
            : entry.badComponentId,
          rightContent: isLeftCorrect
            ? entry.badComponentId
            : entry.goodComponentId,
          resolvedContentType: "visual" as const,
        };
      }
      case "molecule": {
        return {
          leftContent: isLeftCorrect ? entry.goodMolecule : entry.badMolecule,
          rightContent: isLeftCorrect ? entry.badMolecule : entry.goodMolecule,
          resolvedContentType: "molecule" as const,
        };
      }
      case "ticket": {
        return {
          leftContent: isLeftCorrect ? entry.goodTicket : entry.badTicket,
          rightContent: isLeftCorrect ? entry.badTicket : entry.goodTicket,
          resolvedContentType: "ticket" as const,
        };
      }
    }
  }, [displayChallenge, contentMap]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!showFeedback) return null;
    if (!displayAnswer || !displayChallenge) return null;
    return side === displayChallenge.correctSide ? "correct" : "wrong";
  };

  const isSelectedSide = (side: "left" | "right"): boolean => {
    if (!displayAnswer) return false;
    return displayAnswer.side === side;
  };

  const handleSubmit = useCallback(
    (side: "left" | "right") => {
      if (!displayChallenge) return;
      onAnswerSubmit?.(displayChallenge.id, side);
      submitAnswer(side);
    },
    [displayChallenge, onAnswerSubmit, submitAnswer],
  );

  // Auto-advance when showFeedback is false (screening mode)
  useEffect(() => {
    if (showFeedback || !currentAnswer) return;
    const t = setTimeout(() => goToNext(), 400);
    return () => clearTimeout(t);
  }, [showFeedback, currentAnswer, goToNext]);

  const questionResults = useMemo(() => {
    if (!state) return [];
    return state.challenges.map((c) => {
      const answer = state.answers[c.id];
      return answer ? answer.result : null;
    });
  }, [state]);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (!currentChallenge) return;

      if (isReviewing) {
        if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          exitReview();
        }
        return;
      }

      if (currentAnswer) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goToNext();
        }
        return;
      }

      if (
        e.key === "a" ||
        e.key === "A" ||
        e.key === "1" ||
        e.key === "ArrowLeft"
      ) {
        handleSubmit("left");
      } else if (
        e.key === "b" ||
        e.key === "B" ||
        e.key === "2" ||
        e.key === "ArrowRight"
      ) {
        handleSubmit("right");
      }
    },
    [
      currentAnswer,
      currentChallenge,
      handleSubmit,
      goToNext,
      isReviewing,
      exitReview,
    ],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!showFeedback || !displayAnswer || isReviewing) return;
    const t = setTimeout(() => {
      explanationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
    return () => clearTimeout(t);
  }, [showFeedback, displayAnswer, isReviewing]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [state?.currentIndex]);

  if (!activeSeed) {
    return (
      <LobbyComponent
        onStart={handleLobbyStart}
        defaultSeed={lobbySeed}
        defaultExcluded={excludedCategories}
      />
    );
  }

  if (!state) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          py: 12,
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Loading challenges...
        </Typography>
      </Box>
    );
  }

  if (state.isFinished) {
    return (
      <ResultsComponent
        state={state}
        onRetry={handleRetry}
        onNewGame={handleNewGame}
      />
    );
  }

  if (!displayChallenge) return null;

  return (
    <Stack spacing={3}>
      <GameHeaderComponent
        score={state.score}
        total={totalChallenges}
        currentQuestion={state.currentIndex + 1}
        streak={state.streak}
        difficulty={currentDifficulty}
        questionResults={
          showFeedback ? questionResults : questionResults.map(() => null)
        }
        reviewIndex={state.reviewIndex}
        onQuestionClick={reviewQuestion}
      />

      {isReviewing && (
        <Fade in timeout={200}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              px: 2,
              py: 1,
              border: 1,
              borderColor: "primary.main",
              bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
              borderRadius: 2,
            }}
          >
            <Typography
              variant="body2"
              fontWeight={500}
              color="primary.main"
              fontFamily="var(--font-geist-mono), monospace"
            >
              Reviewing question {(state.reviewIndex ?? 0) + 1}
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={exitReview}
              startIcon={<ArrowLeft size={14} />}
              sx={{ textTransform: "none", fontWeight: 600 }}
            >
              Back to question {state.currentIndex + 1}
            </Button>
          </Paper>
        </Fade>
      )}

      <Box sx={{ textAlign: "center" }}>
        <Chip
          label={categoryLabels[displayChallenge.category]}
          size="small"
          sx={{
            mb: 1,
            bgcolor: "action.selected",
            color: "text.primary",
            fontSize: "0.7rem",
            height: 22,
          }}
        />
        <Typography variant="h6" fontWeight={600} sx={{}}>
          {displayChallenge.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isReviewing
            ? "Reviewing your previous answer"
            : displayChallenge.prompt}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr auto 1fr" },
          gap: { xs: 2, md: 0 },
          alignItems: "stretch",
        }}
      >
        {resolvedContentType === "code" && (
          <CodePanelComponent
            highlightedHtml={leftContent ?? ""}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "image" && ImagePanelComponent && (
          <ImagePanelComponent
            imageSrc={leftContent.src}
            imageAlt={leftContent.alt}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "visual" && VisualPanelComponent && (
          <VisualPanelComponent
            componentId={leftContent}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "molecule" && MoleculePanelComponent && (
          <MoleculePanelComponent
            molecule={leftContent}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "ticket" && TicketPanelComponent && (
          <TicketPanelComponent
            ticket={leftContent}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}

        <Box
          sx={{
            display: { xs: "none", md: "flex" },
            alignItems: "center",
            justifyContent: "center",
            px: 1.5,
          }}
        >
          <Typography
            variant="caption"
            fontWeight={700}
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              color: "text.primary",
              bgcolor: "action.selected",
              px: 1,
              py: 0.5,
              borderRadius: 1,
              letterSpacing: "0.1em",
            }}
          >
            VS
          </Typography>
        </Box>

        {resolvedContentType === "code" && (
          <CodePanelComponent
            highlightedHtml={rightContent ?? ""}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "image" && ImagePanelComponent && (
          <ImagePanelComponent
            imageSrc={rightContent.src}
            imageAlt={rightContent.alt}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "visual" && VisualPanelComponent && (
          <VisualPanelComponent
            componentId={rightContent}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "molecule" && MoleculePanelComponent && (
          <MoleculePanelComponent
            molecule={rightContent}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "ticket" && TicketPanelComponent && (
          <TicketPanelComponent
            ticket={rightContent}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => handleSubmit("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
      </Box>

      <Stack spacing={2}>
        {showFeedback && displayAnswer && (
          <Grow in timeout={400} style={{ transformOrigin: "top center" }}>
            <Box ref={explanationRef}>
              <ExplanationComponent
                isCorrect={displayAnswer.result === "correct"}
                explanationText={
                  displayAnswer.result === "correct"
                    ? displayChallenge.explanationCorrect
                    : (displayChallenge.explanationWrong ??
                      displayChallenge.explanationCorrect)
                }
                sourceUrl={displayChallenge.sourceUrl}
                sourceLabel={displayChallenge.sourceLabel}
                category={displayChallenge.category}
                categoryLabel={
                  categoryLabels[displayChallenge.category] ??
                  displayChallenge.category
                }
                challengeId={displayChallenge.id}
                title={displayChallenge.title}
                githubUrl={githubUrl}
              />
            </Box>
          </Grow>
        )}

        {showFeedback && displayAnswer && (
          <Fade in timeout={400} style={{ transitionDelay: "200ms" }}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              {isReviewing ? (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={exitReview}
                  startIcon={<ArrowLeft size={18} />}
                >
                  Back to Question {state.currentIndex + 1}
                </Button>
              ) : (
                <Button
                  variant="contained"
                  size="large"
                  onClick={goToNext}
                  tabIndex={currentAnswer ? 0 : -1}
                  endIcon={
                    state.currentIndex + 1 < totalChallenges ? (
                      <ArrowRight size={18} />
                    ) : undefined
                  }
                >
                  {state.currentIndex + 1 < totalChallenges
                    ? "Next Challenge"
                    : "See Results"}
                </Button>
              )}
            </Box>
          </Fade>
        )}
      </Stack>

      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          textAlign: "center",
          opacity: 0.9,
          transition: "opacity 0.2s",
          display: { xs: "none", md: "block" },
        }}
      >
        {isReviewing
          ? "Press Escape to return"
          : currentAnswer
            ? "Press Enter to continue"
            : "A / \u2190 for left \u00B7 B / \u2192 for right"}
      </Typography>
    </Stack>
  );
}
