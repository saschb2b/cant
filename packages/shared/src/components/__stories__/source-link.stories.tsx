import type { Meta, StoryObj } from "@storybook/react-vite";
import { SourceLink } from "../source-link";

const meta: Meta<typeof SourceLink> = {
  title: "Content/Source Link",
  component: SourceLink,
  tags: ["autodocs"],
  parameters: {
    docs: {
      description: {
        component:
          "External links to the authoritative sources (React docs, MDN, TypeScript handbook, etc.) backing a challenge explanation, one link per entry. Shown below the explanation. Optionally renders a sibling 'Suggest a fix' link that opens a prefilled GitHub issue when githubUrl and challengeTitle are provided. Fires analytics events on click. Used on learn/[category] pages across all apps.",
      },
    },
  },
  argTypes: {
    sources: {
      description:
        "Authoritative references, each with a `url` and a visible `label` (typically 'Source: Title'). Rendered in order.",
      control: "object",
    },
    challengeId: {
      description: "ID of the parent challenge, sent with the analytics event.",
      control: "text",
    },
    category: {
      description:
        "Category slug of the parent challenge, sent with the analytics event.",
      control: "text",
    },
    githubUrl: {
      description:
        "When provided alongside challengeTitle, renders a 'Suggest a fix' link that opens a prefilled GitHub issue.",
      control: "text",
    },
    challengeTitle: {
      description:
        "Challenge title used in the prefilled issue body. Required for the Suggest-a-fix link to appear.",
      control: "text",
    },
    categoryLabel: {
      description:
        "Human-readable category label used in the prefilled issue body.",
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SourceLink>;

/** Link to the React documentation site. */
export const Default: Story = {
  args: {
    sources: [
      {
        url: "https://react.dev/reference/react/useMemo",
        label: "React docs: useMemo",
      },
    ],
    challengeId: "use-memo-deps",
    category: "hooks",
  },
};

/** Link to the Mozilla Developer Network (MDN). */
export const MDN: Story = {
  args: {
    sources: [
      {
        url: "https://developer.mozilla.org/en-US/docs/Web/CSS/container-queries",
        label: "MDN: Container queries",
      },
    ],
    challengeId: "container-queries-intro",
    category: "container-queries",
  },
};

/** With a sibling Suggest-a-fix link that opens a prefilled GitHub issue. */
export const WithSuggestFix: Story = {
  args: {
    sources: [
      {
        url: "https://react.dev/reference/react/useMemo",
        label: "React docs: useMemo",
      },
    ],
    challengeId: "use-memo-deps",
    category: "hooks",
    challengeTitle: "Memoizing expensive computations",
    categoryLabel: "Hooks",
    githubUrl: "https://github.com/saschb2b/cant",
  },
};

/** Two sources for one challenge render as separate links in order. */
export const MultipleSources: Story = {
  args: {
    sources: [
      {
        url: "https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children",
        label: "React Docs: Passing JSX as children",
      },
      {
        url: "https://nextjs.org/docs/app/getting-started/server-and-client-components",
        label: "Next.js Docs: Server and Client Components",
      },
    ],
    challengeId: "rp-003",
    category: "render-props",
  },
};
