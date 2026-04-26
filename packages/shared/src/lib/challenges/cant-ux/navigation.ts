import type { BaseChallenge } from "../../game/types";

export const navigationChallenges: BaseChallenge[] = [
  {
    id: "nav-001",
    category: "navigation",
    difficulty: "easy",
    title: "Navigation labels",
    prompt: "Which navigation is easier to use?",
    content: {
      type: "visual",
      left: { componentId: "NavVagueLabels" },
      right: { componentId: "NavSpecificLabels" },
    },
    correctSide: "right",
    explanationCorrect:
      "Specific navigation labels like 'Pricing', 'Docs', and 'Blog' tell users exactly what they will find. Users scan navigation quickly and make split-second decisions about where to click. Clear labels reduce cognitive load and eliminate guesswork.",
    explanationWrong:
      "Vague labels like 'Solutions' and 'Resources' force users to click and explore before they can find what they need. These labels sound professional but carry almost no information. Users often give up and leave rather than guess their way through ambiguous menus.",
    sourceUrl: "https://www.nngroup.com/articles/navigation-cognitive-strain/",
    sourceLabel: "NN/G: Navigation and cognitive strain",
  },
  {
    id: "nav-002",
    category: "navigation",
    difficulty: "easy",
    title: "Breadcrumb wayfinding",
    prompt: "Which page helps users know where they are?",
    content: {
      type: "visual",
      left: { componentId: "NavNoBreadcrumbs" },
      right: { componentId: "NavBreadcrumbs" },
    },
    correctSide: "right",
    explanationCorrect:
      "Breadcrumbs show the full path from the site root to the current page, giving users a clear sense of where they are in the hierarchy. They also provide one-click access to any parent level, making it easy to navigate laterally without hitting the back button repeatedly.",
    explanationWrong:
      "A simple 'Back' link only moves one step in browser history, which may not even go to the parent page if the user arrived from a search engine. Without breadcrumbs, users on deep pages lose context about how the current content fits into the larger site structure.",
    sourceUrl: "https://www.nngroup.com/articles/breadcrumbs/",
    sourceLabel: "NN/G: Breadcrumbs for navigation",
  },
  {
    id: "nav-003",
    category: "navigation",
    difficulty: "medium",
    title: "Menu depth",
    prompt: "Which menu structure is easier to navigate?",
    content: {
      type: "visual",
      left: { componentId: "NavDeepNesting" },
      right: { componentId: "NavMegaMenu" },
    },
    correctSide: "right",
    explanationCorrect:
      "Mega-menus show all options at once in grouped columns, letting users scan everything without precise mouse movements through nested layers. Users can jump directly to any item, and the grouped layout provides its own visual hierarchy without requiring interaction to reveal content.",
    explanationWrong:
      "Deeply nested dropdown menus require precise diagonal mouse movements to keep submenus open. A single slip closes the chain, forcing users to start over. Each nesting level also hides content behind an interaction, making it impossible to compare options across categories.",
    sourceUrl: "https://www.nngroup.com/articles/mega-menus-work-well/",
    sourceLabel: "NN/G: Mega menus work well for large navigation",
  },
  {
    id: "nav-004",
    category: "navigation",
    difficulty: "medium",
    title: "Mobile navigation",
    prompt: "Which mobile navigation works better?",
    content: {
      type: "visual",
      left: { componentId: "NavMobileSqueezed" },
      right: { componentId: "NavMobileHamburger" },
    },
    correctSide: "right",
    explanationCorrect:
      "A hamburger menu with full-height items gives each link a large, comfortable tap target. Items are grouped vertically with enough spacing to avoid accidental taps. The collapsed state keeps the header clean, while the expanded state dedicates the full screen width to navigation.",
    explanationWrong:
      "Shrinking a desktop nav bar into a horizontally scrolling row hides links off-screen with no visual cue that more options exist. The small text creates tiny tap targets, and horizontal scrolling conflicts with the vertical scrolling users expect on mobile pages.",
    sourceUrl: "https://www.nngroup.com/articles/hamburger-menus/",
    sourceLabel: "NN/G: Hamburger menus and hidden navigation",
  },
];
