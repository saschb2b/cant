import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

const inputSx = {
  height: 32,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  px: 1,
  display: "flex",
  alignItems: "center",
} as const;

/* ---------- Placeholder-only labels vs visible labels ---------- */

export function FormPlaceholderLabels() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1.5 }}>
        Sign in
      </Typography>
      <Stack spacing={1.5}>
        <Box sx={inputSx}>
          <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
            Email address
          </Typography>
        </Box>
        <Box sx={inputSx}>
          <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
            Password
          </Typography>
        </Box>
        <Box
          sx={{
            height: 34,
            bgcolor: "primary.main",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
            Sign in
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

export function FormVisibleLabels() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 15, fontWeight: 600, mb: 1.5 }}>
        Sign in
      </Typography>
      <Stack spacing={1.5}>
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.5 }}>
            Email address
          </Typography>
          <Box sx={inputSx}>
            <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
              you@example.com
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.5 }}>
            Password
          </Typography>
          <Box sx={inputSx}>
            <Typography sx={{ fontSize: 13 }}>••••••••</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            height: 34,
            bgcolor: "primary.main",
            borderRadius: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>
            Sign in
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

/* ---------- Generic error vs specific error ---------- */

export function FormGenericError() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.5 }}>
        Password
      </Typography>
      <Box sx={{ ...inputSx, borderColor: "error.main" }}>
        <Typography sx={{ fontSize: 13 }}>abc123</Typography>
      </Box>
      <Typography sx={{ fontSize: 11, color: "error.main", mt: 0.5 }}>
        Invalid input.
      </Typography>
    </Paper>
  );
}

export function FormSpecificError() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 12, fontWeight: 500, mb: 0.5 }}>
        Password
      </Typography>
      <Box sx={{ ...inputSx, borderColor: "error.main" }}>
        <Typography sx={{ fontSize: 13 }}>abc123</Typography>
      </Box>
      <Typography sx={{ fontSize: 11, color: "error.main", mt: 0.5 }}>
        Password must be at least 8 characters and include a number.
      </Typography>
    </Paper>
  );
}

/* ---------- Tiny targets vs large targets ---------- */

const preferenceOptions = [
  { label: "Email notifications", desc: "Product updates and announcements" },
  { label: "SMS alerts", desc: "Order status and delivery updates" },
  { label: "Weekly digest", desc: "Summary of your account activity" },
] as const;

export function FormTinyTargets() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Notification preferences
      </Typography>
      <Stack spacing={0.75}>
        {preferenceOptions.map((opt) => (
          <Box
            key={opt.label}
            sx={{ display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <Box
              sx={{
                width: 14,
                height: 14,
                border: "1.5px solid",
                borderColor: "text.secondary",
                borderRadius: 0.5,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 11 }}>{opt.label}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function FormLargeTargets() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Notification preferences
      </Typography>
      <Stack spacing={0.5}>
        {preferenceOptions.map((opt, i) => (
          <Box
            key={opt.label}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              minHeight: 44,
              px: 1.5,
              borderRadius: 1,
              border: "1px solid",
              borderColor: i === 0 ? "primary.main" : "divider",
              bgcolor: i === 0 ? "action.hover" : "transparent",
            }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                border: "2px solid",
                borderColor: i === 0 ? "primary.main" : "text.secondary",
                borderRadius: 0.5,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {i === 0 && (
                <Box
                  sx={{
                    width: 10,
                    height: 10,
                    bgcolor: "primary.main",
                    borderRadius: 0.25,
                  }}
                />
              )}
            </Box>
            <Box>
              <Typography sx={{ fontSize: 13, fontWeight: 500 }}>
                {opt.label}
              </Typography>
              <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                {opt.desc}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Wall of fields vs grouped fields ---------- */

const allFields = [
  "Full name",
  "Email address",
  "Phone number",
  "Street address",
  "City",
  "Zip code",
  "Country",
] as const;

const personalFields = [
  { label: "Full name", placeholder: "Sarah Chen" },
  { label: "Email address", placeholder: "sarah@example.com" },
  { label: "Phone number", placeholder: "+1 (555) 000-0000" },
] as const;

const shippingFields = [
  { label: "Street address", placeholder: "123 Main St" },
  { label: "City", placeholder: "San Francisco" },
  { label: "Zip code", placeholder: "94102" },
  { label: "Country", placeholder: "United States" },
] as const;

export function FormWallOfFields() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
        Checkout
      </Typography>
      <Stack spacing={1}>
        {allFields.map((label) => (
          <Box key={label} sx={inputSx}>
            <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
              {label}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function FormGroupedFields() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
        Checkout
      </Typography>

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          mb: 1,
        }}
      >
        Personal Info
      </Typography>
      <Stack spacing={1} sx={{ mb: 1.5 }}>
        {personalFields.map((field) => (
          <Box key={field.label}>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}
            >
              {field.label}
            </Typography>
            <Box sx={{ ...inputSx, height: 28 }}>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                {field.placeholder}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>

      <Divider sx={{ mb: 1.5 }} />

      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 600,
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.5,
          mb: 1,
        }}
      >
        Shipping Address
      </Typography>
      <Stack spacing={1}>
        {shippingFields.map((field) => (
          <Box key={field.label}>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}
            >
              {field.label}
            </Typography>
            <Box sx={{ ...inputSx, height: 28 }}>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                {field.placeholder}
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
