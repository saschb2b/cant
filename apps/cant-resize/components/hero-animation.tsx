"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function PageContent({ width }: { width: number }) {
  const isNarrow = width < 80;
  return (
    <Box
      sx={{
        p: isNarrow ? 0.5 : 0.75,
        display: "flex",
        flexDirection: "column",
        gap: 0.5,
      }}
    >
      <Box
        sx={{
          height: isNarrow ? 6 : 8,
          borderRadius: 0.5,
          bgcolor: "primary.main",
          opacity: 0.3,
        }}
      />
      <Box
        sx={{
          height: isNarrow ? 22 : 30,
          borderRadius: 1,
          bgcolor: "primary.main",
          opacity: 0.15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "45%",
            height: isNarrow ? 3 : 4,
            borderRadius: 0.5,
            bgcolor: "text.primary",
            opacity: 0.35,
          }}
        />
      </Box>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        {isNarrow ? (
          <Box
            sx={{
              flex: 1,
              height: 18,
              borderRadius: 0.5,
              bgcolor: "primary.main",
              opacity: 0.1,
            }}
          />
        ) : (
          <>
            <Box
              sx={{
                flex: 1,
                height: 22,
                borderRadius: 0.5,
                bgcolor: "primary.main",
                opacity: 0.1,
              }}
            />
            <Box
              sx={{
                flex: 1,
                height: 22,
                borderRadius: 0.5,
                bgcolor: "primary.main",
                opacity: 0.1,
              }}
            />
            {width > 100 && (
              <Box
                sx={{
                  flex: 1,
                  height: 22,
                  borderRadius: 0.5,
                  bgcolor: "primary.main",
                  opacity: 0.1,
                }}
              />
            )}
          </>
        )}
      </Box>
      <Box
        sx={{
          height: isNarrow ? 16 : 20,
          borderRadius: 0.5,
          bgcolor: "success.main",
          opacity: 0.12,
        }}
      />
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <Box
          sx={{
            flex: 2,
            height: isNarrow ? 14 : 18,
            borderRadius: 0.5,
            bgcolor: "warning.main",
            opacity: 0.12,
          }}
        />
        {!isNarrow && (
          <Box
            sx={{
              flex: 1,
              height: 18,
              borderRadius: 0.5,
              bgcolor: "warning.main",
              opacity: 0.12,
            }}
          />
        )}
      </Box>
      <Box
        sx={{
          height: isNarrow ? 12 : 16,
          borderRadius: 0.5,
          bgcolor: "primary.main",
          opacity: 0.08,
        }}
      />
      <Box
        sx={{
          height: isNarrow ? 20 : 26,
          borderRadius: 0.5,
          bgcolor: "error.main",
          opacity: 0.1,
        }}
      />
      <Box
        sx={{
          height: isNarrow ? 8 : 10,
          borderRadius: 0.5,
          bgcolor: "text.primary",
          opacity: 0.06,
        }}
      />
    </Box>
  );
}

interface DeviceFrameProps {
  width: number;
  height: number;
  label: string;
  scrollY: number;
}

function DeviceFrame({ width, height, label, scrollY }: DeviceFrameProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box
        sx={{
          width,
          height,
          borderRadius: 1,
          overflow: "hidden",
          bgcolor: "background.paper",
          position: "relative",
          boxShadow: "0 4px 24px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {/* Browser chrome */}
        <Box
          sx={{
            height: 10,
            bgcolor: "action.hover",
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            px: 0.5,
            gap: 0.25,
            flexShrink: 0,
          }}
        >
          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              bgcolor: "error.main",
              opacity: 0.6,
            }}
          />
          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              bgcolor: "warning.main",
              opacity: 0.6,
            }}
          />
          <Box
            sx={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              bgcolor: "success.main",
              opacity: 0.6,
            }}
          />
        </Box>
        {/* Scrollable content */}
        <Box
          sx={{
            position: "relative",
            height: height - 10,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              transition: "transform 1.2s cubic-bezier(0.33, 1, 0.68, 1)",
            }}
            style={{ transform: `translateY(${String(-scrollY)}px)` }}
          >
            <PageContent width={width} />
          </Box>
        </Box>
      </Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontFamily="var(--font-geist-mono), monospace"
        sx={{ fontSize: "0.6rem", opacity: 0.7 }}
      >
        {label}
      </Typography>
    </Box>
  );
}

export function HeroAnimation() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const durations = [2500, 2500, 1200, 2500, 1200];
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

  const scrollY = phase === 1 || phase === 2 ? 65 : 0;

  return (
    <Box
      sx={{
        position: "relative",
        py: { xs: 4, md: 5 },
        px: { xs: 2, md: 3 },
      }}
    >
      {/* Glow behind devices */}
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
          alignItems: "flex-end",
          justifyContent: "center",
          gap: { xs: 2, sm: 3 },
          position: "relative",
        }}
      >
        <DeviceFrame
          width={60}
          height={108}
          label="iPhone 15"
          scrollY={scrollY}
        />
        <DeviceFrame
          width={96}
          height={130}
          label="iPad Air"
          scrollY={scrollY}
        />
        <DeviceFrame
          width={160}
          height={102}
          label="Desktop 1080p"
          scrollY={scrollY}
        />
      </Box>
    </Box>
  );
}
