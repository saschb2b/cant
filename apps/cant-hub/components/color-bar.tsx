import Box from "@mui/material/Box";

interface ColorBarProps {
  colors: string[];
  size?: "small" | "default";
  animated?: boolean;
}

export function ColorBar({
  colors,
  size = "default",
  animated = false,
}: ColorBarProps) {
  const isSmall = size === "small";
  return (
    <>
      {animated && (
        <style>{`
          @keyframes colorbar-in {
            from { opacity: 0; transform: scaleX(0); }
            to { opacity: 1; transform: scaleX(1); }
          }
          @keyframes colorbar-glow {
            0%, 100% { filter: brightness(1); }
            50% { filter: brightness(1.5); }
          }
        `}</style>
      )}
      <Box
        sx={{
          display: "flex",
          gap: isSmall ? 0.375 : 0.75,
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {colors.map((color, i) => (
          <Box
            key={color}
            sx={{
              width: isSmall ? 12 : { xs: 28, sm: 40 },
              height: isSmall ? 3 : 4,
              borderRadius: 2,
              bgcolor: color,
              ...(animated && {
                opacity: 0,
                transform: "scaleX(0)",
                animation: `colorbar-in 0.5s ease-out ${String(i * 0.08)}s forwards, colorbar-glow 3s ease-in-out ${String(2.5 + i * 0.3)}s infinite`,
              }),
            }}
          />
        ))}
      </Box>
    </>
  );
}
