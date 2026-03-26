import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import { ExternalLink } from "lucide-react";
import { ALL_APPS } from "../../lib/cant-apps";

export interface LobbyCrossPromoProps {
  currentAppName: string;
}

export function LobbyCrossPromo({ currentAppName }: LobbyCrossPromoProps) {
  const otherApps = ALL_APPS.filter((a) => a.name !== currentAppName);

  if (otherApps.length === 0) return null;

  return (
    <Box sx={{ pb: { xs: 3, md: 6 } }}>
      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{
          fontSize: "0.63rem",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          mb: 1.5,
          display: "block",
        }}
      >
        More topics
      </Typography>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        {otherApps.map((site) => (
          <Box
            key={site.name}
            component="a"
            href={`${site.href}/play`}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: "block",
              textDecoration: "none",
              color: "inherit",
              flex: 1,
            }}
          >
            <Paper
              elevation={0}
              sx={{
                border: 1,
                borderColor: "divider",
                overflow: "hidden",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: "text.secondary",
                  transform: "translateY(-1px)",
                },
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                spacing={0.75}
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: "action.selected",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={600}
                  sx={{ fontSize: "0.72rem" }}
                >
                  {site.name}
                </Typography>
                <Box
                  sx={{
                    ml: "auto",
                    color: "text.disabled",
                    display: "flex",
                  }}
                >
                  <ExternalLink size={12} />
                </Box>
              </Stack>
              <Box sx={{ p: 2 }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ lineHeight: 1.5 }}
                >
                  {site.playPitch}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  fontFamily="var(--font-geist-mono), monospace"
                  sx={{ mt: 1, display: "block", fontSize: "0.65rem" }}
                >
                  {site.tags}
                </Typography>
              </Box>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
