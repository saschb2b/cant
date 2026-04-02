import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { ArrowDown } from "lucide-react";
import { ALL_APPS } from "@cant/shared/lib/cant-apps";
import { APP_CATALOG_LIST } from "@cant/shared/lib/app-catalog";

const TOTAL_CHALLENGES = APP_CATALOG_LIST.reduce(
  (sum, entry) =>
    sum + entry.categories.reduce((s, c) => s + c.questionCount, 0),
  0,
);

export function Hero() {
  return (
    <Box
      sx={{
        position: "relative",
        pt: { xs: 10, md: 14 },
        pb: { xs: 8, md: 14 },
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
      <style>{`
        @keyframes hero-compass-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes hero-compass-fade {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes hero-needle-settle {
          0% { transform: rotate(0deg); }
          40% { transform: rotate(-15deg); }
          70% { transform: rotate(8deg); }
          90% { transform: rotate(-3deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes hero-ring-draw {
          from { stroke-dashoffset: 600; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes hero-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.05); }
        }
        @keyframes hero-text-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={{ xs: 6, md: 8 }}
          alignItems="center"
        >
          {/* Left: text */}
          <Box
            sx={{
              flex: 1,
              textAlign: { xs: "center", md: "left" },
              order: { xs: 2, md: 1 },
            }}
          >
            <Typography
              variant="h1"
              component="h1"
              fontWeight={800}
              sx={{
                fontSize: { xs: "2.75rem", sm: "3.5rem", md: "4.5rem" },
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                opacity: 0,
                animation: "hero-text-up 0.7s ease-out 0.6s forwards",
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
                maxWidth: { md: 480 },
                mx: { xs: "auto", md: 0 },
                opacity: 0,
                animation: "hero-text-up 0.7s ease-out 0.8s forwards",
              }}
            >
              Two options. One is better. Pick it, then find out why.
            </Typography>

            {/* Stats */}
            <Stack
              direction="row"
              spacing={{ xs: 3, md: 5 }}
              justifyContent={{ xs: "center", md: "flex-start" }}
              sx={{
                mt: 5,
                opacity: 0,
                animation: "hero-text-up 0.7s ease-out 1s forwards",
              }}
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
            <Box
              sx={{
                mt: 4,
                textAlign: { xs: "center", md: "left" },
                opacity: 0,
                animation: "hero-text-up 0.7s ease-out 1.15s forwards",
              }}
            >
              <Button
                component="a"
                href="#series"
                variant="contained"
                size="large"
                endIcon={<ArrowDown size={18} />}
                sx={{
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
          </Box>

          {/* Right: compass */}
          <Box
            sx={{
              flex: { md: "0 0 auto" },
              order: { xs: 1, md: 2 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              width: { xs: 180, sm: 220, md: 320 },
              height: { xs: 180, sm: 220, md: 320 },
            }}
          >
            {/* Background glow */}
            <Box
              sx={{
                position: "absolute",
                inset: "-20%",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(233,196,106,0.12) 0%, rgba(233,196,106,0) 60%)",
                animation: "hero-glow-pulse 4s ease-in-out infinite",
              }}
            />

            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{
                width: "100%",
                height: "100%",
                position: "relative",
              }}
            >
              {/* Outer bezel ring */}
              <circle
                cx="100"
                cy="100"
                r="95"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.15"
                strokeDasharray="600"
                style={{
                  animation: "hero-ring-draw 1.5s ease-out 0.2s both",
                  strokeDashoffset: 600,
                }}
              />

              {/* Degree ring */}
              <circle
                cx="100"
                cy="100"
                r="82"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />

              {/* Major tick marks (N/E/S/W) */}
              {[0, 90, 180, 270].map((deg) => (
                <line
                  key={`major-${String(deg)}`}
                  x1="100"
                  y1="10"
                  x2="100"
                  y2="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  opacity="0.3"
                  strokeLinecap="round"
                  transform={`rotate(${String(deg)} 100 100)`}
                />
              ))}

              {/* Minor tick marks (45 degree intervals) */}
              {[45, 135, 225, 315].map((deg) => (
                <line
                  key={`minor-${String(deg)}`}
                  x1="100"
                  y1="12"
                  x2="100"
                  y2="20"
                  stroke="currentColor"
                  strokeWidth="1"
                  opacity="0.15"
                  strokeLinecap="round"
                  transform={`rotate(${String(deg)} 100 100)`}
                />
              ))}

              {/* Small degree ticks (every 15 degrees) */}
              {[
                15, 30, 60, 75, 105, 120, 150, 165, 195, 210, 240, 255, 285,
                300, 330, 345,
              ].map((deg) => (
                <line
                  key={`tiny-${String(deg)}`}
                  x1="100"
                  y1="14"
                  x2="100"
                  y2="18"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.1"
                  transform={`rotate(${String(deg)} 100 100)`}
                />
              ))}

              {/* Cardinal letters */}
              <text
                x="100"
                y="34"
                textAnchor="middle"
                fill="#E9C46A"
                fontSize="11"
                fontWeight="700"
                fontFamily="system-ui, sans-serif"
              >
                N
              </text>
              <text
                x="100"
                y="177"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.2"
                fontSize="9"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                S
              </text>
              <text
                x="175"
                y="104"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.2"
                fontSize="9"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                E
              </text>
              <text
                x="25"
                y="104"
                textAnchor="middle"
                fill="currentColor"
                opacity="0.2"
                fontSize="9"
                fontWeight="600"
                fontFamily="system-ui, sans-serif"
              >
                W
              </text>

              {/* Inner circle (compass face edge) */}
              <circle
                cx="100"
                cy="100"
                r="60"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.08"
              />

              {/* Crosshair lines */}
              <line
                x1="100"
                y1="45"
                x2="100"
                y2="55"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />
              <line
                x1="100"
                y1="145"
                x2="100"
                y2="155"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />
              <line
                x1="45"
                y1="100"
                x2="55"
                y2="100"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />
              <line
                x1="145"
                y1="100"
                x2="155"
                y2="100"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.1"
              />

              {/* Needle group - settles with oscillation */}
              <g
                style={{
                  transformOrigin: "100px 100px",
                  animation: "hero-needle-settle 1.8s ease-out 0.8s both",
                }}
              >
                {/* North needle (gold diamond) */}
                <polygon points="100,38 95,100 100,96 105,100" fill="#E9C46A" />
                <polygon
                  points="100,38 95,100 100,104 105,100"
                  fill="#C4943A"
                />
                {/* South needle (muted diamond) */}
                <polygon
                  points="100,162 95,100 100,96 105,100"
                  fill="currentColor"
                  opacity="0.12"
                />
                <polygon
                  points="100,162 95,100 100,104 105,100"
                  fill="currentColor"
                  opacity="0.08"
                />
              </g>

              {/* Center cap */}
              <circle
                cx="100"
                cy="100"
                r="7"
                fill="currentColor"
                opacity="0.15"
              />
              <circle cx="100" cy="100" r="4" fill="#E9C46A" />
              <circle
                cx="100"
                cy="100"
                r="1.5"
                fill="currentColor"
                opacity="0.3"
              />
            </svg>
          </Box>
        </Stack>
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
