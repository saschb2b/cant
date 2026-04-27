import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketCard } from "../ticket-card";

const meta: Meta<typeof TicketCard> = {
  title: "Content/Ticket Card",
  component: TicketCard,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "Renders an agile work item (Epic, Story, Task, Subtask, Bug, Spike) as a structured card. Used by cant-ticket challenges to compare two tickets side by side. Type-aware accent color, status pill, points chip, Connextra clauses, Given/When/Then acceptance criteria, subtasks, and child trees are all rendered in dedicated sections so a missing or violated section is visually obvious.",
      },
    },
  },
  argTypes: {
    data: {
      description:
        "Structured ticket data. The component is purely presentational; what is rendered is what is in the data.",
      control: { type: "object" },
    },
  },
};

export default meta;
type Story = StoryObj<typeof TicketCard>;

/** A clean Story with Connextra clauses, Given/When/Then ACs, and subtasks. */
export const CleanStory: Story = {
  args: {
    data: {
      key: "AUTH-482",
      type: "story",
      status: "ready",
      points: 3,
      title: "Users stay signed in across tab reloads",
      labels: ["auth", "session", "reliability"],
      asA: "signed-in user",
      iWant: "my session to survive reloading or opening new tabs",
      soThat: "I am not forced to sign in again during normal multi-tab use",
      context:
        "The session token is currently regenerated on every page load, which drops sessions under common multi-tab patterns. Support has flagged this as the top complaint this month.",
      acceptanceCriteria: [
        {
          kind: "gwt",
          given: "a signed-in user",
          when: "they reload the page",
          then: "they remain signed in",
        },
        {
          kind: "gwt",
          given: "a signed-in user",
          when: "they open the app in a new tab",
          then: "they are signed in in that tab",
        },
        {
          kind: "gwt",
          given: "a user whose session has actually expired",
          when: "they reload",
          then: "they see the sign-in screen (no silent failures)",
        },
      ],
      subtasks: [
        "Adopt new cookie helper from DEV-1234",
        "Remove the legacy parseToken path",
        "Add integration tests for reload and new-tab flows",
      ],
      outOfScope:
        '"Remember me" persistence across browser restarts (separate story).',
    },
  },
};

/** A Task: framework upgrade with no user-facing benefit. Different accent color. */
export const Task: Story = {
  args: {
    data: {
      key: "PLAT-44",
      type: "task",
      status: "in-progress",
      points: 5,
      title: "Upgrade Next.js from 15 to 16",
      subtasks: [
        "Update package.json to next@16",
        "Run codemod for the new caching defaults",
        "Fix any breaking changes in route handlers",
        "Confirm CI is green",
      ],
    },
  },
};

/** An Epic with a child tree of stories. Demonstrates the children section. */
export const EpicWithChildren: Story = {
  args: {
    data: {
      key: "PAY-100",
      type: "epic",
      status: "in-progress",
      title: "Customers can pay with SEPA direct debit",
      context:
        "EU subscribers currently pay only by card. SEPA reduces churn for the European market.",
      children: [
        { type: "story", title: "Customer enters bank details on checkout" },
        { type: "story", title: "Customer signs the mandate inline" },
        { type: "story", title: "Customer sees direct debit on receipts" },
        {
          type: "story",
          title: "Failed debits notify the customer and pause the subscription",
        },
        { type: "task", title: "Backfill existing customers" },
      ],
    },
  },
};

/** An Epic with all-Task children, the anti-pattern from the blog. */
export const EpicTaskOnly: Story = {
  args: {
    data: {
      key: "SEARCH-44",
      type: "epic",
      title: "Search v2",
      children: [
        { type: "task", title: "Replace Postgres FTS with OpenSearch" },
        { type: "task", title: "Reindex articles nightly" },
        { type: "task", title: "Add /api/search/v2 endpoint" },
        { type: "task", title: "Migrate /search page to call v2" },
      ],
    },
  },
};

/** Acceptance criteria with implementation notes leaked in (violation surfaced visually). */
export const ACWithImplementationLeak: Story = {
  args: {
    data: {
      key: "AUTH-482",
      type: "story",
      points: 3,
      title: "Users stay signed in across tab reloads",
      acceptanceCriteria: [
        { kind: "bullet", text: "Sessions survive reload" },
        {
          kind: "implementation-note",
          text: "Refactor getSession() to use the new cookie helper",
        },
        {
          kind: "implementation-note",
          text: "Delete the old legacyAuth module",
        },
      ],
    },
  },
};

/** A Bug ticket. */
export const Bug: Story = {
  args: {
    data: {
      key: "RPT-91",
      type: "bug",
      status: "review",
      points: 2,
      title: "CSV export drops trailing comma in numeric columns",
      context:
        "Affects export from /reports for any report with at least one numeric column. Discovered by Acme on 2026-04-22.",
      acceptanceCriteria: [
        {
          kind: "bullet",
          text: "Reproduce the bug on the staging dataset",
        },
        {
          kind: "bullet",
          text: "Numeric columns export with their full value",
        },
        {
          kind: "bullet",
          text: "Existing tests for CSV export still pass",
        },
      ],
    },
  },
};

/** A Spike: timeboxed research. Question-shaped acceptance criteria. */
export const Spike: Story = {
  args: {
    data: {
      key: "PAY-077",
      type: "spike",
      points: 3,
      title: "Investigate which payment providers fit our SEPA constraints",
      context:
        "Time-boxed to one sprint. The work of integrating becomes its own Story after this spike lands.",
      acceptanceCriteria: [
        {
          kind: "bullet",
          text: "Three candidate providers compared on cost, latency, and EU coverage",
        },
        {
          kind: "bullet",
          text: "A recommendation written up in the team space",
        },
        {
          kind: "bullet",
          text: "Open questions for the next refinement listed",
        },
      ],
      footer: "Timebox: 5 days. Outcome: a written recommendation, not code.",
    },
  },
};

/** A Subtask: implementation detail inside a Story. */
export const Subtask: Story = {
  args: {
    data: {
      key: "AUTH-483",
      type: "subtask",
      status: "done",
      title: "Adopt the new cookie helper from DEV-1234",
    },
  },
};
