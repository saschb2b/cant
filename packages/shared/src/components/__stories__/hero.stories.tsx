import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Hero } from "../hero";

function MockVisual() {
  return (
    <Box
      sx={{
        p: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Visual slot (code preview, animation, etc.)
      </Typography>
    </Box>
  );
}

const meta: Meta<typeof Hero> = {
  title: "Layout/Hero",
  component: Hero,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-width hero section used on every app landing page. Displays a two-line title (second line accented), subtitle, CTA buttons via HeroCta, a caption, and a right-side visual slot for animations or code previews. Includes a subtle radial gradient background with an optional overlay.",
      },
    },
  },
  argTypes: {
    titleLine1: {
      description:
        "First line of the hero title, rendered in default text color.",
      control: "text",
    },
    titleLine2: {
      description:
        "Second line of the hero title, rendered in the primary accent color.",
      control: "text",
    },
    subtitle: {
      description: "Descriptive text displayed below the title.",
      control: "text",
    },
    caption: {
      description:
        "Small caption text below the CTA buttons (e.g. challenge count, signup info).",
      control: "text",
    },
    gimmick: {
      description:
        "Optional gimmick tool passed through to HeroCta as an additional button.",
      control: "object",
    },
    visual: {
      description:
        "ReactNode rendered on the right side (animation, code preview, etc.).",
      control: false,
    },
    gradientOverlay: {
      description:
        "Optional ReactNode rendered inside the fixed gradient background layer.",
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof Hero>;

/** Standard hero with title, subtitle, caption, and a placeholder visual. */
export const Default: Story = {
  args: {
    titleLine1: "One component.",
    titleLine2: "Two APIs.",
    subtitle:
      "Can you tell which props your future self will thank you for? Train your eye in under 5 minutes.",
    caption: "10 challenges &middot; no signup &middot; takes 3 min",
    visual: <MockVisual />,
  },
};

/** Hero with a gimmick tool (Sandbox) adding an extra CTA button. */
export const WithGimmick: Story = {
  args: {
    ...Default.args,
    gimmick: { href: "/playground", label: "Sandbox" },
  },
};

/** Hero with a longer subtitle and gimmick to verify text wrapping at various widths. */
export const LongSubtitle: Story = {
  args: {
    ...Default.args,
    titleLine1: "Type magic,",
    titleLine2: "demystified.",
    subtitle:
      "Test your TypeScript instincts with quick-fire challenges, and study 84 patterns across 12 categories side by side.",
    caption: "free &middot; no signup &middot; takes 3 min",
    gimmick: { href: "/playground", label: "Sandbox" },
  },
};
