"use client";

import { useCallback, useMemo, useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import { SquarePen } from "lucide-react";
import { parseDockerfile } from "@/lib/explorer/parse-dockerfile";
import { lintDockerfile } from "@/lib/explorer/lint-rules";
import { PRESETS } from "@/lib/explorer/presets";
import { DockerfileInput, DockerfileReadonly } from "./dockerfile-input";
import { StageCard } from "./stage-card";
import { LintPanel } from "./lint-panel";

type Mode = { type: "preset"; id: string } | { type: "custom" };

export function ExplorerView() {
  const [mode, setMode] = useState<Mode>({
    type: "preset",
    id: PRESETS[0]?.id ?? "",
  });
  const [customCode, setCustomCode] = useState("");

  const dockerfile =
    mode.type === "preset"
      ? (PRESETS.find((p) => p.id === mode.id)?.dockerfile ?? "")
      : customCode;

  const parseResult = useMemo(() => parseDockerfile(dockerfile), [dockerfile]);
  const lintIssues = useMemo(() => lintDockerfile(parseResult), [parseResult]);

  const handlePreset = useCallback((id: string) => {
    setMode({ type: "preset", id });
  }, []);

  const handleCustom = useCallback(() => {
    setMode({ type: "custom" });
  }, []);

  const handleChange = useCallback((value: string) => {
    setCustomCode(value);
  }, []);

  return (
    <Stack spacing={2.5}>
      {/* Mode selector: presets + custom */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {PRESETS.map((preset) => (
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
                mode.type === "preset" && mode.id === preset.id
                  ? "primary.main"
                  : "secondary.main",
              color:
                mode.type === "preset" && mode.id === preset.id
                  ? "primary.contrastText"
                  : "text.primary",
              "&:hover": {
                bgcolor:
                  mode.type === "preset" && mode.id === preset.id
                    ? "primary.main"
                    : "action.selected",
              },
            }}
          />
        ))}
        <Chip
          icon={<SquarePen size={14} />}
          label="Your own"
          size="small"
          onClick={handleCustom}
          sx={{
            fontFamily: "var(--font-geist-mono), monospace",
            fontWeight: 500,
            fontSize: "0.75rem",
            bgcolor: mode.type === "custom" ? "primary.main" : "secondary.main",
            color:
              mode.type === "custom" ? "primary.contrastText" : "text.primary",
            "& .MuiChip-icon": {
              color:
                mode.type === "custom"
                  ? "primary.contrastText"
                  : "text.secondary",
            },
            "&:hover": {
              bgcolor:
                mode.type === "custom" ? "primary.main" : "action.selected",
            },
          }}
        />
      </Box>

      {/* Two-column layout */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{ alignItems: "flex-start" }}
      >
        {/* Left: code display */}
        {mode.type === "custom" ? (
          <DockerfileInput value={customCode} onChange={handleChange} />
        ) : (
          <DockerfileReadonly value={dockerfile} />
        )}

        {/* Right: analysis output */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {parseResult.stages.length === 0 ? (
            <Box sx={{ p: 2 }}>
              <Typography
                variant="body2"
                color="text.secondary"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{ fontSize: "0.85rem" }}
              >
                {mode.type === "custom"
                  ? "Paste a Dockerfile to see it broken down."
                  : "Select a preset to explore."}
              </Typography>
            </Box>
          ) : (
            <>
              {/* Stage summary */}
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  fontFamily="var(--font-geist-mono), monospace"
                  color="text.secondary"
                  sx={{ fontSize: "0.72rem" }}
                >
                  {String(parseResult.stages.length)} stage
                  {parseResult.stages.length !== 1 ? "s" : ""}
                </Typography>
                <Typography
                  variant="caption"
                  fontFamily="var(--font-geist-mono), monospace"
                  color="text.secondary"
                  sx={{ fontSize: "0.72rem" }}
                >
                  {String(
                    parseResult.stages.reduce(
                      (sum, s) =>
                        sum +
                        s.instructions.filter((i) => i.createsLayer).length,
                      0,
                    ),
                  )}{" "}
                  total layers
                </Typography>
              </Box>

              {/* Stage cards with connectors */}
              <Stack spacing={0}>
                {parseResult.stages.map((stage, i) => (
                  <Box key={stage.index}>
                    {i > 0 && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          py: 0.5,
                        }}
                      >
                        <Box
                          sx={{
                            width: 1.5,
                            height: 20,
                            bgcolor: "divider",
                          }}
                        />
                      </Box>
                    )}
                    <StageCard
                      stage={stage}
                      isLast={i === parseResult.stages.length - 1}
                    />
                  </Box>
                ))}
              </Stack>

              {/* Lint panel */}
              <LintPanel issues={lintIssues} />
            </>
          )}
        </Box>
      </Stack>
    </Stack>
  );
}
