import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { LobbyScreen } from "../lobby-screen";

const now = Date.now();

function MockActivityGraph() {
  return (
    <Box
      sx={{
        p: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "center",
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Activity graph placeholder
      </Typography>
    </Box>
  );
}

const MOCK_HISTORY = [
  {
    seed: "A3X9K2",
    bestScore: 9,
    total: 10,
    bestStreak: 5,
    plays: 3,
    lastPlayedAt: now - 3_600_000,
  },
  {
    seed: "BN7FGH",
    bestScore: 7,
    total: 10,
    bestStreak: 3,
    plays: 1,
    lastPlayedAt: now - 86_400_000,
  },
  {
    seed: "QW4RTY",
    bestScore: 10,
    total: 10,
    bestStreak: 10,
    plays: 2,
    lastPlayedAt: now - 172_800_000,
  },
  {
    seed: "ZX1CVB",
    bestScore: 4,
    total: 10,
    bestStreak: 2,
    plays: 1,
    lastPlayedAt: now - 259_200_000,
  },
];

const gameUtils = {
  decodeSeed: (seed: string) => ({
    rawSeed: seed,
    excludedCategories: new Set<string>(),
  }),
  generateSeed: () => "RANDOM1",
  seedFromKey: (key: string) => key.replace(/-/g, "").slice(0, 6).toUpperCase(),
  getTodayKey: () => "2026-03-28",
  getWeekKey: () => "2026-W13",
  getHistory: () => MOCK_HISTORY,
  getEntryBySeed: (seed: string) =>
    MOCK_HISTORY.find((h) => h.seed === seed) ?? null,
  formatRelativeDate: (ts: number) => {
    const mins = Math.floor((now - ts) / 60_000);
    if (mins < 60) return `${String(mins)}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${String(hours)}h ago`;
    return `${String(Math.floor(hours / 24))}d ago`;
  },
};

const baseConfig = {
  categorySections: [
    {
      label: "Fundamentals",
      categories: ["naming", "structure", "patterns"],
    },
    {
      label: "Advanced",
      categories: ["generics", "composition", "performance"],
    },
  ],
  categoryLabels: {
    naming: "Naming",
    structure: "Structure",
    patterns: "Patterns",
    generics: "Generics",
    composition: "Composition",
    performance: "Performance",
  } as Record<string, string>,
  gameUtils,
};

const meta: Meta<typeof LobbyScreen> = {
  title: "Game/Lobby Screen",
  component: LobbyScreen,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  args: {
    onStart: fn(),
    config: baseConfig,
    slots: { activityGraph: MockActivityGraph },
  },
};

export default meta;
type Story = StoryObj<typeof LobbyScreen>;

export const Default: Story = {
  args: {},
};

export const WithDefaultSeed: Story = {
  args: {
    defaultSeed: "A3X9K2",
  },
};

export const WithExcludedCategories: Story = {
  args: {
    defaultExcluded: new Set(["generics", "performance"]),
  },
};
