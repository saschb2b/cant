import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

const listItems = [
  { label: "Dashboard", mt: "7px" },
  { label: "Settings", mt: "13px" },
  { label: "Profile", mt: "22px" },
  { label: "Notifications", mt: "9px" },
];

export function SpacingRandom() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 700, mb: "7px" }}>Account</Typography>
      <Typography sx={{ fontSize: 14, mb: "13px" }}>
        Manage your settings
      </Typography>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        {listItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              py: 0.5,
              mt: i === 0 ? 0 : item.mt,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>{item.label}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export function SpacingConsistentScale() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontWeight: 700, mb: 1 }}>Account</Typography>
      <Typography sx={{ fontSize: 14, mb: 2 }}>Manage your settings</Typography>
      <Stack spacing={1}>
        {listItems.map((item, i) => (
          <Box
            key={i}
            sx={{
              py: 0.5,
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography sx={{ fontSize: 14 }}>{item.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function SpacingCramped() {
  return (
    <Paper sx={{ p: 0.5 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16 }}>
        Order Summary
      </Typography>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25 }}>
        <Typography sx={{ fontSize: 13 }}>Subtotal</Typography>
        <Typography sx={{ fontSize: 13 }}>$49.99</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.25 }}>
        <Typography sx={{ fontSize: 13 }}>Shipping</Typography>
        <Typography sx={{ fontSize: 13 }}>$4.99</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mt: 0.25,
          pt: 0.25,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Total</Typography>
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>$54.98</Typography>
      </Box>
    </Paper>
  );
}

export function SpacingGenerous() {
  return (
    <Paper sx={{ p: 3 }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
        Order Summary
      </Typography>
      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 14 }}>Subtotal</Typography>
          <Typography sx={{ fontSize: 14 }}>$49.99</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 14 }}>Shipping</Typography>
          <Typography sx={{ fontSize: 14 }}>$4.99</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            pt: 1.5,
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Total</Typography>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>$54.98</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function SpacingNoProximity() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
        First Name
      </Typography>
      <Box
        sx={{
          mt: 2,
          height: 28,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
          John
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 2 }}>
        Last Name
      </Typography>
      <Box
        sx={{
          mt: 2,
          height: 28,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
          Doe
        </Typography>
      </Box>
    </Paper>
  );
}

export function SpacingProximity() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2.5}>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
            First Name
          </Typography>
          <Box
            sx={{
              height: 28,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
              John
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
            Last Name
          </Typography>
          <Box
            sx={{
              height: 28,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
              Doe
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

export function SpacingBorderSeparation() {
  return (
    <Paper sx={{ p: 2 }}>
      {["Inbox", "Sent", "Drafts", "Trash"].map((item, i) => (
        <Box
          key={i}
          sx={{
            py: 1,
            px: 1,
            borderTop: i > 0 ? "1px solid" : "none",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: 14 }}>{item}</Typography>
        </Box>
      ))}
    </Paper>
  );
}

export function SpacingWhitespaceSeparation() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        {["Inbox", "Sent", "Drafts", "Trash"].map((item, i) => (
          <Box key={i} sx={{ px: 1 }}>
            <Typography sx={{ fontSize: 14 }}>{item}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
