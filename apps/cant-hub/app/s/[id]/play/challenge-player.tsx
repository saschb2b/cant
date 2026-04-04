"use client";

import { useState, useCallback, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import LinearProgress from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import type { ChallengeContent } from "@cant/shared/lib/game";
import { submitAnswerAction, finishSessionAction } from "../actions";

interface ClientChallenge {
  id: string;
  title: string;
  prompt: string;
  category: string;
  difficulty: string;
  content: ChallengeContent;
}

interface ChallengePlayerProps {
  sessionId: string;
  assessmentId: string;
  assessmentTitle: string;
  challenges: ClientChallenge[];
  timeLimitSeconds: number | null;
  startedAt: string;
}

export function ChallengePlayer({
  sessionId,
  assessmentTitle,
  challenges,
  timeLimitSeconds,
  startedAt,
}: ChallengePlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    correct: boolean;
    side: "left" | "right";
  } | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState(timeLimitSeconds);

  const total = challenges.length;
  const challenge = challenges[currentIndex];

  // Timer
  useEffect(() => {
    if (timeLimitSeconds == null) return;

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

  const handleChoice = useCallback(
    async (side: "left" | "right") => {
      if (submitting || feedback) return;
      setSubmitting(true);

      if (!challenge) return;
      const result = await submitAnswerAction(sessionId, challenge.id, side);
      setFeedback({ correct: result.correct, side });
      setSubmitting(false);

      // Brief feedback flash, then advance
      setTimeout(() => {
        setFeedback(null);
        if (currentIndex + 1 < total) {
          setCurrentIndex((i) => i + 1);
        } else {
          void finishSessionAction(sessionId);
        }
      }, 800);
    },
    [submitting, feedback, sessionId, challenge, currentIndex, total],
  );

  if (!challenge) return null;

  const progress = ((currentIndex + 1) / total) * 100;
  const minutes =
    remainingSeconds != null ? Math.floor(remainingSeconds / 60) : null;
  const seconds = remainingSeconds != null ? remainingSeconds % 60 : null;

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 6 } }}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography variant="body2" color="text.secondary">
          {assessmentTitle}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          {minutes != null && seconds != null && (
            <Typography
              variant="body2"
              fontFamily="var(--font-geist-mono), monospace"
              color={remainingSeconds < 60 ? "error" : "text.secondary"}
              fontWeight={700}
            >
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </Typography>
          )}
          <Typography variant="body2" color="text.secondary">
            {currentIndex + 1} of {total}
          </Typography>
        </Stack>
      </Stack>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{ mb: 4, borderRadius: 1 }}
      />

      {/* Question */}
      <Typography
        variant="h6"
        fontWeight={700}
        textAlign="center"
        sx={{ mb: 1 }}
      >
        {challenge.title}
      </Typography>
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{ mb: 4 }}
      >
        {challenge.prompt}
      </Typography>

      {/* Side-by-side panels */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mb: 3 }}>
        <ChallengePanel
          side="left"
          content={challenge.content}
          onChoose={() => void handleChoice("left")}
          disabled={submitting || feedback != null}
          chosen={feedback?.side === "left"}
          correct={feedback?.side === "left" ? feedback.correct : null}
        />
        <ChallengePanel
          side="right"
          content={challenge.content}
          onChoose={() => void handleChoice("right")}
          disabled={submitting || feedback != null}
          chosen={feedback?.side === "right"}
          correct={feedback?.side === "right" ? feedback.correct : null}
        />
      </Stack>
    </Container>
  );
}

function ChallengePanel({
  side,
  content,
  onChoose,
  disabled,
  chosen,
  correct,
}: {
  side: "left" | "right";
  content: ChallengeContent;
  onChoose: () => void;
  disabled: boolean;
  chosen: boolean;
  correct: boolean | null;
}) {
  let borderColor = "divider";
  if (chosen && correct === true) borderColor = "success.main";
  if (chosen && correct === false) borderColor = "error.main";

  const code =
    content.type === "code"
      ? side === "left"
        ? content.left
        : content.right
      : null;

  return (
    <Paper
      variant="outlined"
      onClick={disabled ? undefined : onChoose}
      sx={{
        flex: 1,
        p: 2,
        cursor: disabled ? "default" : "pointer",
        borderColor,
        borderWidth: chosen ? 2 : 1,
        transition: "border-color 0.2s",
        "&:hover": disabled
          ? {}
          : { borderColor: "primary.main", bgcolor: "action.hover" },
      }}
    >
      <Typography
        variant="caption"
        color="text.disabled"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          mb: 1,
          display: "block",
        }}
      >
        Option {side === "left" ? "A" : "B"}
      </Typography>
      {code != null ? (
        <Box
          component="pre"
          sx={{
            fontSize: "0.8rem",
            fontFamily: "var(--font-geist-mono), monospace",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            m: 0,
            overflow: "auto",
            maxHeight: 300,
          }}
        >
          {code}
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          Visual challenge (rendering not yet supported in screening mode)
        </Typography>
      )}
    </Paper>
  );
}
