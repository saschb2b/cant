import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { AlertTriangle, Info, CheckCircle } from "lucide-react";
import type { LintIssue } from "@/lib/explorer/types";

export function LintPanel({ issues }: { issues: LintIssue[] }) {
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
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
          sx={{ fontSize: "0.78rem" }}
        >
          Best Practices
        </Typography>
        {issues.length > 0 && (
          <>
            {warnings.length > 0 && (
              <Typography
                variant="caption"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  px: 0.75,
                  py: 0.125,
                  borderRadius: 0.75,
                  bgcolor:
                    "rgba(var(--mui-palette-warning-mainChannel) / 0.12)",
                  color: "warning.main",
                  fontWeight: 600,
                  fontSize: "0.6rem",
                }}
              >
                {String(warnings.length)} warning
                {warnings.length !== 1 ? "s" : ""}
              </Typography>
            )}
            {infos.length > 0 && (
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
                  fontSize: "0.6rem",
                }}
              >
                {String(infos.length)} hint{infos.length !== 1 ? "s" : ""}
              </Typography>
            )}
          </>
        )}
      </Box>

      {/* Issues */}
      {issues.length === 0 ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            px: 2,
            py: 1.5,
          }}
        >
          <CheckCircle size={14} color="var(--mui-palette-success-main)" />
          <Typography
            variant="body2"
            color="success.main"
            fontFamily="var(--font-geist-mono), monospace"
            sx={{ fontSize: "0.78rem" }}
          >
            No issues found
          </Typography>
        </Box>
      ) : (
        <Stack spacing={0}>
          {issues.map((issue, i) => (
            <Box
              key={`${issue.rule}-${String(i)}`}
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
              <Box sx={{ mt: 0.25, flexShrink: 0 }}>
                {issue.severity === "warning" ? (
                  <AlertTriangle
                    size={14}
                    color="var(--mui-palette-warning-main)"
                  />
                ) : (
                  <Info size={14} color="var(--mui-palette-primary-main)" />
                )}
              </Box>
              <Typography
                variant="body2"
                fontFamily="var(--font-geist-mono), monospace"
                sx={{
                  flex: 1,
                  fontSize: "0.75rem",
                  lineHeight: 1.6,
                  color: "text.primary",
                }}
              >
                {issue.message}
              </Typography>
              {issue.line !== null && (
                <Typography
                  variant="caption"
                  fontFamily="var(--font-geist-mono), monospace"
                  color="text.secondary"
                  sx={{ flexShrink: 0, fontSize: "0.6rem", mt: 0.3 }}
                >
                  L{String(issue.line)}
                </Typography>
              )}
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
