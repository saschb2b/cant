"use client";

import { useEffect, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  Game,
  CodePanel,
  GameHeader,
  ExplanationPanel,
} from "@cant/shared/components/game";
import type {
  ContentMapEntry,
  LobbySlotProps,
  ResultsSlotProps,
  GameHeaderSlotProps,
} from "@cant/shared/components/game";
import {
  useGame as useGameShared,
  type UseGameCallbacks,
} from "@cant/shared/lib/game";
import { generateSeed } from "@cant/shared/lib/game";
import type { BaseChallenge } from "@cant/shared/lib/game";
import { submitAnswerAction, finishSessionAction } from "../actions";

// ---------------------------------------------------------------------------
// useGame wrapper with no-op callbacks for screening
// ---------------------------------------------------------------------------

function useScreeningGame(
  challengePool: BaseChallenge[],
  seed: string | null,
  excludedCategories = new Set<string>(),
  retryKey = 0,
  gameType: "daily" | "weekly" | "custom" = "custom",
) {
  const callbacks = useMemo<UseGameCallbacks>(
    () => ({
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      trackEvent: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      recordGame: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      recordActivity: () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      submitGameResult: () => {},
      encodeSeed: (raw: string) => raw,
    }),
    [],
  );

  return useGameShared(
    challengePool,
    seed,
    callbacks,
    excludedCategories,
    retryKey,
    gameType,
    true, // useAllChallenges: screening uses all questions, no 10-per-session cap
  );
}

// ---------------------------------------------------------------------------
// Auto-start lobby: immediately starts the game with a fixed seed
// ---------------------------------------------------------------------------

function AutoStartLobby({ onStart, defaultSeed }: LobbySlotProps) {
  useEffect(() => {
    onStart(defaultSeed ?? "screening", new Set(), "custom");
  }, [onStart, defaultSeed]);

  return null;
}

// ---------------------------------------------------------------------------
// Screening results: finishes the session and shows a submitting message
// ---------------------------------------------------------------------------

function ScreeningResults({
  sessionId,
}: ResultsSlotProps<BaseChallenge> & { sessionId: string }) {
  useEffect(() => {
    void finishSessionAction(sessionId);
  }, [sessionId]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 12,
      }}
    >
      <Typography variant="body1" color="text.secondary">
        Submitting results...
      </Typography>
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Timer overlay
// ---------------------------------------------------------------------------

function TimerBar({
  timeLimitSeconds,
  startedAt,
  sessionId,
}: {
  timeLimitSeconds: number;
  startedAt: string;
  sessionId: string;
}) {
  const [remainingSeconds, setRemainingSeconds] = useState(timeLimitSeconds);

  useEffect(() => {
    const startTime = new Date(startedAt).getTime();
    const endTime = startTime + timeLimitSeconds * 1000;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((endTime - now) / 1000));
      setRemainingSeconds(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        void finishSessionAction(sessionId);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLimitSeconds, startedAt, sessionId]);

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <Typography
      variant="body2"
      fontFamily="var(--font-geist-mono), monospace"
      color={remainingSeconds < 60 ? "error" : "text.secondary"}
      fontWeight={700}
    >
      {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
    </Typography>
  );
}

// ---------------------------------------------------------------------------
// Screening game header: wraps shared GameHeader with optional timer
// ---------------------------------------------------------------------------

function createScreeningHeader({
  assessmentTitle,
  timeLimitSeconds,
  startedAt,
  sessionId,
}: {
  assessmentTitle: string;
  timeLimitSeconds: number | null;
  startedAt: string;
  sessionId: string;
}) {
  return function ScreeningHeader(props: GameHeaderSlotProps) {
    return (
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            {assessmentTitle}
          </Typography>
          {timeLimitSeconds != null && (
            <TimerBar
              timeLimitSeconds={timeLimitSeconds}
              startedAt={startedAt}
              sessionId={sessionId}
            />
          )}
        </Stack>
        <LinearProgress
          variant="determinate"
          value={(props.currentQuestion / props.total) * 100}
          sx={{ borderRadius: 1 }}
        />
        <GameHeader {...props} />
      </Stack>
    );
  };
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

interface ChallengePlayerProps {
  sessionId: string;
  assessmentTitle: string;
  challenges: BaseChallenge[];
  contentMap: Record<string, ContentMapEntry>;
  categoryLabels: Record<string, string>;
  seed: string;
  timeLimitSeconds: number | null;
  startedAt: string;
}

export function ChallengePlayer({
  sessionId,
  assessmentTitle,
  challenges,
  contentMap,
  categoryLabels,
  seed,
  timeLimitSeconds,
  startedAt,
}: ChallengePlayerProps) {
  // Memoize the screening results component with sessionId bound
  const ScreeningResultsBound = useMemo(() => {
    return function BoundResults(props: ResultsSlotProps<BaseChallenge>) {
      return <ScreeningResults {...props} sessionId={sessionId} />;
    };
  }, [sessionId]);

  // Memoize the header component with assessment info bound
  const ScreeningHeader = useMemo(
    () =>
      createScreeningHeader({
        assessmentTitle,
        timeLimitSeconds,
        startedAt,
        sessionId,
      }),
    [assessmentTitle, timeLimitSeconds, startedAt, sessionId],
  );

  const handleAnswerSubmit = useMemo(() => {
    return (challengeId: string, side: "left" | "right") => {
      void submitAnswerAction(sessionId, challengeId, side);
    };
  }, [sessionId]);

  return (
    <Container
      maxWidth="lg"
      component="section"
      sx={{ py: 4, flex: 1, position: "relative", zIndex: 1 }}
    >
      <Game
        challenges={challenges}
        contentMap={contentMap}
        defaultSeed={seed}
        categoryLabels={categoryLabels}
        useGame={useScreeningGame}
        generateSeed={generateSeed}
        showFeedback={false}
        onAnswerSubmit={handleAnswerSubmit}
        slots={{
          codePanel: CodePanel,
          lobby: AutoStartLobby,
          results: ScreeningResultsBound,
          explanation: ExplanationPanel,
          gameHeader: ScreeningHeader,
        }}
      />
    </Container>
  );
}
