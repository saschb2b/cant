import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

/* ---------- Flat vs clear hierarchy (property card) ---------- */

export function HierarchyFlat() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box
        component="img"
        src="/challenges/apartment.jpg"
        alt="Loft apartment interior"
        sx={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
      />
      <Stack sx={{ p: 1.5 }} spacing={0.5}>
        <Typography
          sx={{ fontSize: 16, fontWeight: 400, color: "text.primary" }}
        >
          Kreuzberg Loft Apartment
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
        >
          Bergmannstrasse, Berlin
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
        >
          $1,850 / month
        </Typography>
        <Typography
          sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
        >
          2 beds, 1 bath, 72 m2
        </Typography>
        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 0.5, textTransform: "none", alignSelf: "flex-start" }}
        >
          View details
        </Button>
      </Stack>
    </Paper>
  );
}

export function HierarchyClear() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Box
        component="img"
        src="/challenges/apartment.jpg"
        alt="Loft apartment interior"
        sx={{ width: "100%", height: 90, objectFit: "cover", display: "block" }}
      />
      <Stack sx={{ p: 1.5 }} spacing={0.25}>
        <Typography
          sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}
        >
          Kreuzberg Loft Apartment
        </Typography>
        <Typography
          sx={{ fontSize: 13, fontWeight: 400, color: "text.secondary" }}
        >
          Bergmannstrasse, Berlin
        </Typography>
        <Typography
          sx={{ fontSize: 16, fontWeight: 600, color: "primary.main", mt: 0.5 }}
        >
          $1,850
          <Box
            component="span"
            sx={{ fontSize: 12, fontWeight: 400, color: "text.secondary" }}
          >
            {" "}
            / month
          </Box>
        </Typography>
        <Typography
          sx={{ fontSize: 12, fontWeight: 400, color: "text.disabled" }}
        >
          2 beds, 1 bath, 72 m2
        </Typography>
        <Button
          variant="contained"
          size="small"
          sx={{ mt: 0.75, textTransform: "none", alignSelf: "flex-start" }}
        >
          View details
        </Button>
      </Stack>
    </Paper>
  );
}

/* ---------- All-primary vs hierarchical buttons ---------- */

export function ButtonsAllPrimary() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 0.5 }}>
        Unsaved changes
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.5 }}>
        You have unsaved changes in this document. What would you like to do?
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" size="small" sx={{ textTransform: "none" }}>
          Save changes
        </Button>
        <Button variant="contained" size="small" sx={{ textTransform: "none" }}>
          Discard
        </Button>
        <Button variant="contained" size="small" sx={{ textTransform: "none" }}>
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
}

export function ButtonsWithHierarchy() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 0.5 }}>
        Unsaved changes
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1.5 }}>
        You have unsaved changes in this document. What would you like to do?
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" size="small" sx={{ textTransform: "none" }}>
          Save changes
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          sx={{ textTransform: "none" }}
        >
          Discard
        </Button>
        <Button variant="text" size="small" sx={{ textTransform: "none" }}>
          Cancel
        </Button>
      </Stack>
    </Paper>
  );
}

/* ---------- Everything bold vs selective emphasis ---------- */

export function EverythingBold() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
        Berlin Design Meetup
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
        Saturday, April 12, 2025
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.25 }}>
        Factory Berlin, Rheinsberger Str. 76
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
        Lightning talks on design tokens, accessibility audits, and component
        API patterns.
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
        142 attending
      </Typography>
    </Paper>
  );
}

export function SelectiveEmphasis() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
        Berlin Design Meetup
      </Typography>
      <Typography
        sx={{ fontSize: 14, fontWeight: 400, color: "text.secondary", mt: 0.5 }}
      >
        Saturday, April 12, 2025
      </Typography>
      <Typography
        sx={{ fontSize: 13, fontWeight: 400, color: "text.disabled", mt: 0.25 }}
      >
        Factory Berlin, Rheinsberger Str. 76
      </Typography>
      <Typography
        sx={{ fontSize: 14, fontWeight: 400, color: "text.secondary", mt: 0.5 }}
      >
        Lightning talks on design tokens, accessibility audits, and component
        API patterns.
      </Typography>
      <Divider sx={{ my: 1 }} />
      <Typography sx={{ fontSize: 13, fontWeight: 700, color: "text.primary" }}>
        142 attending
      </Typography>
    </Paper>
  );
}

/* ---------- Label same as value vs dimmed label / bold value ---------- */

const orderData = [
  { label: "Order ID", value: "#ORD-7284" },
  { label: "Status", value: "Shipped" },
  { label: "Date", value: "Mar 22, 2025" },
  { label: "Total", value: "$134.00" },
] as const;

export function LabelSameAsValue() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        {orderData.map((row) => (
          <Box
            key={row.label}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
            >
              {row.label}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 400, color: "text.primary" }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function LabelDimmedValueBold() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        {orderData.map((row) => (
          <Box
            key={row.label}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 400,
                color: "text.disabled",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {row.label}
            </Typography>
            <Typography
              sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}
            >
              {row.value}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
