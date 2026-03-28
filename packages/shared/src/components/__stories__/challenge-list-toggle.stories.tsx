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

export const Default: Story = {
  args: {
    children: <MockChallengeList />,
  },
};
