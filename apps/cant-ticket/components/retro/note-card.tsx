"use client";

import { useState } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  ArrowUpRight,
  EyeOff,
  MessageSquarePlus,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { ParticipantAvatar } from "@/components/rooms/participant-avatar";
import type { NoteSnapshot, RetroPhase } from "@/lib/retro/types";
import { ConfirmDialog } from "./confirm-dialog";
import { VoteChip } from "./vote-chip";

const CONTEXT_MAX_LENGTH = 240;

export interface NoteCardProps {
  note: NoteSnapshot;
  isAuthor: boolean;
  revealed: boolean;
  phase: RetroPhase;
  /** Participant viewing the card — used to decide which context × icons render. */
  participantId: string;
  /** Whether this card is currently being shown inside the DragOverlay. */
  asOverlay?: boolean;
  /** Whether the drop indicator should be shown (drag is hovering over this card). */
  isMergeTarget?: boolean;
  /** Vote chip props — set to null to hide (e.g. note is inside a stack). */
  voteState?: {
    count: number;
    voted: boolean;
    budgetExhausted: boolean;
    showCount: boolean;
    showVoted: boolean;
    /** Top vote-getter on the board (results) — accents the card. */
    highlight: boolean;
    onToggle: () => void;
  } | null;
  onEdit: (text: string) => void;
  onDelete: () => void;
  onPromote: (text: string) => void;
  onAddContext: (text: string) => void;
  onDeleteContext: (contextId: string) => void;
}

export function NoteCard({
  note,
  isAuthor,
  revealed,
  phase,
  participantId,
  asOverlay = false,
  isMergeTarget = false,
  voteState,
  onEdit,
  onDelete,
  onPromote,
  onAddContext,
  onDeleteContext,
}: NoteCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(note.text ?? "");
  const [addingContext, setAddingContext] = useState(false);
  const [contextDraft, setContextDraft] = useState("");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const hidden = note.text === null;
  // Top vote-getter on the board (results) — accent the whole card so it pops.
  const isLeader = voteState?.highlight ?? false;
  // Contexts are clarifying notes added during discussion; they only exist
  // and can be added post-reveal.
  const canAnnotate = revealed && !hidden && !asOverlay;
  // Drag is permitted in collect (author-only) and discuss (anyone).
  // Once voting starts the topology is frozen.
  const dragPhaseOk = phase === "collect" || phase === "discuss";
  // While the user is composing (editing the note or adding context) we have
  // to suppress drag entirely — dnd-kit's KeyboardSensor activates on space,
  // which would otherwise hijack typing inside the TextField.
  const canDrag =
    dragPhaseOk &&
    (revealed || isAuthor) &&
    !hidden &&
    !editing &&
    !addingContext;

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `note:${note.id}`,
    data: {
      type: "note" as const,
      noteId: note.id,
      columnId: note.columnId,
      groupId: note.groupId,
      authorId: note.authorId,
    },
    disabled: !canDrag || asOverlay,
  });

  const { setNodeRef: setDropRef } = useDroppable({
    id: `note-drop:${note.id}`,
    data: {
      type: "note" as const,
      noteId: note.id,
      columnId: note.columnId,
      groupId: note.groupId,
    },
    disabled: editing || asOverlay,
  });

  function commitEdit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onEdit(trimmed);
    setEditing(false);
  }

  if (editing && isAuthor) {
    return (
      <Box
        sx={{
          p: 1.5,
          borderRadius: 2,
          border: 1.5,
          borderColor: "primary.main",
          bgcolor: "background.paper",
          boxShadow: 2,
        }}
      >
        <TextField
          autoFocus
          multiline
          minRows={3}
          fullWidth
          size="small"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
          }}
          slotProps={{ htmlInput: { maxLength: 500 } }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              commitEdit();
            }
            if (e.key === "Escape") {
              setDraft(note.text ?? "");
              setEditing(false);
            }
          }}
        />
        <Stack
          direction="row"
          spacing={1}
          sx={{ mt: 1 }}
          justifyContent="flex-end"
        >
          <Button
            size="small"
            onClick={() => {
              setDraft(note.text ?? "");
              setEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button size="small" variant="contained" onClick={commitEdit}>
            Save
          </Button>
        </Stack>
      </Box>
    );
  }

  const dragStyle: React.CSSProperties = {
    transform: transform
      ? `translate3d(${String(transform.x)}px, ${String(transform.y)}px, 0)`
      : undefined,
    opacity: isDragging && !asOverlay ? 0.35 : 1,
    cursor: canDrag ? (isDragging ? "grabbing" : "grab") : "default",
    transition: isDragging
      ? "none"
      : "transform 200ms ease, opacity 150ms ease",
  };

  return (
    <>
      <Box
        ref={(el: HTMLElement | null) => {
          setDragRef(el);
          setDropRef(el);
        }}
        // Only expose the drag affordance (role="button", tabindex, and dnd-kit's
        // aria-disabled) when the card is actually draggable. Spreading these
        // while drag is off — e.g. during voting — turned every card into a
        // disabled button wrapping its own vote/promote controls, which hid
        // those buttons from keyboard and screen-reader users.
        {...(canDrag ? attributes : {})}
        {...(canDrag ? listeners : {})}
        style={dragStyle}
        sx={{
          position: "relative",
          p: 1.5,
          borderRadius: 2,
          border: 1.5,
          borderColor: isMergeTarget || isLeader ? "primary.main" : "divider",
          bgcolor: hidden
            ? "action.hover"
            : isLeader
              ? "rgba(var(--mui-palette-primary-mainChannel) / 0.05)"
              : "background.paper",
          boxShadow: asOverlay
            ? 6
            : isMergeTarget
              ? `inset 0 0 0 2px var(--mui-palette-primary-main)`
              : 0,
          transition: "border-color 150ms ease, box-shadow 150ms ease",
          "&:hover": {
            borderColor: hidden
              ? "divider"
              : isLeader
                ? "primary.main"
                : "text.disabled",
            "& .note-actions": { opacity: 1 },
          },
        }}
      >
        {hidden ? (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ py: 0.5 }}
          >
            <EyeOff size={14} />
            <Typography
              variant="body2"
              color="text.disabled"
              fontStyle="italic"
              sx={{ fontSize: "0.8rem" }}
            >
              Hidden until reveal
            </Typography>
          </Stack>
        ) : (
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              lineHeight: 1.5,
              color: "text.primary",
            }}
          >
            {note.text}
          </Typography>
        )}

        {!hidden && note.contexts.length > 0 && (
          <Stack
            spacing={0.5}
            sx={{
              mt: 1,
              pl: 1,
              borderLeft: 2,
              borderColor: "primary.main",
              borderRadius: 0.5,
            }}
          >
            {note.contexts.map((c) => (
              <Stack
                key={c.id}
                direction="row"
                spacing={0.5}
                alignItems="flex-start"
                sx={{
                  "&:hover .context-delete": { opacity: 1 },
                }}
              >
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.78rem",
                      lineHeight: 1.45,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {c.text}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    fontFamily="var(--font-geist-mono), monospace"
                    sx={{ fontSize: "0.6rem" }}
                  >
                    — {c.authorName}
                    {c.authorId === participantId ? " (you)" : ""}
                  </Typography>
                </Box>
                {c.authorId === participantId && !asOverlay && (
                  <IconButton
                    className="context-delete"
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteContext(c.id);
                    }}
                    onPointerDown={(e) => {
                      e.stopPropagation();
                    }}
                    aria-label="Delete context"
                    title="Delete"
                    sx={{
                      p: 0.25,
                      opacity: { xs: 1, sm: 0 },
                      transition: "opacity 0.15s",
                      color: "text.disabled",
                    }}
                  >
                    <X size={10} />
                  </IconButton>
                )}
              </Stack>
            ))}
          </Stack>
        )}

        {addingContext && !asOverlay && (
          <Box
            sx={{ mt: 1 }}
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
          >
            <TextField
              autoFocus
              size="small"
              fullWidth
              multiline
              minRows={1}
              maxRows={3}
              placeholder="Clarify what this card meant..."
              value={contextDraft}
              onChange={(e) => {
                setContextDraft(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const trimmed = contextDraft.trim();
                  if (!trimmed) return;
                  onAddContext(trimmed);
                  setContextDraft("");
                  setAddingContext(false);
                }
                if (e.key === "Escape") {
                  setContextDraft("");
                  setAddingContext(false);
                }
              }}
              slotProps={{
                htmlInput: {
                  maxLength: CONTEXT_MAX_LENGTH,
                  style: { fontSize: "0.8rem" },
                },
              }}
            />
            <Stack
              direction="row"
              spacing={0.5}
              justifyContent="space-between"
              alignItems="center"
              sx={{ mt: 0.5 }}
            >
              <Typography
                variant="caption"
                color="text.disabled"
                sx={{ fontSize: "0.6rem" }}
              >
                {contextDraft.length}/{CONTEXT_MAX_LENGTH}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <Button
                  size="small"
                  onClick={() => {
                    setContextDraft("");
                    setAddingContext(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  disabled={contextDraft.trim().length === 0}
                  onClick={() => {
                    const trimmed = contextDraft.trim();
                    if (!trimmed) return;
                    onAddContext(trimmed);
                    setContextDraft("");
                    setAddingContext(false);
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          sx={{
            mt: 1,
            pt: 1,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          {revealed && !hidden && (
            <ParticipantAvatar
              seed={note.authorId}
              size={20}
              title={note.authorName}
              state="static"
            />
          )}
          <Typography
            variant="caption"
            color="text.disabled"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.65rem", flex: 1 }}
          >
            {note.authorName}
            {isAuthor ? " (you)" : ""}
          </Typography>
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

        {!asOverlay && (
          <Stack
            direction="row"
            spacing={0.25}
            className="note-actions"
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
            {canAnnotate && !addingContext && (
              <IconButton
                size="small"
                onClick={() => {
                  setAddingContext(true);
                }}
                aria-label="Add context"
                title="Add context"
                sx={{ p: 0.25 }}
              >
                <MessageSquarePlus size={14} />
              </IconButton>
            )}
            {revealed && !hidden && note.text !== null && (
              <IconButton
                size="small"
                onClick={() => {
                  onPromote(note.text ?? "");
                }}
                aria-label="Promote to action item"
                title="Promote to action item"
                sx={{ p: 0.25 }}
              >
                <ArrowUpRight size={14} />
              </IconButton>
            )}
            {isAuthor && !hidden && !revealed && (
              <>
                <IconButton
                  size="small"
                  onClick={() => {
                    setEditing(true);
                  }}
                  aria-label="Edit note"
                  sx={{ p: 0.25 }}
                >
                  <Pencil size={14} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => {
                    setConfirmingDelete(true);
                  }}
                  aria-label="Delete note"
                  sx={{ p: 0.25 }}
                >
                  <Trash2 size={14} />
                </IconButton>
              </>
            )}
          </Stack>
        )}
      </Box>
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this note?"
        description="This deletes your note. It cannot be undone."
        preview={note.text}
        confirmLabel="Delete"
        onCancel={() => {
          setConfirmingDelete(false);
        }}
        onConfirm={() => {
          setConfirmingDelete(false);
          onDelete();
        }}
      />
    </>
  );
}
