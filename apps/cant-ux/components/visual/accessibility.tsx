import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- No focus indicators vs visible focus rings ---------- */

function FocusButton({
  label,
  focused,
  showRing,
}: {
  label: string;
  focused?: boolean;
  showRing?: boolean;
}) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 0.75,
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1,
        display: "inline-flex",
        alignItems: "center",
        cursor: "pointer",
        outline: focused && showRing ? "2px solid" : "none",
        outlineColor: focused && showRing ? "primary.main" : undefined,
        outlineOffset: focused && showRing ? 2 : undefined,
        bgcolor: focused && !showRing ? "action.hover" : "transparent",
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 500 }}>{label}</Typography>
    </Box>
  );
}

export function A11yNoFocusRing() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Toolbar
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        <FocusButton label="Save" />
        <FocusButton label="Edit" focused />
        <FocusButton label="Share" />
        <FocusButton label="Delete" />
      </Stack>
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1.5 }}>
        Tab key pressed twice. Where is the focus?
      </Typography>
    </Paper>
  );
}

export function A11yVisibleFocusRing() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Toolbar
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        <FocusButton label="Save" />
        <FocusButton label="Edit" focused showRing />
        <FocusButton label="Share" />
        <FocusButton label="Delete" />
      </Stack>
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1.5 }}>
        Tab key pressed twice. Focus is on &ldquo;Edit&rdquo;.
      </Typography>
    </Paper>
  );
}

/* ---------- Icon-only vs icon + label ---------- */

const iconPaths = {
  edit: "M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z",
  delete:
    "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
  share:
    "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z",
  search:
    "M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5z",
};

function MiniIcon({ d, size = 14 }: { d: string; size?: number }) {
  return (
    <Box
      component="svg"
      viewBox="0 0 24 24"
      sx={{ width: size, height: size, fill: "currentColor", flexShrink: 0 }}
    >
      <path d={d} />
    </Box>
  );
}

export function A11yIconOnly() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Actions
      </Typography>
      <Stack direction="row" spacing={1.5}>
        {Object.entries(iconPaths).map(([key, d]) => (
          <Box
            key={key}
            sx={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
              color: "text.secondary",
            }}
          >
            <MiniIcon d={d} />
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function A11yIconWithLabel() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Actions
      </Typography>
      <Stack direction="row" spacing={1}>
        {(
          [
            ["edit", "Edit"],
            ["delete", "Delete"],
            ["share", "Share"],
            ["search", "Search"],
          ] as const
        ).map(([key, label]) => (
          <Stack
            key={key}
            direction="row"
            spacing={0.5}
            sx={{
              px: 1.25,
              py: 0.75,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              cursor: "pointer",
              color: "text.secondary",
              alignItems: "center",
            }}
          >
            <MiniIcon d={iconPaths[key]} size={12} />
            <Typography sx={{ fontSize: 11 }}>{label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Color-only status vs color + icon + text ---------- */

const statuses = [
  { label: "API Server", color: "#4caf50" },
  { label: "Database", color: "#ff9800" },
  { label: "CDN", color: "#4caf50" },
  { label: "Queue", color: "#f44336" },
];

const statusIcons: Record<string, { symbol: string; text: string }> = {
  "#4caf50": { symbol: "\u2713", text: "Operational" },
  "#ff9800": { symbol: "!", text: "Degraded" },
  "#f44336": { symbol: "\u2717", text: "Down" },
};

export function A11yColorOnlyStatus() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        System Status
      </Typography>
      <Stack spacing={1}>
        {statuses.map((s) => (
          <Stack
            key={s.label}
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                bgcolor: s.color,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 12 }}>{s.label}</Typography>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

export function A11yRichStatus() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        System Status
      </Typography>
      <Stack spacing={1}>
        {statuses.map((s) => {
          const info = statusIcons[s.color] ?? { symbol: "?", text: "Unknown" };
          return (
            <Stack
              key={s.label}
              direction="row"
              spacing={1}
              sx={{ alignItems: "center" }}
            >
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  bgcolor: s.color,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 9,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {info.symbol}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: 12, flex: 1 }}>{s.label}</Typography>
              <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                {info.text}
              </Typography>
            </Stack>
          );
        })}
      </Stack>
    </Paper>
  );
}

/* ---------- Color-only links vs underlined links ---------- */

const sampleText =
  "Our platform supports custom domains for all plans. See the ";
const linkText1 = "setup guide";
const midText = " for instructions, or visit the ";
const linkText2 = "DNS reference";
const endText = " for advanced configuration.";

export function A11yColorOnlyLinks() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Custom Domains
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7 }}
      >
        {sampleText}
        <Box component="span" sx={{ color: "primary.main" }}>
          {linkText1}
        </Box>
        {midText}
        <Box component="span" sx={{ color: "primary.main" }}>
          {linkText2}
        </Box>
        {endText}
      </Typography>
    </Paper>
  );
}

export function A11yUnderlinedLinks() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Custom Domains
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7 }}
      >
        {sampleText}
        <Box
          component="span"
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >
          {linkText1}
        </Box>
        {midText}
        <Box
          component="span"
          sx={{
            color: "primary.main",
            textDecoration: "underline",
            textUnderlineOffset: 2,
          }}
        >
          {linkText2}
        </Box>
        {endText}
      </Typography>
    </Paper>
  );
}
