"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type UIEvent,
} from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import { codeBlockStyles } from "@cant/shared/lib";
import { getHighlighter, highlightDual } from "@/lib/shiki";
import { useTypeExpander } from "@/lib/playground/use-type-expander";
import { presets } from "@/lib/playground/presets";

type Highlighter = Awaited<ReturnType<typeof getHighlighter>>;

function useShikiHighlighter() {
  const ref = useRef<Highlighter | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void getHighlighter().then((h) => {
      ref.current = h;
      setReady(true);
    });
  }, []);

  const highlight = useCallback(
    (code: string) => {
      if (!ref.current) return "";
      return highlightDual(ref.current, code);
    },
    [ready], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { highlight, ready };
}

function PanelHeader({
  label,
  trailing,
}: {
  label: string;
  trailing?: React.ReactNode;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
        bgcolor: "secondary.main",
      }}
    >
      <Typography
        variant="body2"
        fontFamily="var(--font-geist-mono), monospace"
        fontWeight={700}
      >
        {label}
      </Typography>
      {trailing}
    </Box>
  );
}

export function PlaygroundEditor() {
  const [code, setCode] = useState(presets[0]?.code ?? "");
  const [activePreset, setActivePreset] = useState(presets[0]?.id ?? "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const { highlight, ready: shikiReady } = useShikiHighlighter();
  const { types, error, isLoading, isReady, expand } = useTypeExpander();

  // Highlight input (derived from code + shiki readiness)
  const inputHtml = useMemo(
    () => (shikiReady ? highlight(code) : ""),
    [code, shikiReady, highlight],
  );

  // Expand types when code changes
  useEffect(() => {
    if (!isReady) return;
    expand(code);
  }, [code, isReady, expand]);

  // Highlight each expanded type individually
  const outputItems = useMemo(() => {
    if (!shikiReady || types.length === 0) return [];
    return types.map((t) => ({
      name: t.name,
      html: highlight(`type ${t.name} = ${t.expanded};`),
    }));
  }, [types, shikiReady, highlight]);

  const handlePreset = useCallback((id: string) => {
    const preset = presets.find((p) => p.id === id);
    if (!preset) return;
    setCode(preset.code);
    setActivePreset(id);
  }, []);

  const handleInput = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCode(e.target.value);
      setActivePreset("");
    },
    [],
  );

  const handleScroll = useCallback((e: UIEvent<HTMLTextAreaElement>) => {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.currentTarget.scrollTop;
      highlightRef.current.scrollLeft = e.currentTarget.scrollLeft;
    }
  }, []);

  return (
    <Stack spacing={2.5}>
      {/* Presets */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {presets.map((preset) => (
          <Chip
            key={preset.id}
            label={preset.label}
            size="small"
            onClick={() => handlePreset(preset.id)}
            sx={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontWeight: 500,
              fontSize: "0.75rem",
              bgcolor:
                activePreset === preset.id ? "primary.main" : "secondary.main",
              color:
                activePreset === preset.id
                  ? "primary.contrastText"
                  : "text.primary",
              "&:hover": {
                bgcolor:
                  activePreset === preset.id
                    ? "primary.main"
                    : "action.selected",
              },
            }}
          />
        ))}
      </Box>

      {/* Editor panels */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ minHeight: 400 }}
      >
        {/* Input panel */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <PanelHeader label="Input" />
          <Box
            sx={{
              flex: 1,
              position: "relative",
              bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
              ...codeBlockStyles,
            }}
          >
            {/* Shiki highlight layer */}
            <Box
              ref={highlightRef}
              dangerouslySetInnerHTML={{ __html: inputHtml }}
              aria-hidden
              sx={{
                position: "absolute",
                inset: 0,
                pointerEvents: "none",
                overflow: "hidden",
              }}
            />
            {/* Editable textarea */}
            <Box
              component="textarea"
              ref={textareaRef}
              value={code}
              onChange={handleInput}
              onScroll={handleScroll}
              spellCheck={false}
              autoCapitalize="off"
              autoComplete="off"
              autoCorrect="off"
              sx={{
                position: "relative",
                width: "100%",
                minHeight: 320,
                resize: "vertical",
                border: "none",
                outline: "none",
                background: "transparent",
                color: "transparent",
                caretColor: "text.primary",
                fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
                fontSize: "0.85rem",
                lineHeight: 1.7,
                p: 2,
                m: 0,
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                overflow: "auto",
                WebkitTextFillColor: "transparent",
              }}
            />
          </Box>
        </Paper>

        {/* Output panel */}
        <Paper
          elevation={0}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            border: 1,
            borderColor: "divider",
            overflow: "hidden",
            minWidth: 0,
          }}
        >
          <PanelHeader
            label="Expanded Types"
            trailing={
              isLoading ? (
                <CircularProgress size={14} sx={{ color: "text.secondary" }} />
              ) : !isReady ? (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                >
                  Loading compiler...
                </Typography>
              ) : null
            }
          />
          <Box
            sx={{
              flex: 1,
              overflow: "auto",
            }}
          >
            {error ? (
              <Box
                sx={{
                  p: 2,
                  bgcolor:
                    "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
                }}
              >
                <Typography
                  variant="body2"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{
                    color: "error.main",
                    fontSize: "0.85rem",
                    lineHeight: 1.7,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {error}
                </Typography>
              </Box>
            ) : outputItems.length > 0 ? (
              <Stack spacing={0}>
                {outputItems.map((item) => (
                  <Box
                    key={item.name}
                    sx={{
                      borderBottom: 1,
                      borderColor: "divider",
                      "&:last-child": { borderBottom: 0 },
                    }}
                  >
                    <Box
                      sx={{
                        px: 2,
                        py: 0.75,
                        bgcolor:
                          "rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
                        borderBottom: 1,
                        borderColor: "divider",
                      }}
                    >
                      <Typography
                        variant="caption"
                        fontFamily="var(--font-geist-mono), monospace"
                        fontWeight={600}
                        sx={{ color: "primary.main" }}
                      >
                        {item.name}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        bgcolor:
                          "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
                        ...codeBlockStyles,
                      }}
                      dangerouslySetInnerHTML={{ __html: item.html }}
                    />
                  </Box>
                ))}
              </Stack>
            ) : !isLoading && types.length === 0 && isReady ? (
              <Box
                sx={{
                  p: 2,
                  bgcolor:
                    "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
                  height: "100%",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ fontSize: "0.85rem" }}
                >
                  Write a type alias to see it expanded.
                </Typography>
              </Box>
            ) : null}
          </Box>
        </Paper>
      </Stack>
    </Stack>
  );
}
