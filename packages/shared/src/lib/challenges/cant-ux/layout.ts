import type { BaseChallenge } from "../../game/types";

export const layoutChallenges: BaseChallenge[] = [
  {
    id: "lay-001",
    category: "layout",
    difficulty: "easy",
    title: "Content width",
    prompt: "Which content width is more readable?",
    content: {
      type: "visual",
      left: { componentId: "LayoutFullWidth" },
      right: { componentId: "LayoutConstrained" },
    },
    correctSide: "right",
    explanationCorrect:
      "Constraining content to a maximum width (typically 65 to 80 characters for text) keeps lines readable and prevents the layout from stretching uncomfortably on wide screens. A centered, constrained container feels focused and intentional.",
    explanationWrong:
      "Full-width content on a large monitor creates extremely long lines of text that are difficult to read. The user's eye has to travel too far from the end of one line to the start of the next, which leads to slower reading and more frequent line-tracking errors.",
    sourceUrl: "https://practicaltypography.com/line-length.html",
    sourceLabel: "Practical Typography: Line length",
  },
  {
    id: "lay-002",
    category: "layout",
    difficulty: "easy",
    title: "Form layout",
    prompt: "Which form layout is faster to complete?",
    content: {
      type: "visual",
      left: { componentId: "FormSideBySide" },
      right: { componentId: "FormStacked" },
    },
    correctSide: "right",
    explanationCorrect:
      "Stacked (single-column) form layouts are easier to scan because the user moves in one direction, top to bottom. Each field gets the full width, and the eye path is simple and predictable. Research consistently shows single-column forms are completed faster.",
    explanationWrong:
      "Side-by-side form fields break the user's vertical scanning pattern and force them to read in a zigzag. Users often miss fields in multi-column layouts, especially on smaller screens where the columns may collapse unpredictably.",
    sourceUrl: "https://www.nngroup.com/articles/web-form-design/",
    sourceLabel: "Nielsen Norman Group: Web form design guidelines",
  },
  {
    id: "lay-003",
    category: "layout",
    difficulty: "medium",
    title: "Card consistency",
    prompt: "Which card grid looks more polished?",
    content: {
      type: "visual",
      left: { componentId: "CardLayoutUneven" },
      right: { componentId: "CardLayoutConsistent" },
    },
    correctSide: "right",
    explanationCorrect:
      "Consistent card heights and internal layouts create a clean, predictable grid. When all cards follow the same structure (image, title, description, action), users can compare items quickly because they know exactly where to look for each piece of information.",
    explanationWrong:
      "Uneven card sizes and inconsistent internal layouts make a grid look chaotic. Users cannot compare items at a glance because information appears in different positions across cards. The visual noise makes the entire section feel disorganized and harder to use.",
    sourceUrl: "https://www.nngroup.com/articles/cards-component/",
    sourceLabel: "Nielsen Norman Group: Cards component in UX",
  },
  {
    id: "lay-004",
    category: "layout",
    difficulty: "medium",
    title: "Text alignment",
    prompt: "Which text alignment is easier to read?",
    content: {
      type: "visual",
      left: { componentId: "ContentCenterAligned" },
      right: { componentId: "ContentLeftAligned" },
    },
    correctSide: "right",
    explanationCorrect:
      "Left-aligned text (in left-to-right languages) creates a strong, consistent starting edge that the eye can anchor to. Each new line begins at the same position, making it easy to find the next line. This is especially important for longer blocks of text.",
    explanationWrong:
      "Center-aligned text creates a ragged left edge that forces the reader to search for the start of each new line. For short headings, centering works fine, but for paragraphs, lists, or descriptions longer than two lines, it significantly slows down reading.",
    sourceUrl: "https://practicaltypography.com/centered-text.html",
    sourceLabel: "Practical Typography: Centered text",
  },
];
