import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { DockerInstruction } from "@/lib/explorer/types";

export function StepRow({ step }: { step: DockerInstruction }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "flex-start",
        gap: 1.5,
        px: 2,
        py: 1,
        borderBottom: 1,
        borderColor: "divider",
        "&:last-child": { borderBottom: 0 },
      }}
    >
      {/* Layer indicator dot */}
      <Box
        sx={{
          mt: 0.6,
          width: 8,
          height: 8,
          borderRadius: "50%",
          flexShrink: 0,
          bgcolor: step.createsLayer ? "primary.main" : "transparent",
          border: step.createsLayer ? "none" : "1.5px solid",
          borderColor: step.createsLayer ? undefined : "text.secondary",
          opacity: step.createsLayer ? 0.8 : 0.4,
        }}
      />

      {/* Instruction keyword */}
      <Typography
        variant="body2"
        fontFamily="var(--font-geist-mono), monospace"
        fontWeight={700}
        sx={{
          flexShrink: 0,
          minWidth: 80,
          fontSize: "0.78rem",
          color: "primary.main",
        }}
      >
        {step.instruction}
      </Typography>

      {/* Arguments */}
      <Typography
        variant="body2"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          flex: 1,
          minWidth: 0,
          fontSize: "0.78rem",
          lineHeight: 1.6,
          color: "text.primary",
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {step.args}
      </Typography>

      {/* Badge */}
      <Typography
        variant="caption"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          flexShrink: 0,
          mt: 0.3,
          px: 0.75,
          py: 0.125,
          borderRadius: 0.75,
          fontSize: "0.6rem",
          fontWeight: 600,
          bgcolor: step.createsLayer
            ? "rgba(var(--mui-palette-primary-mainChannel) / 0.1)"
            : "rgba(var(--mui-palette-text-primaryChannel) / 0.05)",
          color: step.createsLayer ? "primary.main" : "text.secondary",
        }}
      >
        {step.createsLayer ? "layer" : "metadata"}
      </Typography>
    </Box>
  );
}
