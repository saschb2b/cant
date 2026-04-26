import type { BaseChallenge } from "../../game/types";

export const listsCardsChallenges: BaseChallenge[] = [
  {
    id: "card-001",
    category: "lists-cards",
    difficulty: "easy",
    title: "Card height consistency",
    prompt: "Which card grid looks more professional?",
    content: {
      type: "visual",
      left: { componentId: "CardUnevenHeights" },
      right: { componentId: "CardUniformHeights" },
    },
    correctSide: "right",
    explanationCorrect:
      "Uniform card heights create a clean, scannable grid. When cards share the same dimensions, users can compare them side by side without visual noise. Clamping long descriptions and reserving a consistent layout for each card prevents one item from dominating the grid.",
    explanationWrong:
      "Cards with wildly different heights break the visual rhythm of a grid. The uneven layout makes the collection look unfinished and draws disproportionate attention to the tallest card, which may not be the most important one.",
    sourceUrl: "https://m3.material.io/components/cards/overview",
    sourceLabel: "Material Design: Cards overview",
  },
  {
    id: "card-002",
    category: "lists-cards",
    difficulty: "easy",
    title: "Clickable affordance",
    prompt: "Which cards signal that they are interactive?",
    content: {
      type: "visual",
      left: { componentId: "CardNoAffordance" },
      right: { componentId: "CardWithAffordance" },
    },
    correctSide: "right",
    explanationCorrect:
      "A hover effect (elevation change, border highlight) and a chevron icon make it immediately clear that each card is clickable. Users do not have to guess whether clicking will do something. These affordances work together to communicate interactivity before the user commits to a click.",
    explanationWrong:
      "Cards that look identical whether they are static or interactive leave users unsure about what they can click. Without hover feedback or visual cues, some users will never discover that the cards are clickable, missing the primary navigation path entirely.",
    sourceUrl: "https://www.nngroup.com/articles/clickable-elements/",
    sourceLabel: "NN/G: Making clickable elements recognizable",
  },
  {
    id: "card-003",
    category: "lists-cards",
    difficulty: "medium",
    title: "Information density",
    prompt: "Which card is easier to process?",
    content: {
      type: "visual",
      left: { componentId: "CardOverloaded" },
      right: { componentId: "CardFocused" },
    },
    correctSide: "right",
    explanationCorrect:
      "A focused card shows only the key information needed to decide whether to learn more: name, a one-line summary, price, and a clear CTA. Progressive disclosure lets interested users drill into the full feature list without burdening the card with every detail upfront.",
    explanationWrong:
      "Cramming every detail into a card overwhelms users with information they did not ask for yet. Tags, fine print, and exhaustive feature lists compete for attention and make it harder to compare this card with others. The card becomes a miniature documentation page instead of a scannable summary.",
    sourceUrl: "https://www.nngroup.com/articles/progressive-disclosure/",
    sourceLabel: "NN/G: Progressive disclosure",
  },
  {
    id: "card-004",
    category: "lists-cards",
    difficulty: "medium",
    title: "List grouping",
    prompt: "Which list is easier to browse?",
    content: {
      type: "visual",
      left: { componentId: "ListFlat" },
      right: { componentId: "ListGrouped" },
    },
    correctSide: "right",
    explanationCorrect:
      "Grouping items into labeled sections creates a visual hierarchy that helps users skip to the section they need. Section headers act as landmarks, reducing the cognitive load of scanning a long list. The contained groups also make the list feel shorter and more manageable.",
    explanationWrong:
      "A flat list of many items forces users to read every entry to find what they need. Without grouping, related items are not visually associated, and the list feels longer than it is. Users cannot predict where a specific setting might be without scanning the entire list.",
    sourceUrl: "https://www.nngroup.com/articles/chunking/",
    sourceLabel: "NN/G: Chunking for comprehension",
  },
];
