"use client";

import type { ComponentType, ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Difficulty } from "../../lib/game/types";
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

export type ContentMapEntry =
  | CodeChallengeEntry
  | ImageChallengeEntry
  | VisualChallengeEntry
  | MoleculeChallengeEntry;

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
  displayChallenge: C | null;
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
  /** Text shown below the challenge title, e.g. "Pick the better TypeScript pattern" */
  promptText: string;
  /** Category label map for the blurred category chip. */
  categoryLabels: Record<string, string>;
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
  children?: ReactNode;
}

export function Game<C extends BaseChallenge>({
  challenges,
  contentMap = {},
  defaultSeed,
  promptText,
  categoryLabels,
  useGame: useGameHook,
  generateSeed: generateSeedFn,
  slots: {
    codePanel: CodePanelComponent,
    imagePanel: ImagePanelComponent,
    visualPanel: VisualPanelComponent,
    moleculePanel: MoleculePanelComponent,
    lobby: LobbyComponent,
    results: ResultsComponent,
    explanation: ExplanationComponent,
    gameHeader: GameHeaderComponent,
  },
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
          leftContent: isLeftCorrect
            ? entry.goodMolecule
            : entry.badMolecule,
          rightContent: isLeftCorrect
            ? entry.badMolecule
            : entry.goodMolecule,
          resolvedContentType: "molecule" as const,
        };
      }
    }
  }, [displayChallenge, contentMap]);

  const getResult = (side: "left" | "right"): "correct" | "wrong" | null => {
    if (!displayAnswer || !displayChallenge) return null;
    return side === displayChallenge.correctSide ? "correct" : "wrong";
  };

  const isSelectedSide = (side: "left" | "right"): boolean => {
    if (!displayAnswer) return false;
    return displayAnswer.side === side;
  };

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
        submitAnswer("left");
      } else if (
        e.key === "b" ||
        e.key === "B" ||
        e.key === "2" ||
        e.key === "ArrowRight"
      ) {
        submitAnswer("right");
      }
    },
    [
      currentAnswer,
      currentChallenge,
      submitAnswer,
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
    if (!displayAnswer || isReviewing) return;
    const t = setTimeout(() => {
      explanationRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);
    return () => clearTimeout(t);
  }, [displayAnswer, isReviewing]);

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
        questionResults={questionResults}
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
        <Typography
          variant="h6"
          fontWeight={600}
          sx={{
            filter: displayAnswer || isReviewing ? "blur(0)" : "blur(6px)",
            opacity: displayAnswer || isReviewing ? 1 : 0.6,
            transform:
              displayAnswer || isReviewing ? "scale(1)" : "scale(0.97)",
            transition:
              displayAnswer || isReviewing
                ? "filter 0.4s ease, opacity 0.4s ease, transform 0.3s ease"
                : "none",
            userSelect: displayAnswer || isReviewing ? "auto" : "none",
          }}
        >
          {displayChallenge.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isReviewing ? "Reviewing your previous answer" : promptText}
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
            highlightedHtml={(leftContent as string) ?? ""}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "image" && ImagePanelComponent && (
          <ImagePanelComponent
            imageSrc={(leftContent as { src: string; alt: string })?.src ?? ""}
            imageAlt={
              (leftContent as { src: string; alt: string })?.alt ?? "Option A"
            }
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "visual" && VisualPanelComponent && (
          <VisualPanelComponent
            componentId={(leftContent as string) ?? ""}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("left")}
            result={getResult("left")}
            isSelected={isSelectedSide("left")}
          />
        )}
        {resolvedContentType === "molecule" && MoleculePanelComponent && (
          <MoleculePanelComponent
            molecule={(leftContent as MoleculeChallengeEntry["goodMolecule"]) ?? { name: "", formula: "" }}
            label="A"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("left")}
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
            highlightedHtml={(rightContent as string) ?? ""}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "image" && ImagePanelComponent && (
          <ImagePanelComponent
            imageSrc={(rightContent as { src: string; alt: string })?.src ?? ""}
            imageAlt={
              (rightContent as { src: string; alt: string })?.alt ?? "Option B"
            }
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "visual" && VisualPanelComponent && (
          <VisualPanelComponent
            componentId={(rightContent as string) ?? ""}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
        {resolvedContentType === "molecule" && MoleculePanelComponent && (
          <MoleculePanelComponent
            molecule={(rightContent as MoleculeChallengeEntry["goodMolecule"]) ?? { name: "", formula: "" }}
            label="B"
            isSelectable={!isReviewing && !currentAnswer}
            onSelect={() => submitAnswer("right")}
            result={getResult("right")}
            isSelected={isSelectedSide("right")}
          />
        )}
      </Box>

      <Stack spacing={2}>
        {displayAnswer && (
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
              />
            </Box>
          </Grow>
        )}

        {displayAnswer && (
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
