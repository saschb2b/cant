"use client";

import Box from "@mui/material/Box";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  left: `${String(Math.round((i * 37 + 13) % 100))}%`,
  top: `${String(Math.round((i * 53 + 7) % 100))}%`,
  delay: `${((i * 1.3) % 5).toFixed(1)}s`,
  duration: `${(3 + ((i * 0.7) % 3)).toFixed(1)}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

export function SparkleField() {
  return (
    <Box
      aria-hidden
      sx={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        "@keyframes sparkleFloat": {
          "0%, 100%": { opacity: 0, transform: "scale(0) translateY(0)" },
          "50%": { opacity: 1, transform: "scale(1) translateY(-10px)" },
        },
      }}
    >
      {PARTICLES.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: "absolute",
            left: p.left,
            top: p.top,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            bgcolor: "primary.main",
            opacity: 0,
            animation: `sparkleFloat ${p.duration} ${p.delay} ease-in-out infinite`,
          }}
        />
      ))}
    </Box>
  );
}
