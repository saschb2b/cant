"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import NextLink from "next/link";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import { useColorScheme } from "@mui/material/styles";
import { REPO_URL } from "@cant/shared/lib/cant-apps";
import { GithubIcon } from "@cant/shared/components/github-icon";
import { trackEvent } from "@/lib/analytics";
import { CompassIcon } from "./compass-icon";
import { UserMenu } from "./user-menu";

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

function useScrolled(threshold = 10) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function SiteHeader() {
  const scrolled = useScrolled();

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        backdropFilter: "blur(20px)",
        borderBottom: 1,
        borderColor: scrolled ? "divider" : "transparent",
        transition: "border-color 0.3s ease",
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" alignItems="center" sx={{ py: 2 }}>
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
            <CompassIcon size={24} />
            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
              {"Can't Hub"}
            </Typography>
          </NextLink>

          <Stack
            component="nav"
            aria-label="Site navigation"
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ ml: "auto" }}
          >
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
            <UserMenu />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
