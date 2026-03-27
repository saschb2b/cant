"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { codeBlockStyles } from "@cant/shared/lib";
import { getHighlighter, highlightDual } from "@/lib/shiki";

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
      return highlightDual(ref.current, code, "dockerfile");
    },
    [ready], // eslint-disable-line react-hooks/exhaustive-deps
  );

  return { highlight, ready };
}

export function DockerfileInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
    },
    [onChange],
  );

  return (
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
          Your Dockerfile
        </Typography>
      </Box>

      <Box
        component="textarea"
        value={value}
        onChange={handleChange}
        spellCheck={false}
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off"
        placeholder="Paste your Dockerfile here..."
        sx={{
          flex: 1,
          width: "100%",
          minHeight: 480,
          resize: "vertical",
          border: "none",
          outline: "none",
          bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
          color: "text.primary",
          fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
          fontSize: "0.85rem",
          lineHeight: 1.7,
          p: 2,
          m: 0,
          whiteSpace: "pre",
          overflow: "auto",
          tabSize: 2,
        }}
      />
    </Paper>
  );
}

export function DockerfileReadonly({ value }: { value: string }) {
  const { highlight, ready: shikiReady } = useShikiHighlighter();

  const html = useMemo(
    () => (shikiReady ? highlight(value) : ""),
    [value, shikiReady, highlight],
  );

  return (
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
          Dockerfile
        </Typography>
        <Typography
          variant="caption"
          fontFamily="var(--font-geist-mono), monospace"
          color="text.secondary"
          sx={{ fontSize: "0.65rem" }}
        >
          read-only
        </Typography>
      </Box>

      <Box
        dangerouslySetInnerHTML={{ __html: html }}
        sx={{
          flex: 1,
          overflow: "auto",
          bgcolor: "rgba(var(--mui-palette-secondary-mainChannel) / 0.5)",
          ...codeBlockStyles,
        }}
      />
    </Paper>
  );
}
