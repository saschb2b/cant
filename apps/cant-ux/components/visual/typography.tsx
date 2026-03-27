import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

/* ---------- Size-only vs multi-dimension hierarchy ---------- */

export function TypoSizeOnlyHierarchy() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box
        component="img"
        src="/challenges/amsterdam.jpg"
        alt="Amsterdam canal houses"
        sx={{
          width: "100%",
          height: 100,
          objectFit: "cover",
          display: "block",
        }}
      />
      <Stack sx={{ p: 1.5 }} spacing={0.5}>
        <Typography
          sx={{ fontSize: 20, fontWeight: 400, color: "text.primary" }}
        >
          Amsterdam Walking Tour
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
        >
          Explore the canal district, hidden courtyards, and local markets with
          a certified guide. 3 hours, small groups only.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
          >
            4.8 (214 reviews)
          </Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
          >
            |
          </Typography>
          <Typography
            sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
          >
            Bestseller
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Typography
            sx={{ fontSize: 18, fontWeight: 400, color: "text.primary" }}
          >
            $49 / person
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Book now
          </Button>
        </Stack>
        <Typography
          sx={{ fontSize: 12, fontWeight: 400, color: "text.primary" }}
        >
          Free cancellation up to 24h before
        </Typography>
      </Stack>
    </Paper>
  );
}

export function TypoMultiDimensionHierarchy() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box
        component="img"
        src="/challenges/amsterdam.jpg"
        alt="Amsterdam canal houses"
        sx={{
          width: "100%",
          height: 100,
          objectFit: "cover",
          display: "block",
        }}
      />
      <Stack sx={{ p: 1.5 }} spacing={0.5}>
        <Typography
          sx={{ fontSize: 20, fontWeight: 700, color: "text.primary" }}
        >
          Amsterdam Walking Tour
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 400, color: "text.secondary" }}
        >
          Explore the canal district, hidden courtyards, and local markets with
          a certified guide. 3 hours, small groups only.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography
            sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}
          >
            4.8 (214 reviews)
          </Typography>
          <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
            |
          </Typography>
          <Typography
            sx={{ fontSize: 13, fontWeight: 500, color: "text.secondary" }}
          >
            Bestseller
          </Typography>
        </Stack>
        <Stack
          direction="row"
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            mt: 0.5,
          }}
        >
          <Typography
            sx={{ fontSize: 18, fontWeight: 600, color: "text.primary" }}
          >
            $49{" "}
            <Box
              component="span"
              sx={{ fontSize: 13, fontWeight: 400, color: "text.secondary" }}
            >
              / person
            </Box>
          </Typography>
          <Button
            variant="contained"
            size="small"
            sx={{ textTransform: "none" }}
          >
            Book now
          </Button>
        </Stack>
        <Typography
          sx={{ fontSize: 12, fontWeight: 400, color: "text.disabled" }}
        >
          Free cancellation up to 24h before
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ---------- Long lines vs optimal width ---------- */

const blogTitle = "Why Design Systems Fail";
const blogBody =
  "Most design systems don't fail because of bad components. They fail because teams skip the adoption phase and jump straight to building a library nobody asked for. Without buy-in from product and engineering leads, even the best-documented system will gather dust.";

export function TypoLongLines() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          color: "text.disabled",
          mb: 0.5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Design
      </Typography>
      <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 1 }}>
        {blogTitle}
      </Typography>
      <Typography
        sx={{ fontSize: 14, lineHeight: 1.6, color: "text.secondary" }}
      >
        {blogBody}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 1 }}>
        6 min read
      </Typography>
    </Paper>
  );
}

export function TypoOptimalWidth() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 500,
          color: "text.disabled",
          mb: 0.5,
          textTransform: "uppercase",
          letterSpacing: 0.5,
        }}
      >
        Design
      </Typography>
      <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 1 }}>
        {blogTitle}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          lineHeight: 1.6,
          color: "text.secondary",
          maxWidth: 260,
        }}
      >
        {blogBody}
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 1 }}>
        6 min read
      </Typography>
    </Paper>
  );
}

/* ---------- Tight vs relaxed leading ---------- */

const featureHeading = "Smart notifications";
const featureBody =
  "Get notified only when it matters. Our algorithm learns your preferences over time, filtering out noise so you can focus on high-priority updates from your team.";

export function TypoTightLeading() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.75 }}>
        {featureHeading}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          lineHeight: 1.1,
          color: "text.secondary",
          maxWidth: 280,
        }}
      >
        {featureBody}
      </Typography>
    </Paper>
  );
}

export function TypoRelaxedLeading() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.75 }}>
        {featureHeading}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          lineHeight: 1.65,
          color: "text.secondary",
          maxWidth: 280,
        }}
      >
        {featureBody}
      </Typography>
    </Paper>
  );
}

/* ---------- Arbitrary vs harmonic type scale ---------- */

const planFeatures = [
  "Unlimited projects",
  "Priority support",
  "Custom domains",
];

export function TypoNoScale() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 29, fontWeight: 700 }}>Pro</Typography>
      <Stack direction="row" sx={{ alignItems: "baseline", mt: 0.5 }}>
        <Typography sx={{ fontSize: 21, fontWeight: 600 }}>$24</Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", ml: 0.5 }}>
          / month
        </Typography>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={0.5}>
        {planFeatures.map((f) => (
          <Typography key={f} sx={{ fontSize: 17 }}>
            {f}
          </Typography>
        ))}
      </Stack>
      <Button
        variant="contained"
        size="small"
        fullWidth
        sx={{ mt: 1.5, textTransform: "none" }}
      >
        Get started
      </Button>
    </Paper>
  );
}

export function TypoHarmonicScale() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 32, fontWeight: 700 }}>Pro</Typography>
      <Stack direction="row" sx={{ alignItems: "baseline", mt: 0.5 }}>
        <Typography sx={{ fontSize: 20, fontWeight: 600 }}>$24</Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary", ml: 0.5 }}>
          / month
        </Typography>
      </Stack>
      <Divider sx={{ my: 1 }} />
      <Stack spacing={0.5}>
        {planFeatures.map((f) => (
          <Typography key={f} sx={{ fontSize: 16 }}>
            {f}
          </Typography>
        ))}
      </Stack>
      <Button
        variant="contained"
        size="small"
        fullWidth
        sx={{ mt: 1.5, textTransform: "none" }}
      >
        Get started
      </Button>
    </Paper>
  );
}
