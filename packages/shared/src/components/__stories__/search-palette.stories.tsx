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
    onClose: () => {},
    items: mockItems,
    sections: mockSections,
    config,
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SearchPalette>;

export const Browse: Story = {
  args: {
    open: true,
  },
};

export const WithQuery: Story = {
  args: {
    open: true,
  },
  play: async ({ canvasElement }) => {
    // Type into the search input after render
    const input = canvasElement
      .closest("body")
      ?.querySelector<HTMLInputElement>('input[placeholder*="Search"]');
    if (input) {
      const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      nativeInputValueSetter?.call(input, "clamp");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }
  },
};

export const NoResults: Story = {
  args: {
    open: true,
    items: [],
    sections: [],
  },
};
