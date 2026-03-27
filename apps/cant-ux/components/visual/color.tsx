import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export function ColorLowContrast() {
  return (
    <Paper sx={{ p: "16px", bgcolor: "#ffffff" }}>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            bgcolor: "#e8f5e9",
            flexShrink: 0,
            mt: "2px",
          }}
        />
        <Box>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: "#999999", mb: "4px" }}
          >
            Payment received
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#bbbbbb", lineHeight: 1.4 }}>
            $2,400.00 from Acme Corp for Invoice #1042 has been deposited into
            your account.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export function ColorAccessibleContrast() {
  return (
    <Paper sx={{ p: "16px", bgcolor: "#ffffff" }}>
      <Box sx={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: "6px",
            bgcolor: "#e8f5e9",
            flexShrink: 0,
            mt: "2px",
          }}
        />
        <Box>
          <Typography
            sx={{ fontSize: 14, fontWeight: 600, color: "#333333", mb: "4px" }}
          >
            Payment received
          </Typography>
          <Typography sx={{ fontSize: 12, color: "#555555", lineHeight: 1.4 }}>
            $2,400.00 from Acme Corp for Invoice #1042 has been deposited into
            your account.
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}

export function ColorTooManyColors() {
  return (
    <Paper sx={{ p: "16px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#e53935" }}>
          Landing Page Redesign
        </Typography>
        <Box
          sx={{
            px: "6px",
            py: "2px",
            bgcolor: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#1565c0" }}>
            In Progress
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{ fontSize: 12, color: "#ff9800", lineHeight: 1.4, mb: "8px" }}
      >
        Redesign the hero section and feature grid for better conversion rates.
      </Typography>
      <Divider sx={{ mb: "8px" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 11, color: "#43a047" }}>
          Due: Mar 28, 2026
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            color: "#8e24aa",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          @daniel
        </Typography>
      </Box>
    </Paper>
  );
}

export function ColorLimitedPalette() {
  return (
    <Paper sx={{ p: "16px" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "6px" }}>
        <Typography
          sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}
        >
          Landing Page Redesign
        </Typography>
        <Box
          sx={{
            px: "6px",
            py: "2px",
            bgcolor: "#e3f2fd",
            borderRadius: "4px",
          }}
        >
          <Typography sx={{ fontSize: 10, fontWeight: 600, color: "#1565c0" }}>
            In Progress
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          lineHeight: 1.4,
          mb: "8px",
        }}
      >
        Redesign the hero section and feature grid for better conversion rates.
      </Typography>
      <Divider sx={{ mb: "8px" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Due: Mar 28, 2026
        </Typography>
        <Typography
          sx={{
            fontSize: 11,
            color: "#1565c0",
            textDecoration: "underline",
            cursor: "pointer",
          }}
        >
          @daniel
        </Typography>
      </Box>
    </Paper>
  );
}

export function ColorGreyOnColor() {
  return (
    <Paper sx={{ p: "16px", bgcolor: "#0d7377" }}>
      <Typography
        sx={{ fontSize: 15, fontWeight: 700, color: "#777777", mb: "6px" }}
      >
        Go Pro for $9/month
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#999999", lineHeight: 1.5 }}>
        Unlimited projects, priority support, and advanced analytics. Cancel
        anytime.
      </Typography>
    </Paper>
  );
}

export function ColorTintedOnColor() {
  return (
    <Paper sx={{ p: "16px", bgcolor: "#0d7377" }}>
      <Typography
        sx={{ fontSize: 15, fontWeight: 700, color: "#e0f7fa", mb: "6px" }}
      >
        Go Pro for $9/month
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#b2ebf2", lineHeight: 1.5 }}>
        Unlimited projects, priority support, and advanced analytics. Cancel
        anytime.
      </Typography>
    </Paper>
  );
}

export function ColorPureBlackOnWhite() {
  return (
    <Paper sx={{ p: "16px", bgcolor: "#ffffff" }}>
      <Typography
        sx={{ fontSize: 15, fontWeight: 700, color: "#000000", mb: "4px" }}
      >
        Notification Preferences
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#000000", lineHeight: 1.5 }}>
        Control which alerts you receive by email, push, or SMS. You can also
        set quiet hours to pause all notifications.
      </Typography>
    </Paper>
  );
}

export function ColorSoftContrast() {
  return (
    <Paper sx={{ p: "16px", bgcolor: "#fafafa" }}>
      <Typography
        sx={{ fontSize: 15, fontWeight: 700, color: "#1a1a1a", mb: "4px" }}
      >
        Notification Preferences
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#444444", lineHeight: 1.5 }}>
        Control which alerts you receive by email, push, or SMS. You can also
        set quiet hours to pause all notifications.
      </Typography>
    </Paper>
  );
}
