import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

export function ColorLowContrast() {
  return (
    <Paper sx={{ p: 2, bgcolor: "#ffffff" }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#999999", mb: 0.5 }}
      >
        Welcome Back
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#bbbbbb" }}>
        Your account is ready. Check your latest notifications and updates in
        the dashboard.
      </Typography>
    </Paper>
  );
}

export function ColorAccessibleContrast() {
  return (
    <Paper sx={{ p: 2, bgcolor: "#ffffff" }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#333333", mb: 0.5 }}
      >
        Welcome Back
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#555555" }}>
        Your account is ready. Check your latest notifications and updates in
        the dashboard.
      </Typography>
    </Paper>
  );
}

export function ColorTooManyColors() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#e53935", mb: 0.5 }}
      >
        Team Update
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#1e88e5", mb: 1 }}>
        Sprint 14 Retrospective
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#43a047", mb: 0.5 }}>
        Status: Active
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#ff9800" }}>
        3 tasks remaining before the deadline.
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: "#8e24aa",
          mt: 0.5,
          textDecoration: "underline",
        }}
      >
        View full report
      </Typography>
    </Paper>
  );
}

export function ColorLimitedPalette() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "text.primary", mb: 0.5 }}
      >
        Team Update
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
        Sprint 14 Retrospective
      </Typography>
      <Typography sx={{ fontSize: 12, color: "#1976d2", mb: 0.5 }}>
        Status: Active
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        3 tasks remaining before the deadline.
      </Typography>
      <Typography
        sx={{
          fontSize: 13,
          color: "#1976d2",
          mt: 0.5,
          textDecoration: "underline",
        }}
      >
        View full report
      </Typography>
    </Paper>
  );
}

export function ColorGreyOnColor() {
  return (
    <Paper sx={{ p: 2, bgcolor: "#0d7377", borderRadius: 1 }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#777777", mb: 0.5 }}
      >
        Premium Plan
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#999999" }}>
        Unlock all features and get priority support with our premium tier.
      </Typography>
    </Paper>
  );
}

export function ColorTintedOnColor() {
  return (
    <Paper sx={{ p: 2, bgcolor: "#0d7377", borderRadius: 1 }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#e0f7fa", mb: 0.5 }}
      >
        Premium Plan
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#b2ebf2" }}>
        Unlock all features and get priority support with our premium tier.
      </Typography>
    </Paper>
  );
}

export function ColorPureBlackOnWhite() {
  return (
    <Paper sx={{ p: 2, bgcolor: "#ffffff" }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#000000", mb: 0.5 }}
      >
        System Settings
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#000000" }}>
        Configure your preferences, notification rules, and account security
        options from this panel.
      </Typography>
    </Paper>
  );
}

export function ColorSoftContrast() {
  return (
    <Paper sx={{ p: 2, bgcolor: "#fafafa" }}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 700, color: "#1a1a1a", mb: 0.5 }}
      >
        System Settings
      </Typography>
      <Typography sx={{ fontSize: 13, color: "#444444" }}>
        Configure your preferences, notification rules, and account security
        options from this panel.
      </Typography>
    </Paper>
  );
}
