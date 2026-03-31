import type { Meta, StoryObj } from "@storybook/react-vite";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { ChallengeListToggle } from "../challenge-list-toggle";

function MockChallengeList() {
  return (
    <Stack spacing={2}>
      {[1, 2, 3].map((i) => (
        <Stack key={i} direction="row" spacing={2}>
          <Box
            className="compact-full-width"
            sx={{
              flex: 1,
              p: 2,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2">
              Preferred approach (challenge {i})
            </Typography>
          </Box>
          <Box
            className="compact-hide"
            sx={{
              flex: 1,
              p: 2,
              border: 1,
              borderColor: "divider",
              bgcolor: "background.paper",
            }}
          >
            <Typography variant="body2">
              Approach to avoid (challenge {i})
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}

const meta: Meta<typeof ChallengeListToggle> = {
  title: "Content/Challenge List Toggle",
  component: ChallengeListToggle,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          'Toggle control that switches challenge lists between "Full" (side-by-side good/bad panels) and "Compact" (good panel only) view modes. Persists the user preference in localStorage. Used on learn/[category] pages across all apps.',
      },
    },
  },
  argTypes: {
    children: {
      description:
        "Challenge list content. Elements with class `compact-hide` are hidden in compact mode, and elements with `compact-full-width` expand to fill the row.",
      control: false,
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 800, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ChallengeListToggle>;

/** Toggle with a mock challenge list showing both full and compact behavior. */
export const Default: Story = {
  args: {
    children: <MockChallengeList />,
  },
};
