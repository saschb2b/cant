import Box from "@mui/material/Box";

interface ColorBarProps {
  colors: string[];
  size?: "small" | "default";
}

export function ColorBar({ colors, size = "default" }: ColorBarProps) {
  const isSmall = size === "small";
  return (
    <Box
      sx={{
        display: "flex",
        gap: isSmall ? 0.375 : 0.75,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {colors.map((color) => (
        <Box
          key={color}
          sx={{
            width: isSmall ? 12 : { xs: 28, sm: 40 },
            height: isSmall ? 3 : 4,
            borderRadius: 2,
            bgcolor: color,
          }}
        />
      ))}
    </Box>
  );
}
