"use client";

import type { ReactNode } from "react";
import NextLink from "next/link";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { GraduationCap, Compass, LayoutGrid } from "lucide-react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import { Search } from "lucide-react";
import { useTrackEvent } from "../lib/analytics-context";
import { ALL_APPS, HUB_URL, REPO_URL } from "../lib/cant-apps";
import { AppIcon } from "./app-icon";
import { GithubIcon } from "./github-icon";

function ThemeIcon({ isDark, size = 18 }: { isDark: boolean; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ overflow: "visible" }}
    >
      <mask id="theme-toggle-mask">
        <rect x="0" y="0" width="100%" height="100%" fill="white" />
        <circle
          cx={isDark ? 17 : 32}
          cy={isDark ? 7 : 2}
          r="9"
          fill="black"
          style={{ transition: "cx 0.5s ease, cy 0.5s ease" }}
        />
      </mask>
      <circle
        cx="12"
        cy="12"
        r={isDark ? 9 : 5}
        fill="currentColor"
        stroke="none"
        mask="url(#theme-toggle-mask)"
        style={{ transition: "r 0.5s ease" }}
      />
      <g
        style={{
          transformOrigin: "center",
          transition: "transform 0.5s ease, opacity 0.3s ease",
          transform: isDark
            ? "rotate(45deg) scale(0)"
            : "rotate(0deg) scale(1)",
          opacity: isDark ? 0 : 1,
        }}
      >
        <line x1="12" y1="1" x2="12" y2="3" />
        <line x1="12" y1="21" x2="12" y2="23" />
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
        <line x1="1" y1="12" x2="3" y2="12" />
        <line x1="21" y1="12" x2="23" y2="12" />
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
      </g>
    </svg>
  );
}

function ColorSchemeToggle({ size = 18 }: { size?: number }) {
  const { mode, systemMode, setMode } = useColorScheme();
  const emptySubscribe = useCallback(() => () => undefined, []);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );

  const resolvedMode = mode === "system" ? systemMode : mode;
  const isDark = resolvedMode === "dark";

  return (
    <Tooltip
      title={
        mounted ? (isDark ? "Switch to light mode" : "Switch to dark mode") : ""
      }
    >
      <IconButton
        size="small"
        onClick={mounted ? () => setMode(isDark ? "light" : "dark") : undefined}
        sx={{ color: "text.secondary" }}
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <Box
          sx={{
            width: size,
            height: size,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.4s ease, transform 0.4s ease",
            opacity: mounted ? 1 : 0,
            transform: mounted
              ? "scale(1) rotate(0deg)"
              : "scale(0.5) rotate(-90deg)",
          }}
        >
          <ThemeIcon isDark={isDark} size={size} />
        </Box>
      </IconButton>
    </Tooltip>
  );
}

function AppSwitcher({ currentAppName }: { currentAppName?: string }) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  return (
    <>
      <Tooltip title="All apps">
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          sx={{ color: "text.secondary" }}
          aria-label="All apps"
        >
          <LayoutGrid size={18} />
        </IconButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              p: 2,
              borderRadius: 2,
              width: 280,
            },
          },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 1,
          }}
        >
          {ALL_APPS.map((app) => {
            const isCurrent = app.name === currentAppName;
            return (
              <Box
                key={app.name}
                component="a"
                href={app.href}
                target={isCurrent ? undefined : "_blank"}
                rel={isCurrent ? undefined : "noopener noreferrer"}
                onClick={() => setAnchorEl(null)}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 0.75,
                  p: 1.5,
                  borderRadius: 1.5,
                  textDecoration: "none",
                  color: "inherit",
                  transition: "background 0.15s ease",
                  bgcolor: isCurrent
                    ? "rgba(var(--mui-palette-primary-mainChannel) / 0.08)"
                    : "transparent",
                  "&:hover": {
                    bgcolor: isCurrent
                      ? "rgba(var(--mui-palette-primary-mainChannel) / 0.12)"
                      : "action.hover",
                  },
                }}
              >
                <AppIcon app={app} size={36} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: "0.6rem",
                    fontWeight: isCurrent ? 700 : 500,
                    textAlign: "center",
                    lineHeight: 1.2,
                    color: isCurrent ? "primary.main" : "text.secondary",
                  }}
                >
                  {app.name.replace("Can\u2019t ", "").replace("Can't ", "")}
                </Typography>
              </Box>
            );
          })}
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box
          component="a"
          href={HUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setAnchorEl(null)}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            p: 1,
            borderRadius: 1.5,
            textDecoration: "none",
            color: "text.secondary",
            transition: "all 0.15s ease",
            "&:hover": {
              bgcolor: "action.hover",
              color: "text.primary",
            },
          }}
        >
          <Compass size={18} />
          <Box>
            <Typography
              variant="caption"
              fontWeight={700}
              sx={{ display: "block", lineHeight: 1.2 }}
            >
              {"Can't Hub"}
            </Typography>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.6rem", opacity: 0.7 }}
            >
              See all topics
            </Typography>
          </Box>
        </Box>
      </Popover>
    </>
  );
}

/** A text link shown on desktop, icon button on mobile. */
interface NavTextLink {
  type: "text";
  href: string;
  label: string;
  icon: ReactNode;
}

/** A prominent CTA button. */
interface NavCtaLink {
  type: "cta";
  href: string;
  label: string;
}

type NavItem = NavTextLink | NavCtaLink;

/** Optional app-specific "gimmick" tool shown between Learn and Play. */
interface GimmickTool {
  href: string;
  label: string;
  icon: ReactNode;
}

interface SiteHeaderProps {
  title: string;
  subtitle: string;
  /** Name of the current app for the app switcher highlight. */
  currentAppName?: string;
  /** Optional app-specific tool (e.g. Viewer, Sandbox, Inspector). */
  gimmick?: GimmickTool;
  /** Render the search palette. Receives open state and onClose callback. */
  renderSearchPalette: (props: {
    open: boolean;
    onClose: () => void;
  }) => ReactNode;
}

export function SiteHeader({
  title,
  subtitle,
  currentAppName,
  gimmick,
  renderSearchPalette,
}: SiteHeaderProps) {
  const trackEvent = useTrackEvent();
  const [searchOpen, setSearchOpen] = useState(false);

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      {
        type: "text",
        href: "/learn",
        label: "Learn",
        icon: <GraduationCap size={18} />,
      },
    ];
    if (gimmick) {
      items.push({
        type: "text",
        href: gimmick.href,
        label: gimmick.label,
        icon: gimmick.icon,
      });
    }
    items.push({ type: "cta", href: "/play", label: "Play" });
    return items;
  }, [gimmick]);

  const openSearch = useCallback(
    (trigger: "hotkey" | "button") => {
      trackEvent("search-opened", { trigger });
      setSearchOpen(true);
    },
    [trackEvent],
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        openSearch("hotkey");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [openSearch]);

  return (
    <>
      <Box
        component="header"
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          backdropFilter: "blur(12px)",
        }}
      >
        <Container maxWidth="lg">
          <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <AppSwitcher currentAppName={currentAppName} />
              <NextLink
                href="/"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                <Image src="/icon.svg" alt="" width={28} height={28} priority />
                <Box sx={{ display: { xs: "none", sm: "block" } }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    lineHeight={1.2}
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    fontFamily="var(--font-geist-mono), monospace"
                  >
                    {subtitle}
                  </Typography>
                </Box>
              </NextLink>
            </Stack>

            <Stack
              direction="row"
              spacing={{ xs: 1, sm: 2 }}
              alignItems="center"
              sx={{ ml: "auto" }}
            >
              <Tooltip title="Search">
                <IconButton
                  onClick={() => openSearch("button")}
                  size="small"
                  sx={{
                    display: { xs: "flex", sm: "none" },
                    color: "text.secondary",
                  }}
                  aria-label="Search"
                >
                  <Search size={18} />
                </IconButton>
              </Tooltip>
              <Button
                onClick={() => openSearch("button")}
                size="small"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  color: "primary.main",
                  gap: 0.75,
                  borderRadius: 100,
                  minWidth: "auto",
                  bgcolor:
                    "rgba(var(--mui-palette-primary-mainChannel) / 0.08)",
                  border: 1,
                  borderColor:
                    "rgba(var(--mui-palette-primary-mainChannel) / 0.15)",
                  px: 2,
                  fontSize: "0.75rem",
                  fontWeight: 500,
                  fontFamily: "var(--font-geist-mono), monospace",
                  transition: "all 0.2s ease",
                  "&:hover": {
                    bgcolor:
                      "rgba(var(--mui-palette-primary-mainChannel) / 0.14)",
                    borderColor:
                      "rgba(var(--mui-palette-primary-mainChannel) / 0.25)",
                  },
                }}
              >
                <Search size={14} />
                Search
                <Box
                  component="kbd"
                  sx={{
                    display: { xs: "none", md: "inline" },
                    fontSize: "0.6rem",
                    fontWeight: 600,
                    ml: 0.5,
                    opacity: 0.5,
                  }}
                >
                  Ctrl K
                </Box>
              </Button>
              <Tooltip title="View on GitHub">
                <IconButton
                  component="a"
                  href={REPO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    trackEvent("contribute-clicked", { location: "header" })
                  }
                  size="small"
                  sx={{ color: "text.secondary" }}
                  aria-label="View on GitHub"
                >
                  <GithubIcon size={18} />
                </IconButton>
              </Tooltip>
              <ColorSchemeToggle />
              {navItems.map((item) => {
                if (item.type === "cta") {
                  return (
                    <NextLink
                      key={item.href}
                      href={item.href}
                      style={{ textDecoration: "none" }}
                    >
                      <Button variant="contained" size="small">
                        {item.label}
                      </Button>
                    </NextLink>
                  );
                }
                return (
                  <NextLink
                    key={item.href}
                    href={item.href}
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <Tooltip title={item.label}>
                      <IconButton
                        component="span"
                        size="small"
                        sx={{
                          display: { xs: "flex", sm: "none" },
                          color: "text.secondary",
                        }}
                        aria-label={item.label}
                      >
                        {item.icon}
                      </IconButton>
                    </Tooltip>
                    <Typography
                      variant="body2"
                      fontWeight={500}
                      fontFamily="var(--font-geist-mono), monospace"
                      sx={{
                        display: { xs: "none", sm: "block" },
                        color: "text.secondary",
                        "&:hover": { color: "text.primary" },
                      }}
                    >
                      {item.label}
                    </Typography>
                  </NextLink>
                );
              })}
            </Stack>
          </Stack>
        </Container>
        <Divider />
      </Box>

      {renderSearchPalette({
        open: searchOpen,
        onClose: () => setSearchOpen(false),
      })}
    </>
  );
}
