import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { TicketPanel } from "../ticket-panel";
import type { TicketCardData } from "../../../lib/game/types";

const STRONG_TICKET: TicketCardData = {
  key: "AUTH-482",
  type: "story",
  status: "ready",
  points: 3,
  title: "Users stay signed in across tab reloads",
  labels: ["auth", "session"],
  asA: "signed-in user",
  iWant: "my session to survive reloading or opening new tabs",
  soThat: "I am not forced to sign in again during normal multi-tab use",
  acceptanceCriteria: [
    {
      kind: "gwt",
      given: "a signed-in user",
      when: "they reload the page",
      then: "they remain signed in",
    },
    {
      kind: "gwt",
      given: "a user whose session has expired",
      when: "they reload",
      then: "they see the sign-in screen",
    },
  ],
  subtasks: ["Adopt the new cookie helper", "Add reload and new-tab tests"],
};

const WEAK_TICKET: TicketCardData = {
  key: "AUTH-483",
  type: "story",
  status: "ready",
  points: "?",
  title: "Fix the login thing",
  description: "Make sessions work better. See the support thread.",
};

const meta: Meta<typeof TicketPanel> = {
  title: "Game/Ticket Panel",
  component: TicketPanel,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Game panel that renders a structured ticket as a selectable card. Used by cant-ticket to compare two agile work items side by side. Shares its shell (selection states, hover/focus rings, the better/worse header pill, and the Lottie checkmark on a correct pick) with CodePanel, ImagePanel, and VisualPanel. The better/worse labels and the optional checkmark animation come from the surrounding AppThemeProvider via useAppTheme(); with no provider it falls back to the default Better/Worse labels and no animation.",
      },
    },
  },
  args: {
    ticket: STRONG_TICKET,
    label: "A",
    isSelectable: true,
    onSelect: fn(),
  },
  argTypes: {
    ticket: {
      description:
        "Structured ticket data rendered inside the panel via TicketCard.",
      control: { type: "object" },
    },
    label: {
      description: 'Short label shown in the panel header (e.g. "A" or "B").',
      control: "text",
    },
    isSelectable: {
      description:
        "Whether the panel can be clicked or keyboard-activated to pick this option.",
      control: "boolean",
      table: { defaultValue: { summary: "true" } },
    },
    onSelect: {
      description: "Called when the user picks this panel as their answer.",
      control: false,
    },
    result: {
      description:
        "Answer result after a pick; drives border, header color, and (when correct + selected) the checkmark.",
      control: "select",
      options: [null, "correct", "wrong"],
    },
    isSelected: {
      description: "Whether this panel was the one the user selected.",
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 500, padding: 16 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TicketPanel>;

/** Default interactive state: selectable, no result yet. */
export const Selectable: Story = {
  args: {},
};

/** The picked panel revealed as the better option: success border and pill. */
export const Correct: Story = {
  args: {
    result: "correct",
    isSelected: true,
  },
};

/** The picked panel revealed as the worse option: error border and pill. */
export const Wrong: Story = {
  args: {
    label: "B",
    ticket: WEAK_TICKET,
    result: "wrong",
    isSelected: true,
  },
};

/** Read-only state (e.g. a results recap): no hover, focus, or click affordances. */
export const NotSelectable: Story = {
  args: {
    isSelectable: false,
  },
};
