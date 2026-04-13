import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";

/* ---------- Vague labels vs specific labels ---------- */

const pageContent = (
  <Stack spacing={1} sx={{ p: 1.5 }}>
    <Box
      sx={{
        width: "90%",
        height: 10,
        bgcolor: "action.hover",
        borderRadius: 1,
      }}
    />
    <Box
      sx={{
        width: "75%",
        height: 10,
        bgcolor: "action.hover",
        borderRadius: 1,
      }}
    />
    <Box
      sx={{
        width: "60%",
        height: 10,
        bgcolor: "action.hover",
        borderRadius: 1,
      }}
    />
  </Stack>
);

export function NavVagueLabels() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Acme</Typography>
        {["Solutions", "Services", "Resources", "Company", "More"].map(
          (label) => (
            <Typography
              key={label}
              sx={{ fontSize: 11, color: "text.secondary" }}
            >
              {label}
            </Typography>
          ),
        )}
      </Stack>
      {pageContent}
    </Paper>
  );
}

export function NavSpecificLabels() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Acme</Typography>
        {["Pricing", "Docs", "Blog", "Changelog", "Support"].map((label) => (
          <Typography
            key={label}
            sx={{ fontSize: 11, color: "text.secondary" }}
          >
            {label}
          </Typography>
        ))}
      </Stack>
      {pageContent}
    </Paper>
  );
}

/* ---------- No breadcrumbs vs breadcrumb trail ---------- */

const articleContent = (
  <>
    <Typography sx={{ fontSize: 15, fontWeight: 700, mb: 0.5 }}>
      Configuring Environment Variables
    </Typography>
    <Typography sx={{ fontSize: 12, color: "text.secondary", lineHeight: 1.6 }}>
      Environment variables let you pass configuration to your app without
      hardcoding values. This guide covers local development, staging, and
      production setups.
    </Typography>
  </>
);

export function NavNoBreadcrumbs() {
  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        sx={{
          fontSize: 11,
          color: "primary.main",
          fontWeight: 500,
          mb: 1.5,
          cursor: "pointer",
        }}
      >
        &larr; Back
      </Typography>
      {articleContent}
    </Paper>
  );
}

export function NavBreadcrumbs() {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" spacing={0.5} sx={{ mb: 1.5, flexWrap: "wrap" }}>
        {["Docs", "Deployment", "Configuration"].map((crumb, i) => (
          <Stack key={crumb} direction="row" spacing={0.5}>
            {i > 0 && (
              <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                /
              </Typography>
            )}
            <Typography
              sx={{
                fontSize: 11,
                color: i < 2 ? "primary.main" : "text.secondary",
                fontWeight: i === 2 ? 500 : 400,
                cursor: i < 2 ? "pointer" : "default",
              }}
            >
              {crumb}
            </Typography>
          </Stack>
        ))}
      </Stack>
      {articleContent}
    </Paper>
  );
}

/* ---------- Deep nested menu vs flat mega-menu ---------- */

export function NavDeepNesting() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Shop</Typography>
        <Typography
          sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}
        >
          Categories &darr;
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Deals
        </Typography>
      </Stack>
      {/* Simulated nested dropdown */}
      <Box sx={{ position: "relative", minHeight: 130 }}>
        {/* Level 1 */}
        <Paper
          elevation={2}
          sx={{
            position: "absolute",
            left: 12,
            top: 4,
            width: 100,
            p: 0.75,
          }}
        >
          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontSize: 10,
                px: 0.75,
                py: 0.5,
                bgcolor: "action.hover",
                borderRadius: 0.5,
              }}
            >
              Electronics &rsaquo;
            </Typography>
            <Typography sx={{ fontSize: 10, px: 0.75, py: 0.5 }}>
              Clothing
            </Typography>
            <Typography sx={{ fontSize: 10, px: 0.75, py: 0.5 }}>
              Home
            </Typography>
          </Stack>
        </Paper>
        {/* Level 2 */}
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            left: 118,
            top: 4,
            width: 90,
            p: 0.75,
          }}
        >
          <Stack spacing={0.25}>
            <Typography
              sx={{
                fontSize: 10,
                px: 0.75,
                py: 0.5,
                bgcolor: "action.hover",
                borderRadius: 0.5,
              }}
            >
              Phones &rsaquo;
            </Typography>
            <Typography sx={{ fontSize: 10, px: 0.75, py: 0.5 }}>
              Laptops
            </Typography>
            <Typography sx={{ fontSize: 10, px: 0.75, py: 0.5 }}>
              Audio
            </Typography>
          </Stack>
        </Paper>
        {/* Level 3 */}
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            left: 214,
            top: 4,
            width: 80,
            p: 0.75,
          }}
        >
          <Stack spacing={0.25}>
            <Typography sx={{ fontSize: 10, px: 0.75, py: 0.5 }}>
              Android
            </Typography>
            <Typography sx={{ fontSize: 10, px: 0.75, py: 0.5 }}>
              iOS
            </Typography>
          </Stack>
        </Paper>
      </Box>
    </Paper>
  );
}

export function NavMegaMenu() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden" }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          alignItems: "center",
        }}
      >
        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>Shop</Typography>
        <Typography
          sx={{ fontSize: 11, color: "text.secondary", fontWeight: 500 }}
        >
          Categories &darr;
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
          Deals
        </Typography>
      </Stack>
      {/* Flat mega-menu panel */}
      <Box
        sx={{
          px: 2,
          py: 1.5,
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack direction="row" spacing={3}>
          {[
            { heading: "Electronics", items: ["Phones", "Laptops", "Audio"] },
            { heading: "Clothing", items: ["Men", "Women", "Kids"] },
            { heading: "Home", items: ["Kitchen", "Bedroom", "Garden"] },
          ].map((group) => (
            <Stack key={group.heading} spacing={0.5}>
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "text.primary",
                }}
              >
                {group.heading}
              </Typography>
              {group.items.map((item) => (
                <Typography
                  key={item}
                  sx={{ fontSize: 10, color: "text.secondary" }}
                >
                  {item}
                </Typography>
              ))}
            </Stack>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}

/* ---------- Squeezed mobile nav vs proper mobile nav ---------- */

export function NavMobileSqueezed() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden", maxWidth: 220, mx: "auto" }}>
      <Box
        sx={{
          overflowX: "auto",
          borderBottom: "1px solid",
          borderColor: "divider",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Stack
          direction="row"
          spacing={1.5}
          sx={{
            px: 1.5,
            py: 1,
            minWidth: 380,
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
            Acme
          </Typography>
          {["Home", "Products", "Pricing", "About", "Blog", "Contact"].map(
            (label) => (
              <Typography
                key={label}
                sx={{ fontSize: 10, color: "text.secondary", flexShrink: 0 }}
              >
                {label}
              </Typography>
            ),
          )}
        </Stack>
      </Box>
      <Box sx={{ p: 1.5 }}>
        <Box
          sx={{
            width: "100%",
            height: 8,
            bgcolor: "action.hover",
            borderRadius: 1,
            mb: 0.75,
          }}
        />
        <Box
          sx={{
            width: "80%",
            height: 8,
            bgcolor: "action.hover",
            borderRadius: 1,
          }}
        />
      </Box>
    </Paper>
  );
}

export function NavMobileHamburger() {
  return (
    <Paper sx={{ p: 0, overflow: "hidden", maxWidth: 220, mx: "auto" }}>
      {/* Top bar with hamburger */}
      <Stack
        direction="row"
        sx={{
          px: 1.5,
          py: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography sx={{ fontSize: 12, fontWeight: 700 }}>Acme</Typography>
        {/* Hamburger icon */}
        <Stack spacing={0.4}>
          {[0, 1, 2].map((i) => (
            <Box
              key={i}
              sx={{
                width: 14,
                height: 1.5,
                bgcolor: "text.primary",
                borderRadius: 0.5,
              }}
            />
          ))}
        </Stack>
      </Stack>
      {/* Open mobile menu */}
      <Box
        sx={{
          bgcolor: "background.default",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {[
          { label: "Home", active: true },
          { label: "Products", active: false },
          { label: "Pricing", active: false },
          { label: "About", active: false },
          { label: "Blog", active: false },
          { label: "Contact", active: false },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              px: 2,
              py: 1,
              bgcolor: item.active ? "action.hover" : "transparent",
            }}
          >
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: item.active ? 600 : 400,
                color: item.active ? "text.primary" : "text.secondary",
              }}
            >
              {item.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}
