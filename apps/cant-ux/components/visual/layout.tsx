import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

export function LayoutFullWidth() {
  return (
    <Paper sx={{ p: 2, width: "100%" }}>
      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
        Getting Started
      </Typography>
      <Typography sx={{ fontSize: 13, mb: 1.5 }}>
        Welcome to the platform. This guide will walk you through everything you
        need to know to set up your account, configure your workspace, and start
        collaborating with your team on projects.
      </Typography>
      <Button variant="contained" size="small">
        Begin Setup
      </Button>
    </Paper>
  );
}

export function LayoutConstrained() {
  return (
    <Paper sx={{ p: 2, maxWidth: 280 }}>
      <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 1 }}>
        Getting Started
      </Typography>
      <Typography sx={{ fontSize: 13, mb: 1.5 }}>
        Welcome to the platform. This guide will walk you through everything you
        need to know to set up your account, configure your workspace, and start
        collaborating with your team on projects.
      </Typography>
      <Button variant="contained" size="small">
        Begin Setup
      </Button>
    </Paper>
  );
}

export function FormSideBySide() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 13, minWidth: 70 }}>Name</Typography>
          <Box
            sx={{
              flex: 1,
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
              Jane
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 13, minWidth: 70 }}>Email</Typography>
          <Box
            sx={{
              flex: 1,
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
              jane@co.com
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography sx={{ fontSize: 13, minWidth: 70 }}>Company</Typography>
          <Box
            sx={{
              flex: 1,
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
              Acme Inc
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

export function FormStacked() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack spacing={2}>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
            Name
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
              Jane
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
            Email
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
              jane@co.com
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
            Company
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
              Acme Inc
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

export function CardLayoutUneven() {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      <Paper sx={{ p: 1.5, flex: "0 0 auto", width: 80 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Plan A</Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Basic
        </Typography>
      </Paper>
      <Paper sx={{ p: 1.5, flex: "0 0 auto", width: 110 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Plan B</Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          Pro tier with extras
        </Typography>
        <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
          $29/mo
        </Typography>
      </Paper>
      <Paper sx={{ p: 1.5, flex: "0 0 auto", width: 90 }}>
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Plan C</Typography>
      </Paper>
    </Box>
  );
}

export function CardLayoutConsistent() {
  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {[
        { name: "Plan A", desc: "Basic", price: "$9/mo" },
        { name: "Plan B", desc: "Pro", price: "$29/mo" },
        { name: "Plan C", desc: "Team", price: "$79/mo" },
      ].map((plan) => (
        <Paper key={plan.name} sx={{ p: 1.5, flex: 1, minHeight: 70 }}>
          <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
            {plan.name}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {plan.desc}
          </Typography>
          <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
            {plan.price}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

export function ContentLeftAligned() {
  return (
    <Paper sx={{ p: 2, maxWidth: 260 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
        Features
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
        Everything you need to build great products.
      </Typography>
      <Stack spacing={0.5} sx={{ mb: 1.5 }}>
        <Typography sx={{ fontSize: 13 }}>Real-time collaboration</Typography>
        <Typography sx={{ fontSize: 13 }}>Version history</Typography>
        <Typography sx={{ fontSize: 13 }}>Role-based access</Typography>
      </Stack>
      <Button variant="contained" size="small">
        Learn More
      </Button>
    </Paper>
  );
}

export function ContentCenterAligned() {
  return (
    <Paper sx={{ p: 2, maxWidth: 260, textAlign: "center" }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
        Features
      </Typography>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 1 }}>
        Everything you need to build great products.
      </Typography>
      <Stack spacing={0.5} sx={{ mb: 1.5, alignItems: "center" }}>
        <Typography sx={{ fontSize: 13 }}>Real-time collaboration</Typography>
        <Typography sx={{ fontSize: 13 }}>Version history</Typography>
        <Typography sx={{ fontSize: 13 }}>Role-based access</Typography>
      </Stack>
      <Button variant="contained" size="small">
        Learn More
      </Button>
    </Paper>
  );
}
