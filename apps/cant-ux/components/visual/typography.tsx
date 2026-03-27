import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

const sampleText =
  "Good typography makes reading effortless. It guides the eye through content and creates a comfortable reading experience for everyone.";

export function TypoSizeOnlyHierarchy() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 24, mb: 0.5 }}>Project Overview</Typography>
      <Typography sx={{ fontSize: 18, mb: 1 }}>
        Current sprint progress
      </Typography>
      <Typography sx={{ fontSize: 14 }}>
        The team completed 8 of 12 planned tasks this week. Two items were moved
        to the backlog.
      </Typography>
    </Paper>
  );
}

export function TypoMultiDimensionHierarchy() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        sx={{ fontSize: 24, fontWeight: 700, color: "text.primary", mb: 0.5 }}
      >
        Project Overview
      </Typography>
      <Typography
        sx={{ fontSize: 16, fontWeight: 500, color: "text.secondary", mb: 1 }}
      >
        Current sprint progress
      </Typography>
      <Typography
        sx={{ fontSize: 14, fontWeight: 400, color: "text.disabled" }}
      >
        The team completed 8 of 12 planned tasks this week. Two items were moved
        to the backlog.
      </Typography>
    </Paper>
  );
}

export function TypoLongLines() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, maxWidth: 500 }}>{sampleText}</Typography>
    </Paper>
  );
}

export function TypoOptimalWidth() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, maxWidth: 280 }}>{sampleText}</Typography>
    </Paper>
  );
}

export function TypoTightLeading() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, lineHeight: 1.0, maxWidth: 260 }}>
        {sampleText}
      </Typography>
    </Paper>
  );
}

export function TypoRelaxedLeading() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, lineHeight: 1.6, maxWidth: 260 }}>
        {sampleText}
      </Typography>
    </Paper>
  );
}

const badScaleEntries = [
  { label: "Heading 1", size: 29 },
  { label: "Heading 2", size: 21 },
  { label: "Body", size: 17 },
  { label: "Caption", size: 13 },
] as const;

const goodScaleEntries = [
  { label: "Heading 1", size: 32 },
  { label: "Heading 2", size: 20 },
  { label: "Body", size: 16 },
  { label: "Caption", size: 12 },
] as const;

export function TypoNoScale() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={0.5}>
        {badScaleEntries.map((entry, i) => (
          <Typography
            key={i}
            sx={{ fontSize: entry.size, fontWeight: i === 0 ? 700 : 400 }}
          >
            {entry.label} ({entry.size}px)
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}

export function TypoHarmonicScale() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={0.5}>
        {goodScaleEntries.map((entry, i) => (
          <Typography
            key={i}
            sx={{ fontSize: entry.size, fontWeight: i === 0 ? 700 : 400 }}
          >
            {entry.label} ({entry.size}px)
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}
