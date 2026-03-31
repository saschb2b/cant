import type { Meta, StoryObj } from "@storybook/react-vite";
import { Monitor } from "lucide-react";
import type { SearchItem } from "../search-palette";
import { SearchPalette } from "../search-palette";

const mockItems: SearchItem[] = [
  {
    type: "page",
    title: "Play",
    description: "Test your skills with a timed quiz",
    href: "/play",
    icon: "viewer",
  },
  {
    type: "page",
    title: "Learn",
    description: "Browse the full pattern reference library",
    href: "/learn",
    icon: "learn",
  },
  {
    type: "category",
    title: "Media Queries",
    description: "Responsive breakpoints and @media rules",
    href: "/learn/media-queries",
    keywords: ["breakpoint", "@media", "responsive"],
  },
  {
    type: "category",
    title: "Container Queries",
    description: "Component-scoped responsive design",
    href: "/learn/container-queries",
    keywords: ["@container", "inline-size"],
  },
  {
    type: "category",
    title: "Flexbox Patterns",
    description: "Common flexbox layouts and utilities",
    href: "/learn/flexbox-patterns",
  },
  {
    type: "challenge",
    title: "Use clamp() for fluid sizing",
    description: "Avoid fixed breakpoints for typography",
    href: "/learn/fluid-typography#use-clamp",
    difficulty: "easy",
    subtitle: "fluid-typography",
  },
  {
    type: "challenge",
    title: "Prefer min() over media queries",
    description: "Simpler responsive widths without breakpoints",
    href: "/learn/fluid-typography#prefer-min",
    difficulty: "medium",
    subtitle: "fluid-typography",
  },
  {
    type: "challenge",
    title: "Avoid vh for mobile layouts",
    description: "Use dvh or svh to handle mobile browser chrome",
    href: "/learn/viewport-units#avoid-vh",
    difficulty: "hard",
    subtitle: "viewport-units",
  },
];

const mockSections = [
  {
    label: "Fundamentals",
    categories: ["media-queries", "container-queries"],
  },
  {
    label: "Layout",
    categories: ["flexbox-patterns"],
  },
];

const config = {
  placeholder: "Search pages, categories, patterns...",
  noResultsHint:
    'Try a CSS property, category, or pattern like "clamp" or "container query"',
  challengeGroupLabel: "Patterns",
  pageIcons: { viewer: Monitor },
};

const meta: Meta<typeof SearchPalette> = {
  title: "Layout/Search Palette",
  component: SearchPalette,
  tags: ["autodocs"],
  args: {
    open: true,
    onClose: () => undefined,
    items: mockItems,
    sections: mockSections,
    config,
  },
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Full-screen search dialog triggered by Ctrl+K or the search button in the site header. Supports fuzzy search across pages, categories, and challenges using Fuse.js, with keyboard navigation and match highlighting. When idle it shows a browsable directory grouped by section. Used by every app via the SiteHeader `renderSearchPalette` slot.",
      },
    },
  },
  argTypes: {
    open: {
      description: "Whether the dialog is visible.",
      control: "boolean",
    },
    onClose: {
      description: "Callback invoked when the dialog should close.",
      control: false,
    },
    items: {
      description:
        "Flat array of searchable items (pages, categories, challenges) fed into Fuse.js.",
      control: "object",
    },
    sections: {
      description:
        "Category sections used to render the browse view when the search query is empty.",
      control: "object",
    },
    config: {
      description:
        "App-specific configuration: placeholder text, no-results hint, challenge group label, and optional extra page icons.",
      control: "object",
    },
  },
};

export default meta;
type Story = StoryObj<typeof SearchPalette>;

/** Default browse view showing pages and categories grouped by section. */
export const Browse: Story = {
  args: {
    open: true,
  },
};

/** Search results after typing "clamp", showing fuzzy match highlighting. */
export const WithQuery: Story = {
  args: {
    open: true,
  },
  play: ({ canvasElement }) => {
    // Type into the search input after render
    const input = canvasElement
      .closest("body")
      ?.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
    if (input) {
      // Use the native setter to programmatically set the input value
      // so React's synthetic event system picks up the change.
      Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set?.call(input, "clamp");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

/** Empty state shown when no items match the query. */
export const NoResults: Story = {
  args: {
    open: true,
    items: [],
    sections: [],
  },
};
