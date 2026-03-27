import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function FeedbackBlankLoading() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box />
    </Paper>
  );
}

export function FeedbackSkeleton() {
  return (
    <Paper sx={{ p: 2, minHeight: 120 }}>
      <Stack spacing={1.5}>
        <Box
          sx={{
            width: "60%",
            height: 16,
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
        <Box
          sx={{
            width: "100%",
            height: 12,
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
        <Box
          sx={{
            width: "85%",
            height: 12,
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
        <Box
          sx={{
            width: "40%",
            height: 12,
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
      </Stack>
    </Paper>
  );
}

export function FeedbackEmptyBare() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
        No results found.
      </Typography>
    </Paper>
  );
}

export function FeedbackEmptyHelpful() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          No results found
        </Typography>
        <Typography
          sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}
        >
          Try broadening your search or using different keywords.
        </Typography>
        <Button variant="outlined" size="small">
          Clear filters
        </Button>
      </Stack>
    </Paper>
  );
}

export function FeedbackTechnicalError() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{ fontSize: 13, color: "error.main", fontFamily: "monospace" }}
      >
        Error 500: ECONNREFUSED localhost:5432
      </Typography>
    </Paper>
  );
}

export function FeedbackFriendlyError() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 120,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          Something went wrong
        </Typography>
        <Typography
          sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}
        >
          Please try again or contact support if the problem persists.
        </Typography>
        <Button variant="outlined" size="small">
          Retry
        </Button>
      </Stack>
    </Paper>
  );
}

export function FeedbackNoConfirmation() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, mb: 1 }}>Project Settings</Typography>
      <Stack spacing={1}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 13 }}>My Project</Typography>
          <Button variant="contained" color="error" size="small">
            Delete
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}

export function FeedbackConfirmation() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1 }}>
        Delete this project?
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
        This action cannot be undone. All data associated with this project will
        be permanently removed.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
        <Button variant="outlined" size="small">
          Cancel
        </Button>
        <Button variant="contained" color="error" size="small">
          Delete
        </Button>
      </Stack>
    </Paper>
  );
}
