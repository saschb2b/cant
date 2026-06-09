"use client";

import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  ChevronUp,
  Layers,
  MessageSquare,
  Unlink2,
} from "lucide-react";
import type { NoteSnapshot, RetroPhase } from "@/lib/retro/types";
import { NoteCard } from "./note-card";
import { VoteChip } from "./vote-chip";

export interface StackProps {
  groupId: string;
  columnId: string;
  notes: NoteSnapshot[];
  participantId: string;
  revealed: boolean;
  phase: RetroPhase;
  asOverlay?: boolean;
  isMergeTarget?: boolean;
  voteState?: {
    count: number;
    voted: boolean;
    budgetExhausted: boolean;
    showCount: boolean;
    showVoted: boolean;
    /** Top vote-getter on the board (results) — accents the stack. */
    highlight: boolean;
    onToggle: () => void;
  } | null;
  onEditNote: (noteId: string, text: string) => void;
  onDeleteNote: (noteId: string) => void;
  onPromote: (text: string) => void;
  onUnstack: (groupId: string) => void;
  onReorder: (groupId: string, noteIds: string[]) => void;
  onAddContext: (noteId: string, text: string) => void;
  onDeleteContext: (noteId: string, contextId: string) => void;
}

export function NoteStack({
  groupId,
  columnId,
  notes,
  participantId,
  revealed,
  phase,
  asOverlay = false,
  isMergeTarget = false,
  voteState,
  onEditNote,
  onDeleteNote,
  onPromote,
  onUnstack,
  onReorder,
  onAddContext,
  onDeleteContext,
}: StackProps) {
  const [expanded, setExpanded] = useState(false);
  const sorted = [...notes].sort((a, b) => {
    if (a.rank !== b.rank) return a.rank - b.rank;
    return a.createdAt - b.createdAt;
  });
  const top = sorted[0];
  const count = sorted.length;
  const visibleCount = sorted.filter((n) => n.text !== null).length;
  const contextCount = sorted.reduce((acc, n) => acc + n.contexts.length, 0);
  // Top vote-getter on the board (results) — accent the stack so it pops.
  const isLeader = voteState?.highlight ?? false;
  const dragPhaseOk = phase === "collect" || phase === "discuss";
  const canDragWhole = revealed && dragPhaseOk && !asOverlay && !expanded;
  const reorderAllowed = dragPhaseOk;

  function moveNote(noteId: string, direction: "up" | "down") {
    const idx = sorted.findIndex((n) => n.id === noteId);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= sorted.length) return;
    const ids = sorted.map((n) => n.id);
    const a = ids[idx];
    const b = ids[swapIdx];
    if (a === undefined || b === undefined) return;
    ids[idx] = b;
    ids[swapIdx] = a;
    onReorder(groupId, ids);
  }

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `stack:${groupId}`,
    data: {
      type: "stack" as const,
      groupId,
      columnId,
      noteIds: sorted.map((n) => n.id),
    },
    disabled: !canDragWhole,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `stack-drop:${groupId}`,
    data: {
      type: "stack" as const,
      groupId,
      columnId,
    },
    disabled: asOverlay,
  });

  if (!top) return null;

  if (expanded && !asOverlay) {
    return (
      <Box
        ref={setDropRef}
        sx={{
          position: "relative",
          p: 1.25,
          borderRadius: 2,
          border: 1.5,
          borderColor: isMergeTarget || isLeader ? "primary.main" : "divider",
          bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.04)",
          transition: "border-color 150ms ease",
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 1, px: 0.5 }}
        >
          <Layers size={14} />
          <Typography
            variant="caption"
            fontWeight={700}
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontSize: "0.65rem",
            }}
          >
            Stack of {count}
          </Typography>
          <Box sx={{ flex: 1 }} />
          {voteState && (
            <VoteChip
              count={voteState.count}
              voted={voteState.voted}
              interactive={phase === "vote"}
              showCount={voteState.showCount}
              showVoted={voteState.showVoted}
              highlight={voteState.highlight}
              budgetExhausted={voteState.budgetExhausted}
              onToggle={voteState.onToggle}
            />
          )}
          {reorderAllowed && (
            <IconButton
              size="small"
              onClick={() => {
                onUnstack(groupId);
              }}
              aria-label="Unstack"
              title="Unstack"
              sx={{ p: 0.25 }}
            >
              <Unlink2 size={14} />
            </IconButton>
          )}
          <IconButton
            size="small"
            onClick={() => {
              setExpanded(false);
            }}
            aria-label="Collapse stack"
            sx={{ p: 0.25 }}
          >
            <ChevronUp size={14} />
          </IconButton>
        </Stack>
        <Stack spacing={1}>
          {sorted.map((note, idx) => {
            const isTop = idx === 0;
            const isBottom = idx === sorted.length - 1;
            return (
              <Stack
                key={note.id}
                direction="row"
                spacing={0.5}
                alignItems="stretch"
              >
                <Stack
                  spacing={0.25}
                  sx={{
                    flexShrink: 0,
                    pt: 0.5,
                    width: 22,
                    justifyContent: "flex-start",
                    alignItems: "center",
                  }}
                >
                  {isTop ? (
                    <Box
                      sx={{
                        fontSize: "0.55rem",
                        fontWeight: 700,
                        letterSpacing: "0.05em",
                        color: "primary.main",
                        textTransform: "uppercase",
                        textOrientation: "mixed",
                        writingMode: "horizontal-tb",
                        textAlign: "center",
                        lineHeight: 1,
                      }}
                      title="Top of stack — shown when collapsed"
                    >
                      TOP
                    </Box>
                  ) : reorderAllowed ? (
                    <IconButton
                      size="small"
                      onClick={() => {
                        moveNote(note.id, "up");
                      }}
                      aria-label="Move note up"
                      title="Move up"
                      sx={{ p: 0.25 }}
                    >
                      <ArrowUp size={12} />
                    </IconButton>
                  ) : null}
                  {!isBottom && reorderAllowed && (
                    <IconButton
                      size="small"
                      onClick={() => {
                        moveNote(note.id, "down");
                      }}
                      aria-label="Move note down"
                      title="Move down"
                      sx={{ p: 0.25 }}
                    >
                      <ArrowDown size={12} />
                    </IconButton>
                  )}
                </Stack>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <NoteCard
                    note={note}
                    isAuthor={note.authorId === participantId}
                    revealed={revealed}
                    phase={phase}
                    participantId={participantId}
                    voteState={null}
                    onEdit={(text) => {
                      onEditNote(note.id, text);
                    }}
                    onDelete={() => {
                      onDeleteNote(note.id);
                    }}
                    onPromote={onPromote}
                    onAddContext={(text) => {
                      onAddContext(note.id, text);
                    }}
                    onDeleteContext={(contextId) => {
                      onDeleteContext(note.id, contextId);
                    }}
                  />
                </Box>
              </Stack>
            );
          })}
        </Stack>
      </Box>
    );
  }

  const dragStyle: React.CSSProperties = {
    transform: transform
      ? `translate3d(${String(transform.x)}px, ${String(transform.y)}px, 0)`
      : undefined,
    opacity: isDragging && !asOverlay ? 0.35 : 1,
    cursor: canDragWhole ? (isDragging ? "grabbing" : "grab") : "default",
    transition: isDragging
      ? "none"
      : "transform 200ms ease, opacity 150ms ease",
  };

  return (
    <Box
      ref={(el: HTMLElement | null) => {
        if (!asOverlay) {
          setDragRef(el);
          setDropRef(el);
        }
      }}
      {...(asOverlay ? {} : attributes)}
      {...(asOverlay ? {} : listeners)}
      style={dragStyle}
      sx={{
        position: "relative",
        pb: 1,
        // visual depth: pseudo-elements behind the top card
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: 2,
          border: 1.5,
          borderColor: "divider",
          bgcolor: "background.paper",
          transform: "translate(6px, 6px) rotate(1.2deg)",
          transformOrigin: "bottom right",
          zIndex: 0,
          opacity: 0.7,
          pointerEvents: "none",
        },
        "&::after":
          count >= 3
            ? {
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: 2,
                border: 1.5,
                borderColor: "divider",
                bgcolor: "background.paper",
                transform: "translate(3px, 3px) rotate(-0.6deg)",
                transformOrigin: "bottom left",
                zIndex: 0,
                opacity: 0.85,
                pointerEvents: "none",
              }
            : undefined,
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          borderRadius: 2,
          border: 1.5,
          borderColor: isMergeTarget || isLeader ? "primary.main" : "divider",
          bgcolor: isLeader
            ? "rgba(var(--mui-palette-primary-mainChannel) / 0.05)"
            : "background.paper",
          p: 1.5,
          boxShadow: asOverlay ? 6 : 0,
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          "&:hover .stack-actions": { opacity: 1 },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{ mb: 0.75 }}
        >
          <Chip
            icon={<Layers size={12} />}
            label={count}
            size="small"
            color="primary"
            sx={{
              height: 22,
              fontSize: "0.7rem",
              fontWeight: 700,
              "& .MuiChip-icon": { ml: 0.5 },
            }}
          />
          {visibleCount < count && (
            <Typography
              variant="caption"
              color="text.disabled"
              sx={{ fontSize: "0.65rem" }}
            >
              {visibleCount}/{count} visible
            </Typography>
          )}
          <Box sx={{ flex: 1 }} />
          {contextCount > 0 && (
            <Chip
              icon={<MessageSquare size={10} />}
              label={contextCount}
              size="small"
              variant="outlined"
              title="Clarifying contexts inside this stack"
              sx={{
                height: 20,
                fontSize: "0.65rem",
                fontWeight: 700,
                color: "text.secondary",
                "& .MuiChip-icon": { ml: 0.5, mr: -0.25 },
                "& .MuiChip-label": { px: 0.75 },
              }}
            />
          )}
          {voteState && (
            <VoteChip
              count={voteState.count}
              voted={voteState.voted}
              interactive={phase === "vote"}
              showCount={voteState.showCount}
              showVoted={voteState.showVoted}
              highlight={voteState.highlight}
              budgetExhausted={voteState.budgetExhausted}
              onToggle={voteState.onToggle}
            />
          )}
        </Stack>

        {top.text === null ? (
          <Typography
            variant="body2"
            color="text.disabled"
            fontStyle="italic"
            sx={{ fontSize: "0.8rem" }}
          >
            Hidden until reveal
          </Typography>
        ) : (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {top.text}
          </Typography>
        )}

        {!asOverlay && (
          <Stack
            direction="row"
            spacing={0.25}
            className="stack-actions"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            sx={{
              position: "absolute",
              top: 4,
              right: 4,
              opacity: { xs: 1, sm: 0 },
              transition: "opacity 0.15s",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                setExpanded(true);
              }}
              aria-label="Peek inside stack"
              title="Peek inside"
              sx={{ p: 0.25 }}
            >
              <ChevronDown size={14} />
            </IconButton>
          </Stack>
        )}
      </Box>
    </Box>
  );
}
