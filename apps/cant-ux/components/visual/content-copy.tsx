import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Technical error vs friendly error ---------- */

export function CopyTechnicalError() {
  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: "error.main",
          borderRadius: 1,
          mb: 1.5,
        }}
      >
        <Typography
          sx={{ fontSize: 11, fontFamily: "monospace", color: "#fff" }}
        >
          Error 422: Unprocessable Entity
        </Typography>
      </Box>
      <Box sx={{ height: 28, bgcolor: "action.hover", borderRadius: 1 }} />
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1.5 }}>
        What does the user do with this information?
      </Typography>
    </Paper>
  );
}

export function CopyFriendlyError() {
  return (
    <Paper sx={{ p: 2 }}>
      <Box
        sx={{
          px: 1.5,
          py: 1,
          bgcolor: "error.main",
          borderRadius: 1,
          mb: 1.5,
          opacity: 0.1,
        }}
      />
      <Box
        sx={{
          px: 1.5,
          py: 1,
          border: "1px solid",
          borderColor: "error.main",
          borderRadius: 1,
          bgcolor: "background.paper",
          mb: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 12, color: "error.main", fontWeight: 500 }}>
          Please check your email address and try again.
        </Typography>
      </Box>
      <Box sx={{ height: 28, bgcolor: "action.hover", borderRadius: 1 }} />
      <Typography sx={{ fontSize: 10, color: "text.disabled", mt: 1.5 }}>
        The user knows exactly what to fix.
      </Typography>
    </Paper>
  );
}

/* ---------- Wall of text vs scannable content ---------- */

const wallText =
  "Our platform helps teams collaborate on design projects in real time. You can create shared workspaces, leave comments on specific elements, track revision history, export assets in multiple formats, and integrate with popular tools like Figma, Slack, and Jira. We also offer version control so your team never loses work, plus role-based permissions so you can control who sees what.";

export function CopyWallOfText() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
        Features
      </Typography>
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          lineHeight: 1.6,
        }}
      >
        {wallText}
      </Typography>
    </Paper>
  );
}

export function CopyScannableContent() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1 }}>
        Features
      </Typography>
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, mb: 0.5, color: "text.primary" }}
      >
        Real-time collaboration
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.5, mb: 1 }}
      >
        Create shared workspaces, leave comments on specific elements, and track
        revision history.
      </Typography>
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, mb: 0.5, color: "text.primary" }}
      >
        Integrations and export
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.5, mb: 1 }}
      >
        Export assets in multiple formats. Connects with Figma, Slack, and Jira.
      </Typography>
      <Typography
        sx={{ fontSize: 12, fontWeight: 600, mb: 0.5, color: "text.primary" }}
      >
        Security and permissions
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.5 }}
      >
        Version control protects your work. Role-based permissions control
        access.
      </Typography>
    </Paper>
  );
}

/* ---------- Generic links vs descriptive links ---------- */

export function CopyGenericLinks() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Getting Started
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7 }}
      >
        To set up your account, click{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          here
        </Box>
        . For information about our pricing plans, click{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          here
        </Box>
        . To read more about our API, click{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          here
        </Box>
        .
      </Typography>
    </Paper>
  );
}

export function CopyDescriptiveLinks() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Getting Started
      </Typography>
      <Typography
        sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.7 }}
      >
        Start by{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          creating your account
        </Box>
        . Compare features and costs on our{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          pricing page
        </Box>
        . Developers can explore the{" "}
        <Box
          component="span"
          sx={{ color: "primary.main", textDecoration: "underline" }}
        >
          API reference
        </Box>
        .
      </Typography>
    </Paper>
  );
}

/* ---------- Jargon onboarding vs plain language onboarding ---------- */

export function CopyJargonOnboarding() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
        Step 2 of 4
      </Typography>
      <Typography
        sx={{ fontSize: 11, color: "text.secondary", mb: 1.5, lineHeight: 1.5 }}
      >
        Configure your OAuth2 callback URI and specify the PKCE code challenge
        method. Select the appropriate grant type for your client credentials
        flow.
      </Typography>
      <Stack spacing={1}>
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 500,
              color: "text.secondary",
              mb: 0.25,
            }}
          >
            Redirect URI (RFC 6749)
          </Typography>
          <Box
            sx={{
              height: 26,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
              https://
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 500,
              color: "text.secondary",
              mb: 0.25,
            }}
          >
            PKCE Challenge Method
          </Typography>
          <Box
            sx={{
              height: 26,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
              S256
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

export function CopyPlainOnboarding() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
        Step 2 of 4
      </Typography>
      <Typography
        sx={{ fontSize: 11, color: "text.secondary", mb: 1.5, lineHeight: 1.5 }}
      >
        Tell us where to send users after they log in, and how your app will
        verify their identity.
      </Typography>
      <Stack spacing={1}>
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 500,
              color: "text.secondary",
              mb: 0.25,
            }}
          >
            Where should users go after login?
          </Typography>
          <Box
            sx={{
              height: 26,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
              https://yourapp.com/dashboard
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 500,
              color: "text.secondary",
              mb: 0.25,
            }}
          >
            Verification method
          </Typography>
          <Box
            sx={{
              height: 26,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ fontSize: 10, color: "text.primary" }}>
              Recommended (most secure)
            </Typography>
            <Typography sx={{ fontSize: 10, color: "text.disabled" }}>
              {"\u25BE"}
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
