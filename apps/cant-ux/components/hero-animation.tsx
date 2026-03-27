"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

/** A mini UI card showing a design pattern. */
function DesignCard({
  variant,
  isActive,
}: {
  variant: "bad" | "good";
  isActive: boolean;
}) {
  const isBad = variant === "bad";
  return (
    <Box
      sx={{
        width: 140,
        bgcolor: "background.paper",
        borderRadius: 1.5,
        overflow: "hidden",
        border: 2,
        borderColor: isActive
          ? isBad
            ? "error.main"
            : "success.main"
          : "divider",
        transition: "all 0.6s ease",
        transform: isActive ? "scale(1.03)" : "scale(1)",
        boxShadow: isActive
          ? "0 4px 20px rgba(0,0,0,0.12)"
          : "0 2px 8px rgba(0,0,0,0.06)",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 1,
          py: 0.5,
          bgcolor: isActive
            ? isBad
              ? "rgba(var(--mui-palette-error-mainChannel) / 0.08)"
              : "rgba(var(--mui-palette-success-mainChannel) / 0.08)"
            : "action.hover",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={700}
          sx={{
            fontSize: "0.6rem",
            color: isActive
              ? isBad
                ? "error.main"
                : "success.main"
              : "text.secondary",
          }}
        >
          {isBad ? "A" : "B"}
        </Typography>
      </Box>

      {/* Content showing UX pattern */}
      <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 0.75 }}>
        {isBad ? (
          <>
            {/* Bad: all same size, same weight, cramped */}
            <Box
              sx={{
                height: 8,
                width: "80%",
                bgcolor: "text.primary",
                opacity: 0.25,
                borderRadius: 0.5,
              }}
            />
            <Box
              sx={{
                height: 8,
                width: "65%",
                bgcolor: "text.primary",
                opacity: 0.25,
                borderRadius: 0.5,
              }}
            />
            <Box
              sx={{
                height: 8,
                width: "70%",
                bgcolor: "text.primary",
                opacity: 0.25,
                borderRadius: 0.5,
              }}
            />
            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
              <Box
                sx={{
                  flex: 1,
                  height: 16,
                  bgcolor: "primary.main",
                  opacity: 0.3,
                  borderRadius: 0.5,
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  height: 16,
                  bgcolor: "primary.main",
                  opacity: 0.3,
                  borderRadius: 0.5,
                }}
              />
              <Box
                sx={{
                  flex: 1,
                  height: 16,
                  bgcolor: "primary.main",
                  opacity: 0.3,
                  borderRadius: 0.5,
                }}
              />
            </Box>
          </>
        ) : (
          <>
            {/* Good: clear hierarchy, proper spacing */}
            <Box
              sx={{
                height: 10,
                width: "75%",
                bgcolor: "text.primary",
                opacity: 0.5,
                borderRadius: 0.5,
              }}
            />
            <Box
              sx={{
                height: 6,
                width: "55%",
                bgcolor: "text.primary",
                opacity: 0.15,
                borderRadius: 0.5,
              }}
            />
            <Box sx={{ mt: 0.5 }}>
              <Box
                sx={{
                  height: 6,
                  width: "90%",
                  bgcolor: "text.primary",
                  opacity: 0.12,
                  borderRadius: 0.5,
                  mb: 0.5,
                }}
              />
              <Box
                sx={{
                  height: 6,
                  width: "70%",
                  bgcolor: "text.primary",
                  opacity: 0.12,
                  borderRadius: 0.5,
                }}
              />
            </Box>
            <Box sx={{ display: "flex", gap: 0.5, mt: 0.5 }}>
              <Box
                sx={{
                  height: 16,
                  px: 1.5,
                  bgcolor: "primary.main",
                  opacity: 0.6,
                  borderRadius: 0.5,
                  flex: "0 0 auto",
                  width: 50,
                }}
              />
              <Box
                sx={{
                  height: 16,
                  px: 1,
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 0.5,
                  flex: "0 0 auto",
                  width: 40,
                  opacity: 0.4,
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

export function HeroAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const durations = [2200, 1800, 1200, 2200, 1200];
    let currentPhase = 0;
    let timeout: ReturnType<typeof setTimeout>;

    const advance = () => {
      currentPhase = (currentPhase + 1) % durations.length;
      setPhase(currentPhase);
    };

    const loop = () => {
      timeout = setTimeout(() => {
        advance();
        loop();
      }, durations[currentPhase]);
    };

    timeout = setTimeout(() => {
      advance();
      loop();
    }, durations[0]);

    return () => clearTimeout(timeout);
  }, []);

  const isActive = phase === 1 || phase === 2;

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 4, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* Glow behind cards */}
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          height: "70%",
          borderRadius: "50%",
          background:
            "radial-gradient(ellipse, rgba(var(--mui-palette-primary-mainChannel) / 0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: { xs: 2, sm: 3 },
          position: "relative",
        }}
      >
        <DesignCard variant="bad" isActive={isActive} />
        <Typography
          variant="body2"
          fontFamily="var(--font-geist-mono), monospace"
          fontWeight={700}
          color="text.secondary"
          sx={{ opacity: 0.5 }}
        >
          vs
        </Typography>
        <DesignCard variant="good" isActive={isActive} />
      </Box>
    </Box>
  );
}
