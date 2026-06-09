"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import {
  Check,
  Eye,
  EyeOff,
  Heart,
  Minus,
  Play,
  Plus,
  Square,
  Trophy,
} from "lucide-react";
import type { RetroPhase, VotingConfig } from "@/lib/retro/types";
import { countLabel } from "@/lib/retro/format";
import { TimerDisplay } from "./timer-display";

export interface PhasePanelProps {
  phase: RetroPhase;
  voting: VotingConfig;
  collectEndsAt: number | null;
  totalNoteCount: number;
  myVoteCount: number;
  totalVoteCount: number;
  isHost: boolean;
  /** Whether the current participant has clicked "I'm ready". */
  amReady: boolean;
  readyCount: number;
  participantCount: number;
  onReveal: () => void;
  onStartVoting: (maxVotes: number, endsAt: number | null) => void;
  onEndVoting: () => void;
  onSetTimer: (endsAt: number | null) => void;
  onSetMaxVotes: (maxVotes: number) => void;
  onSetReady: (isReady: boolean) => void;
}

const MIN_MAX_VOTES = 1;
const MAX_MAX_VOTES = 30;

function clampVotes(n: number): number {
  if (!Number.isFinite(n)) return 5;
  return Math.max(MIN_MAX_VOTES, Math.min(MAX_MAX_VOTES, Math.round(n)));
}

interface ReadyControlProps {
  amReady: boolean;
  readyCount: number;
  participantCount: number;
  /** Verb describing what auto-advance will do — for the helper line. */
  advanceVerb: string;
  onSetReady: (isReady: boolean) => void;
}

function ReadyControl({
  amReady,
  readyCount,
  participantCount,
  advanceVerb,
  onSetReady,
}: ReadyControlProps) {
  const allReady = readyCount > 0 && readyCount === participantCount;
  const remaining = Math.max(0, participantCount - readyCount);
  return (
    <Stack spacing={0.75}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
        sx={{
          px: 1.25,
          py: 0.5,
          borderRadius: 1.5,
          bgcolor: amReady
            ? "rgba(var(--mui-palette-success-mainChannel) / 0.10)"
            : "action.hover",
        }}
      >
        <Stack direction="row" spacing={0.75} alignItems="center">
          <Check size={14} />
          <Typography variant="body2" fontWeight={700}>
            Ready
          </Typography>
        </Stack>
        <Typography
          variant="body2"
          fontWeight={700}
          fontFamily="var(--font-geist-mono), monospace"
          color={allReady ? "success.main" : "text.primary"}
        >
          {readyCount}/{participantCount}
        </Typography>
      </Stack>
      <Button
        size="small"
        fullWidth
        variant={amReady ? "outlined" : "contained"}
        color={amReady ? "inherit" : "success"}
        startIcon={<Check size={14} />}
        onClick={() => {
          onSetReady(!amReady);
        }}
      >
        {amReady ? "Not ready" : "I'm ready"}
      </Button>
      {!amReady && remaining > 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.65rem", lineHeight: 1.3 }}
        >
          {advanceVerb} automatically when everyone&apos;s ready.
        </Typography>
      )}
      {amReady && remaining > 0 && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontSize: "0.65rem", lineHeight: 1.3 }}
        >
          Waiting on {remaining} {remaining === 1 ? "teammate" : "teammates"}…
        </Typography>
      )}
    </Stack>
  );
}

const PHASE_BADGE: Record<
  RetroPhase,
  {
    label: string;
    color: "default" | "success" | "primary" | "info" | "warning";
    icon: React.ReactElement;
  }
> = {
  collect: {
    label: "Brainstorm",
    color: "default",
    icon: <EyeOff size={14} />,
  },
  discuss: { label: "Discuss", color: "success", icon: <Eye size={14} /> },
  vote: { label: "Voting", color: "primary", icon: <Heart size={14} /> },
  results: { label: "Results", color: "info", icon: <Trophy size={14} /> },
};

export function PhasePanel({
  phase,
  voting,
  collectEndsAt,
  totalNoteCount,
  myVoteCount,
  totalVoteCount,
  isHost,
  amReady,
  readyCount,
  participantCount,
  onReveal,
  onStartVoting,
  onEndVoting,
  onSetTimer,
  onSetMaxVotes,
  onSetReady,
}: PhasePanelProps) {
  const badge = PHASE_BADGE[phase];
  const [maxVotesInput, setMaxVotesInput] = useState(String(voting.maxVotes));
  const [voteMinutes, setVoteMinutes] = useState("");
  const [collectMinutes, setCollectMinutes] = useState("");

  function startVoting() {
    const parsedMax = Math.round(Number(maxVotesInput));
    const max = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 5;
    const parsedMin = Number(voteMinutes);
    const endsAt =
      Number.isFinite(parsedMin) && parsedMin > 0
        ? Date.now() + parsedMin * 60_000
        : null;
    onStartVoting(max, endsAt);
  }

  function startCollectTimer() {
    const parsedMin = Number(collectMinutes);
    if (!Number.isFinite(parsedMin) || parsedMin <= 0) return;
    onSetTimer(Date.now() + parsedMin * 60_000);
    setCollectMinutes("");
  }

  function extendVoteTimer() {
    const parsedMin = Number(voteMinutes);
    if (!Number.isFinite(parsedMin) || parsedMin <= 0) return;
    onSetTimer(Date.now() + parsedMin * 60_000);
    setVoteMinutes("");
  }

  return (
    <Stack spacing={1.5}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent="space-between"
      >
        <Chip
          icon={badge.icon}
          label={badge.label}
          size="small"
          color={badge.color}
          sx={{ fontWeight: 700 }}
        />
        <Typography
          variant="caption"
          color="text.secondary"
          fontFamily="var(--font-geist-mono), monospace"
          sx={{ fontSize: "0.65rem" }}
        >
          {countLabel(totalNoteCount, "note")}
          {/* The tally stays hidden until results so it cannot sway voting. */}
          {phase === "results"
            ? ` · ${countLabel(totalVoteCount, "vote")}`
            : ""}
        </Typography>
      </Stack>

      {phase === "collect" && (
        <Stack spacing={1}>
          {collectEndsAt !== null && (
            <TimerDisplay
              endsAt={collectEndsAt}
              label="Brainstorm"
              onClear={
                isHost
                  ? () => {
                      onSetTimer(null);
                    }
                  : undefined
              }
            />
          )}
          {isHost && collectEndsAt === null && (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <TextField
                size="small"
                placeholder="min"
                value={collectMinutes}
                onChange={(e) => {
                  setCollectMinutes(e.target.value.replace(/[^0-9]/g, ""));
                }}
                slotProps={{
                  htmlInput: { maxLength: 3, inputMode: "numeric" },
                }}
                sx={{ width: 64 }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={startCollectTimer}
                disabled={!collectMinutes || Number(collectMinutes) <= 0}
                sx={{ flex: 1, minWidth: 0 }}
              >
                Set timer
              </Button>
            </Stack>
          )}
          {isHost && (
            <Button
              variant="contained"
              size="small"
              fullWidth
              startIcon={<Eye size={14} />}
              onClick={onReveal}
              disabled={totalNoteCount === 0}
            >
              Reveal notes
            </Button>
          )}
          {participantCount > 0 && totalNoteCount > 0 && (
            <ReadyControl
              amReady={amReady}
              readyCount={readyCount}
              participantCount={participantCount}
              advanceVerb="Reveals"
              onSetReady={onSetReady}
            />
          )}
          {!isHost && totalNoteCount === 0 && (
            <HostHint>Add notes, then mark yourself ready.</HostHint>
          )}
        </Stack>
      )}

      {phase === "discuss" && (
        <Stack spacing={1.25}>
          {isHost ? (
            <>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    display: "block",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.6rem",
                    mb: 0.5,
                  }}
                >
                  Votes per person
                </Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <IconButton
                    size="small"
                    onClick={() => {
                      const current = clampVotes(Number(maxVotesInput));
                      setMaxVotesInput(String(clampVotes(current - 1)));
                    }}
                    disabled={
                      clampVotes(Number(maxVotesInput)) <= MIN_MAX_VOTES
                    }
                    aria-label="Decrease votes"
                    sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                  >
                    <Minus size={14} />
                  </IconButton>
                  <TextField
                    size="small"
                    value={maxVotesInput}
                    onChange={(e) => {
                      setMaxVotesInput(e.target.value.replace(/[^0-9]/g, ""));
                    }}
                    slotProps={{
                      htmlInput: {
                        maxLength: 2,
                        inputMode: "numeric",
                        style: { textAlign: "center", fontWeight: 700 },
                      },
                    }}
                    sx={{ flex: 1, "& input": { fontSize: "1rem" } }}
                  />
                  <IconButton
                    size="small"
                    onClick={() => {
                      const current = clampVotes(Number(maxVotesInput));
                      setMaxVotesInput(String(clampVotes(current + 1)));
                    }}
                    disabled={
                      clampVotes(Number(maxVotesInput)) >= MAX_MAX_VOTES
                    }
                    aria-label="Increase votes"
                    sx={{ border: 1, borderColor: "divider", borderRadius: 1 }}
                  >
                    <Plus size={14} />
                  </IconButton>
                </Stack>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ display: "block", mt: 0.5, fontSize: "0.65rem" }}
                >
                  Each teammate can like up to{" "}
                  {countLabel(
                    clampVotes(Number(maxVotesInput)),
                    "card or stack",
                    "cards or stacks",
                  )}
                  .
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    display: "block",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    fontSize: "0.6rem",
                    mb: 0.5,
                  }}
                >
                  Timer (optional)
                </Typography>
                <TextField
                  size="small"
                  fullWidth
                  placeholder="Minutes"
                  value={voteMinutes}
                  onChange={(e) => {
                    setVoteMinutes(e.target.value.replace(/[^0-9]/g, ""));
                  }}
                  slotProps={{
                    htmlInput: { maxLength: 3, inputMode: "numeric" },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                size="small"
                fullWidth
                startIcon={<Play size={14} />}
                onClick={startVoting}
              >
                Start voting
              </Button>
            </>
          ) : (
            <HostHint>
              Discuss, group, and reorder cards. Host will start voting when
              ready.
            </HostHint>
          )}
        </Stack>
      )}

      {phase === "vote" && (
        <Stack spacing={1}>
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            justifyContent="space-between"
            sx={{
              px: 1.25,
              py: 0.75,
              borderRadius: 1.5,
              bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.08)",
            }}
          >
            <Stack direction="row" spacing={0.75} alignItems="center">
              <Heart size={14} fill="currentColor" />
              <Typography variant="body2" fontWeight={700}>
                Your votes
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0.25} alignItems="center">
              <Typography
                variant="body2"
                fontWeight={700}
                fontFamily="var(--font-geist-mono), monospace"
              >
                {myVoteCount}/{voting.maxVotes}
              </Typography>
              {isHost && (
                <>
                  <IconButton
                    size="small"
                    onClick={() => {
                      onSetMaxVotes(clampVotes(voting.maxVotes - 1));
                    }}
                    disabled={voting.maxVotes <= MIN_MAX_VOTES}
                    aria-label="Decrease max votes"
                    title="Decrease max votes"
                    sx={{ p: 0.25 }}
                  >
                    <Minus size={12} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => {
                      onSetMaxVotes(clampVotes(voting.maxVotes + 1));
                    }}
                    disabled={voting.maxVotes >= MAX_MAX_VOTES}
                    aria-label="Increase max votes"
                    title="Increase max votes"
                    sx={{ p: 0.25 }}
                  >
                    <Plus size={12} />
                  </IconButton>
                </>
              )}
            </Stack>
          </Stack>
          {voting.endsAt !== null && (
            <TimerDisplay
              endsAt={voting.endsAt}
              label="Voting"
              onClear={
                isHost
                  ? () => {
                      onSetTimer(null);
                    }
                  : undefined
              }
            />
          )}
          {isHost && voting.endsAt === null && (
            <Stack direction="row" spacing={0.75} alignItems="center">
              <TextField
                size="small"
                placeholder="min"
                value={voteMinutes}
                onChange={(e) => {
                  setVoteMinutes(e.target.value.replace(/[^0-9]/g, ""));
                }}
                slotProps={{
                  htmlInput: { maxLength: 3, inputMode: "numeric" },
                }}
                sx={{ width: 64 }}
              />
              <Button
                size="small"
                variant="outlined"
                onClick={extendVoteTimer}
                disabled={!voteMinutes || Number(voteMinutes) <= 0}
                sx={{ flex: 1, minWidth: 0 }}
              >
                Set timer
              </Button>
            </Stack>
          )}
          {isHost && (
            <Button
              variant="outlined"
              size="small"
              fullWidth
              startIcon={<Square size={14} />}
              onClick={onEndVoting}
            >
              End voting
            </Button>
          )}
          {participantCount > 0 && (
            <ReadyControl
              amReady={amReady}
              readyCount={readyCount}
              participantCount={participantCount}
              advanceVerb="Closes voting"
              onSetReady={onSetReady}
            />
          )}
        </Stack>
      )}

      {phase === "results" && (
        <Box
          sx={{
            px: 1.25,
            py: 1,
            borderRadius: 1.5,
            bgcolor: "rgba(var(--mui-palette-info-mainChannel) / 0.08)",
          }}
        >
          <Stack
            direction="row"
            spacing={0.75}
            alignItems="center"
            sx={{ mb: 0.5 }}
          >
            <Trophy size={14} />
            <Typography variant="body2" fontWeight={700}>
              Voting closed
            </Typography>
          </Stack>
          <Typography variant="caption" color="text.secondary">
            Columns sorted by votes. Promote the top items to action items.
          </Typography>
        </Box>
      )}
    </Stack>
  );
}

function HostHint({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      color="text.secondary"
      sx={{
        display: "block",
        px: 1.25,
        py: 0.75,
        borderRadius: 1.5,
        bgcolor: "action.hover",
        lineHeight: 1.4,
      }}
    >
      {children}
    </Typography>
  );
}
