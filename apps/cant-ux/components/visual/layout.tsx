import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Full-width vs constrained article header ---------- */

export function LayoutFullWidth() {
  return (
    <Paper sx={{ p: 2, width: "100%" }}>
      <Box
        component="img"
        src="/challenges/blog-cover.jpg"
        alt="Blog cover"
        sx={{
          width: "100%",
          aspectRatio: "16 / 5",
          objectFit: "cover",
          display: "block",
          mb: 1.5,
        }}
      />
      <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 0.5 }}>
        Understanding Design Systems at Scale
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
        <Box
          component="img"
          src="/challenges/avatar.jpg"
          alt="Author"
          sx={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Sarah Chen · Mar 14, 2026 · 8 min read
        </Typography>
      </Stack>
      <Typography
        sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.5 }}
      >
        Design systems have become the backbone of modern product development.
        They allow teams to move faster, maintain consistency across dozens of
        surfaces, and reduce the cognitive load on designers and engineers who
        would otherwise reinvent common patterns from scratch every sprint.
      </Typography>
    </Paper>
  );
}

export function LayoutConstrained() {
  return (
    <Paper
      sx={{
        p: 2,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ maxWidth: 300, width: "100%" }}>
        <Box
          component="img"
          src="/challenges/blog-cover.jpg"
          alt="Blog cover"
          sx={{
            width: "100%",
            aspectRatio: "16 / 5",
            objectFit: "cover",
            display: "block",
            mb: 1.5,
          }}
        />
        <Typography sx={{ fontSize: 17, fontWeight: 700, mb: 0.5 }}>
          Understanding Design Systems at Scale
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: "center" }}>
          <Box
            component="img"
            src="/challenges/avatar.jpg"
            alt="Author"
            sx={{
              width: 24,
              height: 24,
              borderRadius: "50%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
          <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
            Sarah Chen · Mar 14, 2026 · 8 min read
          </Typography>
        </Stack>
        <Typography
          sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.5 }}
        >
          Design systems have become the backbone of modern product development.
          They allow teams to move faster, maintain consistency across dozens of
          surfaces, and reduce the cognitive load on designers and engineers who
          would otherwise reinvent common patterns from scratch every sprint.
        </Typography>
      </Box>
    </Paper>
  );
}

/* ---------- Side-by-side vs stacked form labels ---------- */

const contactFields = [
  { label: "Full name", placeholder: "Sarah Chen" },
  { label: "Email address", placeholder: "sarah@company.com" },
  { label: "Subject", placeholder: "Project inquiry" },
  { label: "Message", placeholder: "Tell us about your project..." },
] as const;

const inputSx = {
  height: 30,
  border: "1px solid",
  borderColor: "divider",
  borderRadius: 1,
  px: 1,
  display: "flex",
  alignItems: "center",
} as const;

export function FormSideBySide() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
        Contact Us
      </Typography>
      <Stack spacing={1.5}>
        {contactFields.map((field) => (
          <Box
            key={field.label}
            sx={{ display: "flex", alignItems: "center", gap: 1 }}
          >
            <Typography
              sx={{
                fontSize: 12,
                color: "text.secondary",
                minWidth: 90,
                textAlign: "right",
                flexShrink: 0,
              }}
            >
              {field.label}
            </Typography>
            <Box sx={{ ...inputSx, flex: 1 }}>
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

export function FormStacked() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 14, fontWeight: 600, mb: 1.5 }}>
        Contact Us
      </Typography>
      <Stack spacing={1.5}>
        {contactFields.map((field) => (
          <Box key={field.label}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 500,
                color: "text.primary",
                mb: 0.5,
              }}
            >
              {field.label}
            </Typography>
            <Box sx={inputSx}>
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

/* ---------- Uneven vs consistent card layout ---------- */

const products = [
  { name: "Wireless Earbuds", price: "$59", img: "/challenges/earbuds.jpg" },
  { name: "Travel Mug", price: "$24", img: "/challenges/mug.jpg" },
  { name: "Desk Lamp", price: "$42", img: "/challenges/lamp.jpg" },
] as const;

export function CardLayoutUneven() {
  return (
    <Box sx={{ display: "flex", gap: 0.75 }}>
      <Paper sx={{ p: 1, flex: "0 0 auto", width: 95 }}>
        <Box
          component="img"
          src={products[0].img}
          alt={products[0].name}
          sx={{
            width: "100%",
            aspectRatio: "1",
            objectFit: "cover",
            display: "block",
            mb: 0.5,
          }}
        />
        <Typography sx={{ fontSize: 13, fontWeight: 600 }}>
          {products[0].name}
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          {products[0].price}
        </Typography>
      </Paper>
      <Paper variant="outlined" sx={{ p: 1.5, flex: "0 0 auto", width: 110 }}>
        <Box
          component="img"
          src={products[1].img}
          alt={products[1].name}
          sx={{
            width: "100%",
            aspectRatio: "4 / 3",
            objectFit: "cover",
            display: "block",
            mb: 1,
          }}
        />
        <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
          {products[1].name}
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          {products[1].price}
        </Typography>
      </Paper>
      <Paper
        sx={{
          p: 0.75,
          flex: "0 0 auto",
          width: 85,
          border: "2px solid",
          borderColor: "divider",
        }}
      >
        <Box
          component="img"
          src={products[2].img}
          alt={products[2].name}
          sx={{
            width: "100%",
            aspectRatio: "3 / 2",
            objectFit: "cover",
            display: "block",
            mb: 0.25,
          }}
        />
        <Typography sx={{ fontSize: 12, fontWeight: 500 }}>
          {products[2].name}
        </Typography>
      </Paper>
    </Box>
  );
}

export function CardLayoutConsistent() {
  return (
    <Box sx={{ display: "flex", gap: 0.75 }}>
      {products.map((product) => (
        <Paper key={product.name} sx={{ p: 1, flex: 1, minWidth: 0 }}>
          <Box
            component="img"
            src={product.img}
            alt={product.name}
            sx={{
              width: "100%",
              aspectRatio: "1",
              objectFit: "cover",
              display: "block",
              mb: 0.75,
            }}
          />
          <Typography sx={{ fontSize: 12, fontWeight: 600 }}>
            {product.name}
          </Typography>
          <Typography sx={{ fontSize: 11, color: "text.secondary", mt: 0.25 }}>
            {product.price}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

/* ---------- Center-aligned vs left-aligned content section ---------- */

const features = [
  "Real-time collaboration with up to 20 team members",
  "Version history and automatic backups",
  "Role-based access controls and audit logs",
] as const;

export function ContentCenterAligned() {
  return (
    <Paper sx={{ p: 2, textAlign: "center" }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
        Why teams choose Acme
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>
        Everything you need to ship products faster.
      </Typography>
      <Stack spacing={0.75} sx={{ mb: 1.5, alignItems: "center" }}>
        {features.map((feature) => (
          <Typography
            key={feature}
            sx={{ fontSize: 12, color: "text.primary" }}
          >
            {feature}
          </Typography>
        ))}
      </Stack>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "primary.main",
          cursor: "pointer",
        }}
      >
        Start your free trial
      </Typography>
    </Paper>
  );
}

export function ContentLeftAligned() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography sx={{ fontSize: 16, fontWeight: 700, mb: 0.5 }}>
        Why teams choose Acme
      </Typography>
      <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.5 }}>
        Everything you need to ship products faster.
      </Typography>
      <Stack spacing={0.75} sx={{ mb: 1.5 }}>
        {features.map((feature) => (
          <Stack
            key={feature}
            direction="row"
            spacing={0.75}
            sx={{ alignItems: "flex-start" }}
          >
            <Box
              sx={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                bgcolor: "primary.main",
                mt: 0.75,
                flexShrink: 0,
              }}
            />
            <Typography sx={{ fontSize: 12, color: "text.primary" }}>
              {feature}
            </Typography>
          </Stack>
        ))}
      </Stack>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "primary.main",
          cursor: "pointer",
        }}
      >
        Start your free trial
      </Typography>
    </Paper>
  );
}
