import type { Meta, StoryObj } from "@storybook/react-vite";
import { ActivityGraph } from "../activity-graph";

function generateMockData(weeks: number) {
  const grid: { date: Date; dateKey: string; count: number }[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = today.getDay();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + (6 - dayOfWeek));
  const totalDays = weeks * 7;
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - totalDays + 1);
  const cursor = new Date(startDate);
  for (let i = 0; i < totalDays; i++) {
    const key = `${String(cursor.getFullYear())}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(cursor.getDate()).padStart(2, "0")}`;
    grid.push({
      date: new Date(cursor),
      dateKey: key,
      count: Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0,
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return grid;
}

const meta: Meta<typeof ActivityGraph> = {
  title: "Game/Activity Graph",
  component: ActivityGraph,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 700, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ActivityGraph>;

export const WithActivity: Story = {
  args: {
    getActivityGrid: (weeks = 20) => generateMockData(weeks),
  },
};

export const NoActivity: Story = {
  args: {
    getActivityGrid: (weeks = 20) => {
      const grid = generateMockData(weeks);
      return grid.map((d) => ({ ...d, count: 0 }));
    },
  },
};

export const CustomColors: Story = {
  args: {
    getActivityGrid: (weeks = 20) => generateMockData(weeks),
    lightColors: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
    darkColors: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
  },
};
