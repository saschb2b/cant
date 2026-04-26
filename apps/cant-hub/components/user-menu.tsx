"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { authClient } from "@/lib/auth-client";

const SCREENING_ENABLED = process.env.NEXT_PUBLIC_SCREENING_ENABLED === "true";

function DashboardIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronDownIcon() {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/** Stable gradient from a string (name or email). */
function stringToGradient(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${String(h1)}, 65%, 55%), hsl(${String(h2)}, 55%, 45%))`;
}

function UserPill({
  name,
  image,
  onClick,
  open,
}: {
  name: string;
  image?: string | null;
  onClick: (e: React.MouseEvent<HTMLElement>) => void;
  open: boolean;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Box
      component="button"
      onClick={onClick}
      aria-label="Account menu"
      aria-expanded={open}
      aria-haspopup="menu"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        pl: 0.75,
        pr: 1,
        py: 0.75,
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "transparent",
        cursor: "pointer",
        transition: "border-color 0.15s, background-color 0.15s",
        "&:hover": {
          borderColor: "text.disabled",
          bgcolor: "action.hover",
        },
        ...(open && {
          borderColor: "text.disabled",
          bgcolor: "action.hover",
        }),
      }}
    >
      {/* Avatar */}
      <Box
        sx={{
          width: 24,
          height: 24,
          borderRadius: "50%",
          overflow: "hidden",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          ...(image
            ? {}
            : {
                background: stringToGradient(name),
              }),
        }}
      >
        {image ? (
          <Box
            component="img"
            src={image}
            alt={name}
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              lineHeight: 1,
              letterSpacing: "0.02em",
            }}
          >
            {initials}
          </Typography>
        )}
      </Box>

      {/* Label + name (hidden on mobile) */}
      <Box
        sx={{
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
          alignItems: "flex-start",
          minWidth: 0,
          gap: 0.25,
        }}
      >
        <Typography
          sx={{
            fontSize: "0.65rem",
            fontWeight: 600,
            color: "text.secondary",
            lineHeight: 1,
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          My Account
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.primary",
            maxWidth: 120,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            lineHeight: 1.2,
            fontSize: "0.8rem",
          }}
        >
          {name}
        </Typography>
      </Box>

      {/* Chevron */}
      <Box
        sx={{
          color: "text.secondary",
          display: "flex",
          alignItems: "center",
          transition: "transform 0.15s",
          transform: open ? "rotate(180deg)" : "none",
        }}
      >
        <ChevronDownIcon />
      </Box>
    </Box>
  );
}

export function UserMenu() {
  if (!SCREENING_ENABLED) return null;
  return <UserMenuInner />;
}

function UserMenuInner() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  if (isPending) return null;

  if (!session) {
    return (
      <Button
        component={NextLink}
        href="/sign-in"
        size="small"
        variant="outlined"
      >
        Sign in
      </Button>
    );
  }

  const user = session.user;
  const isRecruiter = user.role === "recruiter";

  return (
    <>
      <UserPill
        name={user.name}
        image={user.image}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        open={open}
      />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        <MenuItem disabled sx={{ opacity: "1 !important" }}>
          <ListItemText
            primary={user.name}
            secondary={
              <>
                {user.email}
                {user.role && (
                  <Chip
                    label={user.role}
                    size="small"
                    variant="outlined"
                    sx={{
                      ml: 1,
                      height: 20,
                      fontSize: "0.7rem",
                      textTransform: "capitalize",
                    }}
                  />
                )}
              </>
            }
            slotProps={{
              primary: { fontWeight: 600, variant: "body2" },
              secondary: {
                variant: "caption",
                component: "div",
                sx: { display: "flex", alignItems: "center", mt: 0.25 },
              },
            }}
          />
        </MenuItem>
        <Divider />
        {isRecruiter && (
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              router.push("/dashboard");
            }}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText>Dashboard</ListItemText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setAnchorEl(null);
            void authClient.signOut().then(() => {
              router.push("/");
              router.refresh();
            });
          }}
        >
          <ListItemIcon>
            <LogOutIcon />
          </ListItemIcon>
          <ListItemText>Sign out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
