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
import type { RetroSessionSnapshot } from "@/lib/retro/types";
import {
  buildMarkdown,
  DEFAULT_OPTIONS,
  type ExportOptions,
} from "@/lib/retro/export-markdown";

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
                    Strip author names from notes. Action item owners are kept.
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
