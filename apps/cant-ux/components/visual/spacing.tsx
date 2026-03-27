import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const orderItems = [
  { name: "Wireless Earbuds", price: "$79.00" },
  { name: "USB-C Cable (2m)", price: "$12.99" },
  { name: "Phone Case", price: "$24.00" },
];

export function SpacingRandom() {
  return (
    <Paper sx={{ pt: "14px", pb: "20px", pl: "18px", pr: "12px" }}>
      <Typography sx={{ fontWeight: 700, fontSize: 15, mb: "7px" }}>
        Order Summary
      </Typography>
      {orderItems.map((item, i) => (
        <Box
          key={i}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: i === 0 ? "13px" : i === 1 ? "7px" : "22px",
          }}
        >
          <Typography sx={{ fontSize: 13 }}>{item.name}</Typography>
          <Typography sx={{ fontSize: 13 }}>{item.price}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: "9px" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: "5px" }}>
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          Subtotal
        </Typography>
        <Typography sx={{ fontSize: 13 }}>$115.99</Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: "18px",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
          Shipping
        </Typography>
        <Typography sx={{ fontSize: 13 }}>$5.99</Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Total</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>$121.98</Typography>
      </Box>
    </Paper>
  );
}

export function SpacingConsistentScale() {
  return (
    <Paper sx={{ p: "16px" }}>
      <Typography sx={{ fontWeight: 700, fontSize: 15, mb: "8px" }}>
        Order Summary
      </Typography>
      <Stack spacing="8px">
        {orderItems.map((item, i) => (
          <Box
            key={i}
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
            <Typography sx={{ fontSize: 13 }}>{item.name}</Typography>
            <Typography sx={{ fontSize: 13 }}>{item.price}</Typography>
          </Box>
        ))}
      </Stack>
      <Divider sx={{ my: "16px" }} />
      <Stack spacing="8px">
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Subtotal
          </Typography>
          <Typography sx={{ fontSize: 13 }}>$115.99</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            Shipping
          </Typography>
          <Typography sx={{ fontSize: 13 }}>$5.99</Typography>
        </Box>
      </Stack>
      <Divider sx={{ my: "16px" }} />
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>Total</Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>$121.98</Typography>
      </Box>
    </Paper>
  );
}

export function SpacingCramped() {
  return (
    <Paper sx={{ p: "6px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "4px" }}>
        <Box
          component="img"
          src="/challenges/avatar.jpg"
          alt="Avatar"
          sx={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2 }}>
            Sarah Chen
          </Typography>
          <Typography
            sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.2 }}
          >
            Product Designer
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          mt: "2px",
          lineHeight: 1.3,
        }}
      >
        Focused on design systems and accessibility. Previously at Figma and
        Stripe.
      </Typography>
      <Typography
        sx={{
          fontSize: 12,
          color: "#1976d2",
          mt: "3px",
          cursor: "pointer",
        }}
      >
        Edit Profile
      </Typography>
    </Paper>
  );
}

export function SpacingGenerous() {
  return (
    <Paper sx={{ p: "24px" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Box
          component="img"
          src="/challenges/avatar.jpg"
          alt="Avatar"
          sx={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <Box>
          <Typography sx={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
            Sarah Chen
          </Typography>
          <Typography
            sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.3 }}
          >
            Product Designer
          </Typography>
        </Box>
      </Box>
      <Typography
        sx={{
          fontSize: 12,
          color: "text.secondary",
          mt: "16px",
          lineHeight: 1.5,
        }}
      >
        Focused on design systems and accessibility. Previously at Figma and
        Stripe.
      </Typography>
      <Typography
        sx={{
          fontSize: 12,
          color: "#1976d2",
          mt: "12px",
          cursor: "pointer",
        }}
      >
        Edit Profile
      </Typography>
    </Paper>
  );
}

export function SpacingNoProximity() {
  return (
    <Paper sx={{ p: "16px" }}>
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
        First Name
      </Typography>
      <Box
        sx={{
          mt: "20px",
          height: 30,
          border: "1px solid",
          borderColor: "divider",
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.primary" }}>
          Jamie
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mt: "20px" }}>
        Last Name
      </Typography>
      <Box
        sx={{
          mt: "20px",
          height: 30,
          border: "1px solid",
          borderColor: "divider",
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.primary" }}>
          Rivera
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mt: "20px" }}>
        Email
      </Typography>
      <Box
        sx={{
          mt: "20px",
          height: 30,
          border: "1px solid",
          borderColor: "divider",
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, color: "text.primary" }}>
          jamie@example.com
        </Typography>
      </Box>
    </Paper>
  );
}

export function SpacingProximity() {
  return (
    <Paper sx={{ p: "16px" }}>
      <Stack spacing="24px">
        <Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: "4px" }}>
            First Name
          </Typography>
          <Box
            sx={{
              height: 30,
              border: "1px solid",
              borderColor: "divider",
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "text.primary" }}>
              Jamie
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: "4px" }}>
            Last Name
          </Typography>
          <Box
            sx={{
              height: 30,
              border: "1px solid",
              borderColor: "divider",
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "text.primary" }}>
              Rivera
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography sx={{ fontSize: 12, color: "text.secondary", mb: "4px" }}>
            Email
          </Typography>
          <Box
            sx={{
              height: 30,
              border: "1px solid",
              borderColor: "divider",
              px: 1,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: 13, color: "text.primary" }}>
              jamie@example.com
            </Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

const navItems = ["Dashboard", "Analytics", "Settings", "Team", "Billing"];

export function SpacingBorderSeparation() {
  return (
    <Paper sx={{ p: "12px" }}>
      {navItems.map((item, i) => (
        <Box
          key={i}
          sx={{
            py: "8px",
            px: "8px",
            borderTop: i > 0 ? "1px solid" : "none",
            borderBottom: i === navItems.length - 1 ? "1px solid" : "none",
            borderColor: "divider",
          }}
        >
          <Typography sx={{ fontSize: 13 }}>{item}</Typography>
        </Box>
      ))}
    </Paper>
  );
}

export function SpacingWhitespaceSeparation() {
  return (
    <Paper sx={{ p: "12px" }}>
      <Stack spacing="12px">
        {navItems.map((item, i) => (
          <Box key={i} sx={{ px: "8px" }}>
            <Typography sx={{ fontSize: 13 }}>{item}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
