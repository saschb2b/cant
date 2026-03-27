import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function HierarchyFlat() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14 }}>Quarterly Report</Typography>
      <Typography sx={{ fontSize: 14, mt: 0.5 }}>
        Revenue grew 12% compared to last quarter across all regions.
      </Typography>
      <Typography sx={{ fontSize: 14, mt: 0.5 }}>
        Published Jan 15, 2025 by Analytics Team
      </Typography>
    </Paper>
  );
}

export function HierarchyClear() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 700, color: "text.primary" }}>
        Quarterly Report
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
        Revenue grew 12% compared to last quarter across all regions.
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.disabled", mt: 0.5 }}>
        Published Jan 15, 2025 by Analytics Team
      </Typography>
    </Paper>
  );
}

export function ButtonsAllPrimary() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
        Confirm Changes
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" size="small">
          Save
        </Button>
        <Button variant="contained" size="small">
          Cancel
        </Button>
        <Button variant="contained" size="small">
          Delete
        </Button>
      </Stack>
    </Paper>
  );
}

export function ButtonsWithHierarchy() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
        Confirm Changes
      </Typography>
      <Stack direction="row" spacing={1}>
        <Button variant="contained" size="small">
          Save
        </Button>
        <Button variant="outlined" size="small">
          Cancel
        </Button>
        <Button variant="text" size="small" color="error">
          Delete
        </Button>
      </Stack>
    </Paper>
  );
}

export function EverythingBold() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
        Order #4821
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
        Status: Processing
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
        Items: 3 products
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mt: 0.5 }}>
        Estimated delivery: March 28
      </Typography>
    </Paper>
  );
}

export function SelectiveEmphasis() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700 }}>
        Order #4821
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
        Status:{" "}
        <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
          Processing
        </Box>
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
        Items: 3 products
      </Typography>
      <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}>
        Estimated delivery:{" "}
        <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
          March 28
        </Box>
      </Typography>
    </Paper>
  );
}

export function LabelSameAsValue() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 14 }}>Name</Typography>
          <Typography sx={{ fontSize: 14 }}>Jane Cooper</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 14 }}>Role</Typography>
          <Typography sx={{ fontSize: 14 }}>Designer</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 14 }}>Location</Typography>
          <Typography sx={{ fontSize: 14 }}>Berlin, DE</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function LabelDimmedValueBold() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.disabled",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Name
          </Typography>
          <Typography sx={{ fontSize: 14 }}>Jane Cooper</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.disabled",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Role
          </Typography>
          <Typography sx={{ fontSize: 14 }}>Designer</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              fontSize: 12,
              color: "text.disabled",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Location
          </Typography>
          <Typography sx={{ fontSize: 14 }}>Berlin, DE</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
