import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ArrowDown } from "lucide-react";
import { ALL_APPS } from "@cant/shared/lib/cant-apps";
import { ColorBar } from "./color-bar";

const TOTAL_CHALLENGES = 593;

export function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        pt: { xs: 10, md: 16 },
        pb: { xs: 8, md: 12 },
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 40% 50%, rgba(212,168,67,0.18) 0%, rgba(61,139,114,0.10) 35%, transparent 65%), radial-gradient(ellipse at 65% 60%, rgba(124,58,237,0.10) 0%, rgba(49,120,198,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Box sx={{ textAlign: "center", maxWidth: 800, mx: "auto" }}>
          <ColorBar colors={ALL_APPS.map((a) => a.colorFrom)} />

          <Typography
            variant="h1"
            component="h1"
            fontWeight={800}
            sx={{
              mt: 3,
              fontSize: { xs: "2.75rem", sm: "3.5rem", md: "4.5rem" },
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {"The Can't Series"}
          </Typography>

          <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            fontWeight={400}
            sx={{
              mt: 3,
              fontSize: { xs: "1.1rem", md: "1.35rem" },
              lineHeight: 1.6,
              maxWidth: 560,
              mx: "auto",
            }}
          >
            Two options. One is better. Pick it, then find out why.
          </Typography>

          {/* Stats */}
          <Stack
            direction="row"
            spacing={{ xs: 3, md: 5 }}
            justifyContent="center"
            sx={{ mt: 5 }}
          >
            <StatChip value={String(ALL_APPS.length)} label="topics" />
            <StatChip value={String(TOTAL_CHALLENGES)} label="challenges" />
            <Typography
              variant="h5"
              component="span"
              fontWeight={800}
              color="secondary"
              sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
            >
              free
            </Typography>
          </Stack>

          {/* CTA */}
          <Button
            component="a"
            href="#series"
            variant="contained"
            size="large"
            endIcon={<ArrowDown size={18} />}
            sx={{
              mt: 4,
              px: 4,
              py: 1.5,
              bgcolor: "secondary.main",
              color: "secondary.contrastText",
              fontSize: "0.95rem",
              "&:hover": {
                bgcolor: "secondary.dark",
              },
            }}
          >
            Start learning
          </Button>
        </Box>

      </Container>
    </Box>
  );
}

function StatChip({ value, label }: { value: string; label: string }) {
  return (
    <Box sx={{ display: "flex", alignItems: "baseline", gap: 0.75 }}>
      <Typography
        variant="h5"
        component="span"
        fontWeight={800}
        color="secondary"
        sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" } }}
      >
        {value}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{ fontSize: { xs: "0.7rem", md: "0.8rem" } }}
      >
        {label}
      </Typography>
    </Box>
  );
}

