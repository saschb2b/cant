"use client";

import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Pencil, Plus, Trash2 } from "lucide-react";
import type { ActionItemSnapshot } from "@/lib/retro/types";
import { ConfirmDialog } from "./confirm-dialog";

export interface ActionComposerState {
  text: string;
  owner: string;
}

export interface ActionPanelProps {
  actions: ActionItemSnapshot[];
  /** When non-null, the composer is open with this content. */
  composer: ActionComposerState | null;
  onOpenComposer: () => void;
  onComposerChange: (next: ActionComposerState) => void;
  onCancelComposer: () => void;
  onSubmitComposer: () => void;
  onEdit: (actionId: string, text: string, owner: string) => void;
  onDelete: (actionId: string) => void;
}

export function ActionPanel({
  actions,
  composer,
  onOpenComposer,
  onComposerChange,
  onCancelComposer,
  onSubmitComposer,
  onEdit,
  onDelete,
}: ActionPanelProps) {
  const sorted = [...actions].sort((a, b) => a.createdAt - b.createdAt);
  const adding = composer !== null;
  const canSubmit = composer !== null && composer.text.trim().length > 0;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 } }}>
      <Stack spacing={1.5}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="subtitle1" fontWeight={700}>
            Action items{" "}
            <Box
              component="span"
              sx={{ color: "text.disabled", fontWeight: 500 }}
            >
              ({actions.length})
            </Box>
          </Typography>
          {!adding && (
            <Button
              size="small"
              variant="outlined"
              startIcon={<Plus size={14} />}
              onClick={onOpenComposer}
            >
              Add
            </Button>
          )}
        </Stack>

        {composer && (
          <Stack
            spacing={1}
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (canSubmit) onSubmitComposer();
            }}
          >
            <TextField
              autoFocus
              multiline
              minRows={2}
              size="small"
              placeholder="What's the action?"
              value={composer.text}
              onChange={(e) => {
                onComposerChange({ ...composer, text: e.target.value });
              }}
              slotProps={{ htmlInput: { maxLength: 500 } }}
              fullWidth
            />
            <TextField
              size="small"
              placeholder="Owner (optional)"
              value={composer.owner}
              onChange={(e) => {
                onComposerChange({ ...composer, owner: e.target.value });
              }}
              slotProps={{ htmlInput: { maxLength: 60 } }}
              fullWidth
            />
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" onClick={onCancelComposer}>
                Cancel
              </Button>
              <Button
                type="submit"
                size="small"
                variant="contained"
                disabled={!canSubmit}
              >
                Add action
              </Button>
            </Stack>
          </Stack>
        )}

        {sorted.length === 0 && !adding ? (
          <Typography variant="body2" color="text.disabled">
            No actions yet. Discuss the notes and capture commitments here.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {sorted.map((action) => (
              <ActionRow
                key={action.id}
                action={action}
                onEdit={(text, owner) => {
                  onEdit(action.id, text, owner);
                }}
                onDelete={() => {
                  onDelete(action.id);
                }}
              />
            ))}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

interface ActionRowProps {
  action: ActionItemSnapshot;
  onEdit: (text: string, owner: string) => void;
  onDelete: () => void;
}

function ActionRow({ action, onEdit, onDelete }: ActionRowProps) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(action.text);
  const [owner, setOwner] = useState(action.owner);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  if (editing) {
    return (
      <Box
        sx={{
          p: 1.25,
          border: 1,
          borderColor: "primary.main",
          borderRadius: 1,
          bgcolor: "background.paper",
        }}
      >
        <Stack spacing={1}>
          <TextField
            autoFocus
            multiline
            minRows={2}
            size="small"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
            }}
            slotProps={{ htmlInput: { maxLength: 500 } }}
            fullWidth
          />
          <TextField
            size="small"
            placeholder="Owner (optional)"
            value={owner}
            onChange={(e) => {
              setOwner(e.target.value);
            }}
            slotProps={{ htmlInput: { maxLength: 60 } }}
            fullWidth
          />
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              size="small"
              onClick={() => {
                setText(action.text);
                setOwner(action.owner);
                setEditing(false);
              }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              onClick={() => {
                const trimmed = text.trim();
                if (!trimmed) return;
                onEdit(trimmed, owner.trim());
                setEditing(false);
              }}
              disabled={text.trim().length === 0}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          p: 1.25,
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          bgcolor: "background.paper",
          "&:hover .action-tools": { opacity: 1 },
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          alignItems="flex-start"
          justifyContent="space-between"
        >
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}
            >
              {action.text}
            </Typography>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mt: 0.5 }}
            >
              {action.owner && (
                <Typography
                  variant="caption"
                  fontWeight={600}
                  color="primary.main"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ fontSize: "0.65rem" }}
                >
                  @{action.owner}
                </Typography>
              )}
              <Typography
                variant="caption"
                color="text.disabled"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ fontSize: "0.65rem" }}
              >
                from {action.authorName}
              </Typography>
            </Stack>
          </Box>
          <Stack
            direction="row"
            spacing={0.25}
            className="action-tools"
            sx={{
              opacity: { xs: 1, sm: 0 },
              transition: "opacity 0.15s",
            }}
          >
            <IconButton
              size="small"
              onClick={() => {
                setEditing(true);
              }}
              aria-label="Edit action"
              sx={{ p: 0.25 }}
            >
              <Pencil size={14} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => {
                setConfirmingDelete(true);
              }}
              aria-label="Delete action"
              sx={{ p: 0.25 }}
            >
              <Trash2 size={14} />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this action item?"
        description="This removes the commitment for everyone in the room. It cannot be undone."
        preview={action.text}
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
