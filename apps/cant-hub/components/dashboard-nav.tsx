"use client";

import NextLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Assessments", exact: true },
  { href: "/dashboard/settings", label: "Settings" },
];

function NavItem({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Box
      component={NextLink}
      href={href}
      sx={{
        display: "block",
        px: 2,
        py: 1,
        borderRadius: 1,
        textDecoration: "none",
        color: active ? "text.primary" : "text.secondary",
        bgcolor: active ? "action.selected" : "transparent",
        fontWeight: active ? 600 : 400,
        transition: "background-color 0.15s, color 0.15s",
        "&:hover": {
          bgcolor: active ? "action.selected" : "action.hover",
          color: "text.primary",
        },
      }}
    >
      <Typography variant="body2" fontWeight="inherit">
        {label}
      </Typography>
    </Box>
  );
}

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <Box
      component="nav"
      aria-label="Dashboard navigation"
      sx={{
        width: { md: 200 },
        flexShrink: 0,
      }}
    >
      <Stack
        direction={{ xs: "row", md: "column" }}
        spacing={0.5}
        sx={{
          position: { md: "sticky" },
          top: { md: 80 },
        }}
      >
        {NAV_ITEMS.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <NavItem
              key={item.href}
              href={item.href}
              label={item.label}
              active={active}
            />
          );
        })}
      </Stack>
    </Box>
  );
}
