import type { Meta, StoryObj } from "@storybook/react-vite";
import { LiveRibbon } from "../live-ribbon";
import type { RecentResult } from "../../../lib/game/recent-results-store";

const now = Date.now();

const MOCK_RESULTS: RecentResult[] = [
  {
    id: "r1",
    sessionId: "s1",
    playerName: "Alice",
    score: 9,
    total: 10,
    bestStreak: 7,
    durationSec: 120,
    rank: "Master",
    timestamp: now - 30_000,
  },
  {
    id: "r2",
    sessionId: "s2",
    playerName: "Bob",
    score: 7,
    total: 10,
    bestStreak: 3,
    durationSec: 180,
    rank: "Expert",
    timestamp: now - 120_000,
  },
  {
    id: "r3",
    sessionId: "s3",
    playerName: "Carol",
    score: 10,
    total: 10,
    bestStreak: 10,
    durationSec: 90,
    rank: "Master",
    timestamp: now - 300_000,
  },
  {
    id: "r4",
    sessionId: "s4",
    playerName: "Dave",
    score: 4,
    total: 10,
    bestStreak: 1,
    durationSec: 240,
    rank: "Novice",
    timestamp: now - 600_000,
  },
  {
    id: "r5",
    sessionId: "s5",
    playerName: "Eve",
    score: 6,
    total: 10,
    bestStreak: 2,
    durationSec: 200,
    rank: "Getting There",
    timestamp: now - 3_600_000,
  },
];

const meta: Meta<typeof LiveRibbon> = {
  title: "Game/Live Ribbon",
  component: LiveRibbon,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof LiveRibbon>;

export const Default: Story = {
  args: {
    fetchResults: () => Promise.resolve(MOCK_RESULTS),
  },
};

export const ManyResults: Story = {
  args: {
    fetchResults: () =>
      Promise.resolve(
        Array.from({ length: 20 }, (_, i) => ({
          id: `r${String(i)}`,
          sessionId: `s${String(i)}`,
          playerName: `Player ${String(i + 1)}`,
          score: Math.floor(Math.random() * 6) + 5,
          total: 10,
          bestStreak: Math.floor(Math.random() * 8) + 1,
          durationSec: 120,
          rank: "Expert",
          timestamp: now - i * 120_000,
        })),
      ),
  },
};

export const Empty: Story = {
  args: {
    fetchResults: () => Promise.resolve([]),
  },
};
