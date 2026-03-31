import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

function ThemeShowcase() {
  return (
    <Stack spacing={3}>
      <Typography variant="h5">Theme Preview</Typography>
      <Stack direction="row" spacing={2}>
        <Button variant="contained">Primary</Button>
        <Button variant="contained" color="secondary">
          Secondary
        </Button>
        <Button variant="contained" color="success">
          Success
        </Button>
        <Button variant="contained" color="error">
          Error
        </Button>
        <Button variant="contained" color="warning">
          Warning
        </Button>
      </Stack>
      <Stack direction="row" spacing={1}>
        <Chip label="Easy" color="success" size="small" />
        <Chip label="Medium" color="warning" size="small" />
        <Chip label="Hard" color="error" size="small" />
      </Stack>
      <Paper elevation={0} sx={{ p: 2, border: 1, borderColor: "divider" }}>
        <Typography variant="body2" color="text.secondary">
          This is a Paper component with divider border.
        </Typography>
      </Paper>
      <Box sx={{ display: "flex", gap: 1 }}>
        {["background.default", "background.paper", "divider"].map((color) => (
          <Box
            key={color}
            sx={{
              width: 60,
              height: 60,
              bgcolor: color,
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="caption" sx={{ fontSize: "0.55rem" }}>
              {color.split(".")[1]}
            </Typography>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}

const meta: Meta = {
  title: "Foundation/Theme",
  component: ThemeShowcase,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Previews the active MUI theme by rendering buttons, chips, paper, and color swatches. Used to verify that light and dark mode tokens, palette colors, and surface colors render correctly across all apps.",
      },
    },
  },
};

export default meta;
type Story = StoryObj;

/** Default showcase displaying buttons, difficulty chips, a paper surface, and background color swatches. */
export const Default: Story = {};
