"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

interface PreviewCardProps {
  platform: string;
  color: string;
  width: number;
  height: number;
  opacity: number;
  delay: number;
}

function PreviewCard({
  platform,
  color,
  width,
  height,
  opacity,
  delay,
}: PreviewCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 0.75,
        transition: "all 0.8s cubic-bezier(0.33, 1, 0.68, 1)",
        transitionDelay: `${String(delay)}ms`,
        opacity,
        transform: opacity > 0 ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <Box
        sx={{
          width,
          height,
          borderRadius: 1.5,
          overflow: "hidden",
          bgcolor: "background.paper",
          position: "relative",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
          border: 1,
          borderColor: "divider",
        }}
      >
        {/* Image placeholder */}
        <Box
          sx={{
            height: "55%",
            bgcolor: color,
            opacity: 0.15,
          }}
        />
        {/* Text placeholders */}
        <Box
          sx={{ p: 0.75, display: "flex", flexDirection: "column", gap: 0.4 }}
        >
          <Box
            sx={{
              height: 5,
              width: "75%",
              borderRadius: 0.5,
              bgcolor: "text.primary",
              opacity: 0.25,
            }}
          />
          <Box
            sx={{
              height: 4,
              width: "90%",
              borderRadius: 0.5,
              bgcolor: "text.primary",
              opacity: 0.12,
            }}
          />
          <Box
            sx={{
              height: 3,
              width: "45%",
              borderRadius: 0.5,
              bgcolor: color,
              opacity: 0.3,
            }}
          />
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{ fontSize: "0.55rem", opacity: 0.7 }}
      >
        {platform}
      </Typography>
    </Box>
  );
}

export function HeroAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const durations = [2000, 1500, 1500, 1500, 2000];
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

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 3, md: 4 },
        px: { xs: 1, md: 2 },
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

      {/* URL bar mockup */}
      <Box
        sx={{
          mx: "auto",
          mb: 3,
          maxWidth: 320,
          height: 32,
          borderRadius: 2,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          px: 1.5,
          gap: 1,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            border: 1.5,
            borderColor: "primary.main",
            opacity: 0.5,
          }}
        />
        <Box
          sx={{
            flex: 1,
            height: 4,
            borderRadius: 0.5,
            bgcolor: "text.primary",
            opacity: 0.15,
          }}
        />
        <Box
          sx={{
            width: 24,
            height: 20,
            borderRadius: 1,
            bgcolor: "primary.main",
            opacity: phase > 0 ? 0.8 : 0.3,
            transition: "opacity 0.5s ease",
          }}
        />
      </Box>

      {/* Preview cards */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          gap: { xs: 1.5, sm: 2 },
          position: "relative",
          flexWrap: "wrap",
        }}
      >
        <PreviewCard
          platform="Google"
          color="#4285F4"
          width={100}
          height={64}
          opacity={phase >= 1 ? 1 : 0}
          delay={0}
        />
        <PreviewCard
          platform="LinkedIn"
          color="#0A66C2"
          width={120}
          height={86}
          opacity={phase >= 2 ? 1 : 0}
          delay={100}
        />
        <PreviewCard
          platform="Twitter"
          color="#1DA1F2"
          width={130}
          height={80}
          opacity={phase >= 3 ? 1 : 0}
          delay={200}
        />
        <PreviewCard
          platform="Slack"
          color="#4A154B"
          width={110}
          height={68}
          opacity={phase >= 4 ? 1 : 0}
          delay={300}
        />
      </Box>
    </Box>
  );
}
