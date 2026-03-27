import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Blank loading vs skeleton loading ---------- */

export function FeedbackBlankLoading() {
  return (
    <Paper sx={{ p: 2, minHeight: 160 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Recent Orders
      </Typography>
      <Box sx={{ minHeight: 110 }} />
    </Paper>
  );
}

export function FeedbackSkeleton() {
  return (
    <Paper sx={{ p: 2, minHeight: 160 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1.5 }}>
        Recent Orders
      </Typography>
      <Stack spacing={1.5}>
        {["70%", "55%", "85%"].map((width) => (
          <Stack
            key={width}
            direction="row"
            spacing={1}
            sx={{ alignItems: "center" }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                bgcolor: "action.hover",
                flexShrink: 0,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width,
                  height: 10,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  width: "40%",
                  height: 8,
                  bgcolor: "action.hover",
                  borderRadius: 1,
                }}
              />
            </Box>
          </Stack>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Bare empty state vs helpful empty state ---------- */

export function FeedbackEmptyBare() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        No results found.
      </Typography>
    </Paper>
  );
}

export function FeedbackEmptyHelpful() {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: 140,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={1} sx={{ alignItems: "center", maxWidth: 240 }}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            bgcolor: "action.hover",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: "2px solid",
              borderColor: "text.disabled",
            }}
          />
        </Box>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          No results found
        </Typography>
        <Typography
          sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}
        >
          Try adjusting your filters or search with different keywords.
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: "primary.main",
            cursor: "pointer",
          }}
        >
          Clear filters
        </Typography>
      </Stack>
    </Paper>
  );
}

/* ---------- Technical error vs friendly error ---------- */

export function FeedbackTechnicalError() {
  return (
    <Paper
      sx={{
        p: 2,
        minHeight: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          color: "error.main",
          fontFamily: "monospace",
          textAlign: "center",
          lineHeight: 1.6,
        }}
      >
        Error 500: ECONNREFUSED localhost:5432
        <br />
        at TCPConnectWrap.afterConnect
      </Typography>
    </Paper>
  );
}

export function FeedbackFriendlyError() {
  return (
    <Paper
      sx={{
        p: 3,
        minHeight: 130,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack spacing={1} sx={{ alignItems: "center", maxWidth: 240 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600 }}>
          Something went wrong
        </Typography>
        <Typography
          sx={{ fontSize: 12, color: "text.secondary", textAlign: "center" }}
        >
          We could not load your data. Please try again in a few moments.
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 0.75,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
            Try again
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

/* ---------- No confirmation vs confirmation dialog ---------- */

export function FeedbackNoConfirmation() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
        Account
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
        Manage your account settings and preferences.
      </Typography>
      <Box
        sx={{
          px: 2,
          py: 0.75,
          bgcolor: "error.main",
          borderRadius: 1,
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
          Delete account
        </Typography>
      </Box>
    </Paper>
  );
}

export function FeedbackConfirmation() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 0.5 }}>
        Delete account?
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 2 }}>
        This will permanently remove all your data. This action cannot be
        undone.
      </Typography>
      <Stack direction="row" spacing={1} sx={{ justifyContent: "flex-end" }}>
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 500,
            color: "text.secondary",
            cursor: "pointer",
            py: 0.75,
            px: 1.5,
          }}
        >
          Cancel
        </Typography>
        <Box
          sx={{
            px: 2,
            py: 0.75,
            bgcolor: "error.main",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>
            Delete
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
