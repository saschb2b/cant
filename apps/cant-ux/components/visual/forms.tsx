import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

const inputSx = {
  height: 32,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  px: 1,
  display: "flex",
  alignItems: "center",
};

export function FormPlaceholderLabels() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box sx={inputSx}>
          <Typography sx={{ fontSize: 13, color: "text.disabled" }}>
            Full name
          </Typography>
        </Box>
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
      </Stack>
    </Paper>
  );
}

export function FormVisibleLabels() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
            Full name
          </Typography>
          <Box sx={inputSx}>
            <Typography sx={{ fontSize: 13 }}>Jane Cooper</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
            Email address
          </Typography>
          <Box sx={inputSx}>
            <Typography sx={{ fontSize: 13 }}>jane@example.com</Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
            Password
          </Typography>
          <Box sx={inputSx}>
            <Typography sx={{ fontSize: 13 }}>********</Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

export function FormGenericError() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
        Password
      </Typography>
      <Box
        sx={{
          ...inputSx,
          borderColor: "error.main",
        }}
      >
        <Typography sx={{ fontSize: 13 }}>abc</Typography>
      </Box>
      <Typography sx={{ fontSize: 12, color: "error.main", mt: 0.5 }}>
        Invalid input
      </Typography>
    </Paper>
  );
}

export function FormSpecificError() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 500, mb: 0.5 }}>
        Password
      </Typography>
      <Box
        sx={{
          ...inputSx,
          borderColor: "error.main",
        }}
      >
        <Typography sx={{ fontSize: 13 }}>abc</Typography>
      </Box>
      <Typography sx={{ fontSize: 12, color: "error.main", mt: 0.5 }}>
        Password must be at least 8 characters
      </Typography>
    </Paper>
  );
}

export function FormTinyTargets() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        {["Email notifications", "SMS alerts", "Weekly digest"].map((label) => (
          <Box
            key={label}
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
            <Typography sx={{ fontSize: 11 }}>{label}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

export function FormLargeTargets() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        {["Email notifications", "SMS alerts", "Weekly digest"].map(
          (label, i) => (
            <Box
              key={label}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                minHeight: 44,
                px: 1,
                borderRadius: 1,
                bgcolor: i === 0 ? "action.hover" : "transparent",
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
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
                      width: 12,
                      height: 12,
                      bgcolor: "primary.main",
                      borderRadius: 0.25,
                    }}
                  />
                )}
              </Box>
              <Typography sx={{ fontSize: 14 }}>{label}</Typography>
            </Box>
          ),
        )}
      </Stack>
    </Paper>
  );
}

export function FormWallOfFields() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1}>
        {[
          "First name",
          "Last name",
          "Email",
          "Phone",
          "Street",
          "City",
          "Country",
        ].map((label) => (
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
      <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
        Personal Info
      </Typography>
      <Stack spacing={1} sx={{ mb: 2 }}>
        {["First name", "Last name", "Email", "Phone"].map((label) => (
          <Box key={label}>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}
            >
              {label}
            </Typography>
            <Box sx={{ ...inputSx, height: 28 }}>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                ...
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
      <Typography sx={{ fontSize: 13, fontWeight: 700, mb: 1 }}>
        Address
      </Typography>
      <Stack spacing={1}>
        {["Street", "City", "Country"].map((label) => (
          <Box key={label}>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary", mb: 0.25 }}
            >
              {label}
            </Typography>
            <Box sx={{ ...inputSx, height: 28 }}>
              <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                ...
              </Typography>
            </Box>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
