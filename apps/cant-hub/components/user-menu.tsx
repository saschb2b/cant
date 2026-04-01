"use client";

import { useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { authClient } from "@/lib/auth-client";

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

export function UserMenu() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label="Account menu"
      >
        <Avatar
          src={user.image ?? undefined}
          alt={user.name}
          sx={{ width: 28, height: 28, fontSize: 14 }}
        >
          {user.name?.charAt(0).toUpperCase()}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        slotProps={{ paper: { sx: { minWidth: 180, mt: 1 } } }}
      >
        <MenuItem disabled>
          <ListItemText
            primary={user.name}
            secondary={user.email}
            primaryTypographyProps={{ fontWeight: 600, variant: "body2" }}
            secondaryTypographyProps={{ variant: "caption" }}
          />
        </MenuItem>
        <MenuItem
          onClick={async () => {
            setAnchorEl(null);
            await authClient.signOut();
            router.refresh();
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
