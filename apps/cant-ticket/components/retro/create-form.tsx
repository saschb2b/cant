"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Plus, X } from "lucide-react";
import type { BuiltinTemplateId } from "@/lib/retro/templates";
import { TEMPLATES, TEMPLATE_ORDER } from "@/lib/retro/templates";

type TemplateChoice = BuiltinTemplateId | "custom";

interface CustomCol {
  name: string;
  hint: string;
}

const DEFAULT_CUSTOM: CustomCol[] = [
  { name: "", hint: "" },
  { name: "", hint: "" },
  { name: "", hint: "" },
];

export function CreateForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [templateId, setTemplateId] = useState<TemplateChoice>("four-ls");
  const [customCols, setCustomCols] = useState(DEFAULT_CUSTOM);
  const [submitting, setSubmitting] = useState<"create" | "join" | null>(null);
  const [error, setError] = useState<string | null>(null);

  function addCustomCol() {
    if (customCols.length >= 6) return;
    setCustomCols([...customCols, { name: "", hint: "" }]);
  }

  function removeCustomCol(idx: number) {
    if (customCols.length <= 2) return;
    setCustomCols(customCols.filter((_, i) => i !== idx));
  }

  function updateCustomCol(idx: number, patch: Partial<CustomCol>) {
    setCustomCols(
      customCols.map((c, i) => (i === idx ? { ...c, ...patch } : c)),
    );
  }

  async function handleCreate(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name");
      return;
    }
    setError(null);
    setSubmitting("create");
    try {
      const body: {
        name: string;
        templateId: string;
        customColumns?: CustomCol[];
      } = {
        name: trimmedName,
        templateId,
      };
      if (templateId === "custom") {
        const filled = customCols.filter((c) => c.name.trim().length > 0);
        if (filled.length < 2) {
          setError("Custom template needs at least two columns");
          setSubmitting(null);
          return;
        }
        body.customColumns = filled;
      }
      const res = await fetch("/api/retro/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Could not create session");
      const data = (await res.json()) as {
        sessionId: string;
        participantId: string;
      };
      sessionStorage.setItem(
        `cant-ticket:retro:${data.sessionId}:participantId`,
        data.participantId,
      );
      sessionStorage.setItem(
        `cant-ticket:retro:${data.sessionId}:name`,
        trimmedName,
      );
      router.push(`/rooms/retro/${data.sessionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create session");
      setSubmitting(null);
    }
  }

  function handleJoin(e: React.SyntheticEvent) {
    e.preventDefault();
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      setError("Please enter a session code");
      return;
    }
    setError(null);
    setSubmitting("join");
    router.push(`/rooms/retro/${trimmedCode}`);
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 3, sm: 4 } }}>
      <Stack spacing={3}>
        <Box
          component="form"
          onSubmit={(e: React.SyntheticEvent) => {
            void handleCreate(e);
          }}
        >
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Start a retro
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pick a template and a name. You will get a shareable link.
              </Typography>
            </Box>

            <TextField
              label="Your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              slotProps={{ htmlInput: { maxLength: 40 } }}
              fullWidth
              autoFocus
            />

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  display: "block",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  fontSize: "0.65rem",
                  mb: 1,
                }}
              >
                Template
              </Typography>
              <Stack spacing={1}>
                {TEMPLATE_ORDER.map((id) => {
                  const t = TEMPLATES[id];
                  if (!t) return null;
                  const selected = templateId === id;
                  return (
                    <TemplateRow
                      key={id}
                      selected={selected}
                      title={t.name}
                      desc={t.description}
                      columns={t.columns.map((c) => c.name)}
                      onSelect={() => {
                        setTemplateId(id);
                      }}
                    />
                  );
                })}
                <TemplateRow
                  selected={templateId === "custom"}
                  title="Custom"
                  desc="Define your own columns below."
                  columns={[]}
                  onSelect={() => {
                    setTemplateId("custom");
                  }}
                />
              </Stack>
            </Box>

            {templateId === "custom" && (
              <Stack spacing={1.5}>
                <Typography variant="body2" color="text.secondary">
                  2 to 6 columns. Hints are optional.
                </Typography>
                {customCols.map((col, idx) => (
                  <Stack
                    key={idx}
                    direction="row"
                    spacing={1}
                    alignItems="flex-start"
                  >
                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <TextField
                        label={`Column ${String(idx + 1)} name`}
                        value={col.name}
                        onChange={(e) => {
                          updateCustomCol(idx, { name: e.target.value });
                        }}
                        size="small"
                        slotProps={{ htmlInput: { maxLength: 30 } }}
                      />
                      <TextField
                        label="Hint (optional)"
                        value={col.hint}
                        onChange={(e) => {
                          updateCustomCol(idx, { hint: e.target.value });
                        }}
                        size="small"
                        slotProps={{ htmlInput: { maxLength: 80 } }}
                      />
                    </Stack>
                    <IconButton
                      size="small"
                      onClick={() => {
                        removeCustomCol(idx);
                      }}
                      disabled={customCols.length <= 2}
                      aria-label="Remove column"
                      sx={{ mt: 0.5 }}
                    >
                      <X size={16} />
                    </IconButton>
                  </Stack>
                ))}
                {customCols.length < 6 && (
                  <Button
                    variant="text"
                    size="small"
                    startIcon={<Plus size={14} />}
                    onClick={addCustomCol}
                    sx={{ alignSelf: "flex-start" }}
                  >
                    Add column
                  </Button>
                )}
              </Stack>
            )}

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={submitting !== null}
            >
              {submitting === "create" ? "Creating..." : "Create retro"}
            </Button>
          </Stack>
        </Box>

        <Divider>or</Divider>

        <Box component="form" onSubmit={handleJoin}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Join with a code
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Got a retro code from a teammate? Drop it in.
              </Typography>
            </Box>
            <TextField
              label="Session code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value.toUpperCase());
              }}
              slotProps={{
                htmlInput: {
                  maxLength: 8,
                  style: { letterSpacing: "0.2em" },
                },
              }}
              fullWidth
            />
            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={submitting !== null}
            >
              {submitting === "join" ? "Joining..." : "Go to retro"}
            </Button>
          </Stack>
        </Box>

        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

interface TemplateRowProps {
  selected: boolean;
  title: string;
  desc: string;
  columns: string[];
  onSelect: () => void;
}

function TemplateRow({
  selected,
  title,
  desc,
  columns,
  onSelect,
}: TemplateRowProps) {
  return (
    <Box
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: 1,
        borderColor: selected ? "primary.main" : "divider",
        bgcolor: selected
          ? "rgba(var(--mui-palette-primary-mainChannel) / 0.06)"
          : "transparent",
        cursor: "pointer",
        transition: "all 0.15s ease",
        "&:hover": {
          borderColor: selected ? "primary.main" : "text.secondary",
        },
      }}
    >
      <Stack spacing={0.5}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="baseline"
          flexWrap="wrap"
        >
          <Typography
            variant="body2"
            fontWeight={700}
            color={selected ? "primary.main" : "text.primary"}
          >
            {title}
          </Typography>
          {columns.length > 0 && (
            <Typography
              variant="caption"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ fontSize: "0.7rem" }}
            >
              {columns.join(" / ")}
            </Typography>
          )}
        </Stack>
        <Typography variant="caption" color="text.secondary">
          {desc}
        </Typography>
      </Stack>
    </Box>
  );
}
