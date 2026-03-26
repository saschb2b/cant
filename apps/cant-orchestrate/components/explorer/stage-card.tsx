import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import type { DockerStage } from "@/lib/explorer/types";
import { StepRow } from "./step-row";

export function StageCard({
  stage,
  isLast,
}: {
  stage: DockerStage;
  isLast: boolean;
}) {
  const isGlobal = stage.baseImage === "(global)";
  const hasTagIssue =
    !isGlobal && (stage.tag === null || stage.tag === "latest");

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          border: 1,
          borderColor: isLast ? "primary.main" : "divider",
          overflow: "hidden",
          ...(isLast && {
            boxShadow:
              "0 0 0 1px rgba(var(--mui-palette-primary-mainChannel) / 0.15), 0 2px 12px rgba(var(--mui-palette-primary-mainChannel) / 0.06)",
          }),
        }}
      >
        {/* Stage header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: isLast
              ? "rgba(var(--mui-palette-primary-mainChannel) / 0.06)"
              : "secondary.main",
          }}
        >
          <Typography
            variant="body2"
            fontFamily="var(--font-geist-mono), monospace"
            fontWeight={700}
            sx={{ fontSize: "0.78rem" }}
          >
            {isGlobal ? "Global args" : `Stage ${String(stage.index + 1)}`}
          </Typography>

          {stage.name && (
            <Typography
              variant="caption"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                px: 0.75,
                py: 0.125,
                borderRadius: 0.75,
                bgcolor: "rgba(var(--mui-palette-primary-mainChannel) / 0.1)",
                color: "primary.main",
                fontWeight: 600,
                fontSize: "0.65rem",
              }}
            >
              AS {stage.name}
            </Typography>
          )}

          {!isGlobal && (
            <Typography
              variant="caption"
              fontFamily="var(--font-geist-mono), monospace"
              color="text.secondary"
              sx={{ fontSize: "0.72rem", ml: "auto" }}
            >
              FROM {stage.baseImage}
            </Typography>
          )}

          {hasTagIssue && (
            <Typography
              variant="caption"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                px: 0.75,
                py: 0.125,
                borderRadius: 0.75,
                bgcolor: "rgba(var(--mui-palette-warning-mainChannel) / 0.12)",
                color: "warning.main",
                fontWeight: 600,
                fontSize: "0.6rem",
              }}
            >
              {stage.tag === null ? "no tag" : "latest"}
            </Typography>
          )}

          {isLast && !isGlobal && (
            <Typography
              variant="caption"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{
                px: 0.75,
                py: 0.125,
                borderRadius: 0.75,
                bgcolor: "rgba(var(--mui-palette-success-mainChannel) / 0.1)",
                color: "success.main",
                fontWeight: 600,
                fontSize: "0.6rem",
              }}
            >
              final
            </Typography>
          )}
        </Box>

        {/* Instructions */}
        {stage.instructions.length > 0 ? (
          <Stack spacing={0}>
            {stage.instructions.map((inst, i) => (
              <StepRow key={`${String(inst.line)}-${String(i)}`} step={inst} />
            ))}
          </Stack>
        ) : (
          <Box sx={{ px: 2, py: 1.5 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              fontFamily="var(--font-geist-mono), monospace"
              sx={{ fontSize: "0.78rem", fontStyle: "italic" }}
            >
              No instructions
            </Typography>
          </Box>
        )}

        {/* Layer summary */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            px: 2,
            py: 0.75,
            borderTop: 1,
            borderColor: "divider",
            bgcolor: "rgba(var(--mui-palette-text-primaryChannel) / 0.02)",
          }}
        >
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.65rem" }}
          >
            {String(stage.instructions.filter((i) => i.createsLayer).length)}{" "}
            layers
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.65rem" }}
          >
            {String(stage.instructions.length)} instructions
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
