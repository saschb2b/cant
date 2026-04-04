import type { BaseChallenge } from "../../game/types";

export const dataDisplayChallenges: BaseChallenge[] = [
  {
    id: "data-001",
    category: "data-display",
    difficulty: "easy",
    title: "Number alignment",
    prompt: "Which table is easier to scan?",
    content: {
      type: "visual",
      left: { componentId: "DataLeftAlignedNumbers" },
      right: { componentId: "DataRightAlignedNumbers" },
    },
    correctSide: "right",
    explanationCorrect:
      "Right-aligning numbers lets users compare values by scanning the decimal and digit positions vertically. Combined with tabular number spacing and subtle row striping, this creates a clear visual rhythm that makes it easy to spot the largest or smallest values at a glance.",
    explanationWrong:
      "Left-aligned numbers scatter the digits unevenly, making it hard to compare magnitudes at a glance. The dollar signs and commas do not line up, so users must mentally parse each number individually. Without row striping, it is also easy to accidentally read values from the wrong row.",
    sourceUrl: "https://www.nngroup.com/articles/table-design-patterns/",
    sourceLabel: "NN/G: Table design patterns",
  },
  {
    id: "data-002",
    category: "data-display",
    difficulty: "easy",
    title: "Text overflow",
    prompt: "Which table handles long content better?",
    content: {
      type: "visual",
      left: { componentId: "DataTextCutOff" },
      right: { componentId: "DataEllipsisWithTooltip" },
    },
    correctSide: "right",
    explanationCorrect:
      "An ellipsis signals that text was truncated, and a tooltip on hover reveals the full content. Users can still scan the table efficiently because row heights stay consistent, and they can always access the complete text when needed without navigating away.",
    explanationWrong:
      "Abruptly clipping text with no indicator leaves users unsure if they are seeing the full content or just the beginning. The uneven clipping also breaks the visual grid of the table, making rows feel misaligned and harder to scan.",
    sourceUrl: "https://www.nngroup.com/articles/truncation-in-data-tables/",
    sourceLabel: "NN/G: Truncation in data tables",
  },
  {
    id: "data-003",
    category: "data-display",
    difficulty: "medium",
    title: "Data density",
    prompt: "Which data view is more usable?",
    content: {
      type: "visual",
      left: { componentId: "DataDenseTable" },
      right: { componentId: "DataPrioritizedTable" },
    },
    correctSide: "right",
    explanationCorrect:
      "Showing fewer columns with the most important information first keeps the table scannable without horizontal scrolling. Status badges add visual weight to key data, and a link to full details lets users drill deeper when needed. Less is more when data density competes with readability.",
    explanationWrong:
      "Cramming every available field into a single table row creates a wall of tiny text that requires horizontal scrolling to read. Users cannot see all columns at once, which defeats the purpose of a table. Important information like status or total gets buried among less critical fields.",
    sourceUrl:
      "https://www.darkhorseanalytics.com/blog/data-looks-better-naked",
    sourceLabel: "Dark Horse Analytics: Data looks better naked",
  },
  {
    id: "data-004",
    category: "data-display",
    difficulty: "medium",
    title: "Empty data states",
    prompt: "Which empty state helps users more?",
    content: {
      type: "visual",
      left: { componentId: "DataEmptyBare" },
      right: { componentId: "DataEmptyHelpful" },
    },
    correctSide: "right",
    explanationCorrect:
      "A helpful empty state explains why there is no data, sets expectations for when data will appear, and provides a relevant action. This turns a dead end into a guided next step, keeping users engaged instead of confused.",
    explanationWrong:
      "A bare 'No data' message provides no context and no path forward. Users do not know if they need to take action, wait for data, or if something is broken. Empty table headers above a blank row make the emptiness feel like an error rather than a normal state.",
    sourceUrl: "https://www.nngroup.com/articles/empty-state-interface-design/",
    sourceLabel: "NN/G: Empty state design",
  },
];
