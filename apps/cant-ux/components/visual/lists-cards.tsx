import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Uneven card heights vs uniform cards ---------- */

const cardData = [
  {
    title: "Analytics Dashboard",
    desc: "Real-time metrics and custom reports for your team.",
  },
  {
    title: "User Management",
    desc: "Invite members, assign roles, and manage permissions across your organization. Includes audit logs.",
  },
  {
    title: "Integrations",
    desc: "Connect with 50+ tools.",
  },
];

export function CardUnevenHeights() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Features
      </Typography>
      <Stack spacing={1}>
        {cardData.map((card) => (
          <Paper key={card.title} variant="outlined" sx={{ p: 1.25 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.25 }}>
              {card.title}
            </Typography>
            <Typography
              sx={{ fontSize: 11, color: "text.secondary", lineHeight: 1.5 }}
            >
              {card.desc}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export function CardUniformHeights() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Features
      </Typography>
      <Stack spacing={1}>
        {cardData.map((card) => (
          <Paper
            key={card.title}
            variant="outlined"
            sx={{
              p: 1.25,
              minHeight: 56,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.25 }}>
              {card.title}
            </Typography>
            <Typography
              sx={{
                fontSize: 11,
                color: "text.secondary",
                lineHeight: 1.5,
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
              }}
            >
              {card.desc}
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Static-looking clickable cards vs clear affordance ---------- */

export function CardNoAffordance() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Recent Projects
      </Typography>
      <Stack spacing={0.75}>
        {["Design System v2", "Marketing Site", "Mobile App"].map((name) => (
          <Paper key={name} variant="outlined" sx={{ p: 1.25 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
              {name}
            </Typography>
            <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
              Updated 2 days ago
            </Typography>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

export function CardWithAffordance() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Recent Projects
      </Typography>
      <Stack spacing={0.75}>
        {["Design System v2", "Marketing Site", "Mobile App"].map((name) => (
          <Paper
            key={name}
            variant="outlined"
            sx={{
              p: 1.25,
              cursor: "pointer",
              "&:hover": { boxShadow: 2, borderColor: "primary.main" },
              transition: "box-shadow 0.15s, border-color 0.15s",
            }}
          >
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Stack>
                <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
                  {name}
                </Typography>
                <Typography sx={{ fontSize: 10, color: "text.secondary" }}>
                  Updated 2 days ago
                </Typography>
              </Stack>
              <Typography sx={{ fontSize: 14, color: "text.disabled" }}>
                {"\u203A"}
              </Typography>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Paper>
  );
}

/* ---------- Overloaded card vs focused card ---------- */

export function CardOverloaded() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Paper variant="outlined" sx={{ p: 1.25 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600 }}>Pro Plan</Typography>
        <Typography
          sx={{
            fontSize: 10,
            color: "text.secondary",
            lineHeight: 1.5,
            my: 0.5,
          }}
        >
          Unlimited projects, 100GB storage, priority support, custom domains,
          API access, SSO, audit logs, advanced analytics, team management, and
          white-label options.
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ flexWrap: "wrap", mb: 0.75 }}
        >
          {[
            "Projects",
            "Storage",
            "Support",
            "Domains",
            "API",
            "SSO",
            "Audit",
            "Analytics",
          ].map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 0.5,
                py: 0.1,
                bgcolor: "action.hover",
                borderRadius: 0.5,
                fontSize: 8,
                color: "text.secondary",
              }}
            >
              {tag}
            </Box>
          ))}
        </Stack>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: "baseline" }}>
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>$49</Typography>
          <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
            /mo
          </Typography>
        </Stack>
        <Typography sx={{ fontSize: 9, color: "text.disabled", mt: 0.25 }}>
          Billed annually. 14-day free trial. Cancel anytime.
        </Typography>
      </Paper>
    </Paper>
  );
}

export function CardFocused() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Paper variant="outlined" sx={{ p: 1.25 }}>
        <Typography sx={{ fontSize: 12, fontWeight: 600, mb: 0.25 }}>
          Pro Plan
        </Typography>
        <Typography
          sx={{ fontSize: 10, color: "text.secondary", lineHeight: 1.5, mb: 1 }}
        >
          Unlimited projects, priority support, and advanced analytics.
        </Typography>
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: "baseline", mb: 1 }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>$49</Typography>
          <Typography sx={{ fontSize: 9, color: "text.secondary" }}>
            /mo
          </Typography>
        </Stack>
        <Box
          sx={{
            px: 1.5,
            py: 0.5,
            bgcolor: "primary.main",
            borderRadius: 1,
            display: "inline-flex",
            cursor: "pointer",
          }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 600, color: "#fff" }}>
            View details
          </Typography>
        </Box>
      </Paper>
    </Paper>
  );
}

/* ---------- Flat list vs sectioned list ---------- */

const allItems = [
  "Profile settings",
  "Change password",
  "Notification preferences",
  "Email forwarding",
  "Billing history",
  "Payment method",
  "Usage limits",
];

export function ListFlat() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Settings
      </Typography>
      <Stack spacing={0.5}>
        {allItems.map((item) => (
          <Typography key={item} sx={{ fontSize: 12, py: 0.5 }}>
            {item}
          </Typography>
        ))}
      </Stack>
    </Paper>
  );
}

export function ListGrouped() {
  return (
    <Paper sx={{ p: 1.5 }}>
      <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
        Settings
      </Typography>
      {[
        { section: "Account", items: ["Profile settings", "Change password"] },
        {
          section: "Notifications",
          items: ["Notification preferences", "Email forwarding"],
        },
        {
          section: "Billing",
          items: ["Billing history", "Payment method", "Usage limits"],
        },
      ].map((group) => (
        <Box key={group.section} sx={{ mb: 1.25 }}>
          <Typography
            sx={{
              fontSize: 10,
              fontWeight: 600,
              color: "text.disabled",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              mb: 0.5,
            }}
          >
            {group.section}
          </Typography>
          <Stack
            spacing={0}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
              overflow: "hidden",
            }}
          >
            {group.items.map((item, i) => (
              <Box
                key={item}
                sx={{
                  px: 1,
                  py: 0.75,
                  borderTop: i > 0 ? "1px solid" : "none",
                  borderColor: "divider",
                }}
              >
                <Typography sx={{ fontSize: 11 }}>{item}</Typography>
              </Box>
            ))}
          </Stack>
        </Box>
      ))}
    </Paper>
  );
}
