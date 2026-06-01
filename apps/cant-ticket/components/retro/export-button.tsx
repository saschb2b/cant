"use client";

import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Clipboard } from "lucide-react";
import type { NoteSnapshot, RetroSessionSnapshot } from "@/lib/retro/types";
import { countLabel } from "@/lib/retro/format";

interface ExportOptions {
  includeHeader: boolean;
  includeNotes: boolean;
  includeContexts: boolean;
  includeActions: boolean;
  includeVotes: boolean;
  anonymous: boolean;
}

const DEFAULT_OPTIONS: ExportOptions = {
  includeHeader: true,
  includeNotes: true,
  includeContexts: true,
  includeActions: true,
  includeVotes: true,
  anonymous: false,
};

const STORAGE_KEY = "cant-ticket:retro:export-opts";

function loadOptions(): ExportOptions {
  if (typeof window === "undefined") return DEFAULT_OPTIONS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_OPTIONS;
    const parsed = JSON.parse(raw) as Partial<ExportOptions>;
    return { ...DEFAULT_OPTIONS, ...parsed };
  } catch {
    return DEFAULT_OPTIONS;
  }
}

function saveOptions(options: ExportOptions): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(options));
  } catch {
    // ignore
  }
}

function authorOf(name: string, anonymous: boolean): string {
  return anonymous ? "Anonymous" : name;
}

interface ColumnItem {
  kind: "note" | "stack";
  groupId?: string;
  notes: NoteSnapshot[];
  /** Sort key for ordering items within the column. */
  primaryCreatedAt: number;
}

function buildColumnItems(notes: NoteSnapshot[]): ColumnItem[] {
  const stacks = new Map<string, NoteSnapshot[]>();
  const loose: NoteSnapshot[] = [];
  for (const note of notes) {
    if (note.groupId) {
      const arr = stacks.get(note.groupId) ?? [];
      arr.push(note);
      stacks.set(note.groupId, arr);
    } else {
      loose.push(note);
    }
  }
  const items: ColumnItem[] = [];
  for (const [groupId, members] of stacks) {
    if (members.length === 1) {
      const only = members[0];
      if (only) {
        items.push({
          kind: "note",
          notes: [only],
          primaryCreatedAt: only.createdAt,
        });
      }
      continue;
    }
    const primaryCreatedAt = Math.min(...members.map((n) => n.createdAt));
    items.push({ kind: "stack", groupId, notes: members, primaryCreatedAt });
  }
  for (const note of loose) {
    items.push({
      kind: "note",
      notes: [note],
      primaryCreatedAt: note.createdAt,
    });
  }
  return items;
}

function voteCountForItem(
  item: ColumnItem,
  voteCounts: Record<string, number>,
): number {
  if (item.kind === "stack" && item.groupId) {
    return voteCounts[`group:${item.groupId}`] ?? 0;
  }
  const note = item.notes[0];
  if (!note) return 0;
  return voteCounts[`note:${note.id}`] ?? 0;
}

function renderNoteLine(
  note: NoteSnapshot,
  options: ExportOptions,
  voteCounts: Record<string, number>,
  indent: number,
  showVoteSuffix: boolean,
): string[] {
  const out: string[] = [];
  const prefix = " ".repeat(indent);
  const text = (note.text ?? "(hidden)").replace(/\r?\n/g, " ");
  const author = authorOf(note.authorName, options.anonymous);
  let suffix = "";
  if (showVoteSuffix && options.includeVotes) {
    const count = voteCounts[`note:${note.id}`] ?? 0;
    if (count > 0) suffix = ` (${countLabel(count, "vote")})`;
  }
  out.push(`${prefix}- ${text} — ${author}${suffix}`);
  if (options.includeContexts) {
    for (const ctx of note.contexts) {
      const ctxText = ctx.text.replace(/\r?\n/g, " ");
      const ctxAuthor = authorOf(ctx.authorName, options.anonymous);
      out.push(`${prefix}  > Context (${ctxAuthor}): ${ctxText}`);
    }
  }
  return out;
}

function buildMarkdown(
  session: RetroSessionSnapshot,
  options: ExportOptions,
): string {
  const lines: string[] = [];

  if (options.includeHeader) {
    const title = session.topic.trim() || `Retro ${session.id}`;
    const date = new Date().toISOString().slice(0, 10);
    lines.push(`# ${title}`);
    lines.push("");
    lines.push(`Date: ${date}`);
    lines.push(`Template: ${session.template.name}`);
    lines.push("");
  }

  if (options.includeNotes) {
    lines.push("## Notes");
    for (const column of session.template.columns) {
      const inCol = session.notes.filter((n) => n.columnId === column.id);
      if (inCol.length === 0) continue;

      const items = buildColumnItems(inCol);
      items.sort((a, b) => {
        if (options.includeVotes) {
          const va = voteCountForItem(a, session.voteCounts);
          const vb = voteCountForItem(b, session.voteCounts);
          if (va !== vb) return vb - va;
        }
        return a.primaryCreatedAt - b.primaryCreatedAt;
      });

      lines.push("");
      lines.push(`### ${column.name}`);
      for (const item of items) {
        if (item.kind === "note") {
          const note = item.notes[0];
          if (!note) continue;
          lines.push(
            ...renderNoteLine(note, options, session.voteCounts, 0, true),
          );
          continue;
        }
        // Stack: top of the stack is the headline (rank 0).
        const sorted = [...item.notes].sort((a, b) => a.rank - b.rank);
        const top = sorted[0];
        if (!top) continue;
        const topText = (top.text ?? "(hidden)").replace(/\r?\n/g, " ");
        const topAuthor = authorOf(top.authorName, options.anonymous);
        let suffix = "";
        if (options.includeVotes && item.groupId) {
          const count = session.voteCounts[`group:${item.groupId}`] ?? 0;
          if (count > 0) suffix = ` (${countLabel(count, "vote")})`;
        }
        lines.push(`- ${topText} — ${topAuthor}${suffix}`);
        if (options.includeContexts) {
          for (const ctx of top.contexts) {
            const ctxText = ctx.text.replace(/\r?\n/g, " ");
            const ctxAuthor = authorOf(ctx.authorName, options.anonymous);
            lines.push(`  > Context (${ctxAuthor}): ${ctxText}`);
          }
        }
        for (let i = 1; i < sorted.length; i += 1) {
          const sib = sorted[i];
          if (!sib) continue;
          // Suppress per-note vote suffix inside a stack — the headline
          // already carries the stack's total.
          lines.push(
            ...renderNoteLine(sib, options, session.voteCounts, 2, false),
          );
        }
      }
    }
    lines.push("");
  }

  if (options.includeActions) {
    lines.push("## Action items");
    if (session.actionItems.length === 0) {
      lines.push("");
      lines.push("_None captured._");
    } else {
      const sorted = [...session.actionItems].sort(
        (a, b) => a.createdAt - b.createdAt,
      );
      for (const action of sorted) {
        const cleaned = action.text.replace(/\r?\n/g, " ");
        const owner =
          action.owner && !options.anonymous ? ` (owner: ${action.owner})` : "";
        lines.push(`- [ ] ${cleaned}${owner}`);
      }
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd() + "\n";
}

export interface ExportButtonProps {
  session: RetroSessionSnapshot;
}

export function ExportButton({ session }: ExportButtonProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  // Lazy initializer reads localStorage once on first render. loadOptions
  // returns DEFAULT_OPTIONS on the server (no window), so SSR is safe and
  // the dialog content (only rendered when open) gets the saved options.
  const [options, setOptions] = useState(loadOptions);

  const totalVotes = useMemo(
    () => Object.values(session.voteCounts).reduce((a, b) => a + b, 0),
    [session.voteCounts],
  );
  const hasVotes = totalVotes > 0;

  const setOption = useCallback(
    <K extends keyof ExportOptions>(key: K, value: ExportOptions[K]) => {
      setOptions((prev) => {
        const next: ExportOptions = { ...prev, [key]: value };
        // includeContexts is meaningful only when includeNotes is on.
        if (key === "includeNotes" && value === false) {
          next.includeContexts = false;
        }
        if (key === "includeNotes" && value === true && !prev.includeContexts) {
          // Re-enabling notes doesn't auto-re-enable contexts; respect the
          // user's previous choice when set explicitly.
          next.includeContexts = prev.includeContexts;
        }
        saveOptions(next);
        return next;
      });
    },
    [],
  );

  const canCopy =
    options.includeHeader || options.includeNotes || options.includeActions;

  async function copy() {
    try {
      await navigator.clipboard.writeText(buildMarkdown(session, options));
      setCopied(true);
      setDialogOpen(false);
    } catch {
      // ignore — surface no error since clipboard is best-effort
    }
  }

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<Clipboard size={16} />}
        onClick={() => {
          setDialogOpen(true);
        }}
      >
        Export
      </Button>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        maxWidth="xs"
        fullWidth
        slotProps={{ paper: { sx: { borderRadius: 3 } } }}
      >
        <DialogTitle sx={{ pb: 0.5 }}>Export retro</DialogTitle>
        <DialogContent>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: "block", mb: 1.5 }}
          >
            Copy a markdown snapshot of the retro to paste into Confluence,
            Linear, or wherever.
          </Typography>

          <SectionHeader>Sections</SectionHeader>
          <Stack spacing={0.25}>
            <CheckboxRow
              label="Header (date, template)"
              checked={options.includeHeader}
              onChange={(v) => {
                setOption("includeHeader", v);
              }}
            />
            <CheckboxRow
              label="Notes"
              checked={options.includeNotes}
              onChange={(v) => {
                setOption("includeNotes", v);
              }}
            />
            <Box sx={{ pl: 3.5 }}>
              <CheckboxRow
                label="Include clarifying contexts"
                checked={options.includeContexts}
                disabled={!options.includeNotes}
                onChange={(v) => {
                  setOption("includeContexts", v);
                }}
              />
            </Box>
            <CheckboxRow
              label="Action items"
              checked={options.includeActions}
              onChange={(v) => {
                setOption("includeActions", v);
              }}
            />
          </Stack>

          <SectionHeader sx={{ mt: 2 }}>Options</SectionHeader>
          <Stack spacing={0.25}>
            <CheckboxRow
              label={
                hasVotes
                  ? "Show vote counts (sorts by votes)"
                  : "Show vote counts"
              }
              checked={options.includeVotes}
              disabled={!hasVotes || !options.includeNotes}
              hint={!hasVotes ? "No votes have been cast yet" : undefined}
              onChange={(v) => {
                setOption("includeVotes", v);
              }}
            />
            <FormControlLabel
              sx={{ ml: -1, mt: 0.5 }}
              control={
                <Switch
                  size="small"
                  checked={options.anonymous}
                  onChange={(e) => {
                    setOption("anonymous", e.target.checked);
                  }}
                />
              }
              label={
                <Box>
                  <Typography variant="body2">Anonymous</Typography>
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{
                      display: "block",
                      fontSize: "0.7rem",
                      lineHeight: 1.3,
                    }}
                  >
                    Strip author names and action item owners.
                  </Typography>
                </Box>
              }
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => {
              setDialogOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            startIcon={<Clipboard size={14} />}
            disabled={!canCopy}
            onClick={() => {
              void copy();
            }}
          >
            Copy as markdown
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={copied}
        autoHideDuration={2000}
        onClose={() => {
          setCopied(false);
        }}
        message="Retro copied to clipboard"
      />
    </>
  );
}

function SectionHeader({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: Record<string, unknown>;
}) {
  return (
    <Typography
      variant="overline"
      color="text.secondary"
      fontFamily="var(--font-geist-mono), ui-monospace, monospace"
      sx={{
        display: "block",
        fontSize: "0.6rem",
        letterSpacing: "0.12em",
        mb: 0.5,
        ...sx,
      }}
    >
      {children}
    </Typography>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
  disabled,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            size="small"
            checked={checked}
            disabled={disabled}
            onChange={(e) => {
              onChange(e.target.checked);
            }}
          />
        }
        label={<Typography variant="body2">{label}</Typography>}
        sx={{ ml: -1, mr: 0 }}
      />
      {hint && (
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{
            display: "block",
            pl: 4,
            mt: -0.5,
            fontSize: "0.7rem",
            lineHeight: 1.3,
          }}
        >
          {hint}
        </Typography>
      )}
    </Box>
  );
}
