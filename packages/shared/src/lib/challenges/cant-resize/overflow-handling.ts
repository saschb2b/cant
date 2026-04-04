import type { BaseChallenge } from "../../game/types";

export const overflowHandlingChallenges: BaseChallenge[] = [
  {
    id: "oh-001",
    category: "overflow-handling",
    difficulty: "easy",
    title: "Text truncation in flex containers",
    prompt: "Which makes text ellipsis work in flexbox?",
    content: {
      type: "code",

      lang: "css",

      left: `.list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.list-item-label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,

      right: `.list-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.list-item-label {
  min-width: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Flex items default to `min-width: auto`, which prevents them from shrinking below their content width. Adding `min-width: 0` allows the element to shrink, letting `text-overflow: ellipsis` actually work.",
    explanationWrong:
      "Without `min-width: 0`, the label's `min-width: auto` prevents it from shrinking. The text overflows the flex container instead of truncating with an ellipsis. This is the #1 flex truncation gotcha.",
    sourceUrl: "https://css-tricks.com/flexbox-truncated-text/",
    sourceLabel: "CSS-Tricks: Flexbox truncated text",
  },
  {
    id: "oh-002",
    category: "overflow-handling",
    difficulty: "easy",
    title: "Responsive table with horizontal scroll",
    prompt: "Which table stays readable on small screens?",
    content: {
      type: "code",

      lang: "css",

      left: `/* Table overflows the page on mobile */
.data-table {
  width: 100%;
  border-collapse: collapse;
}`,

      right: `.table-wrapper {
  overflow-x: auto;

}

.data-table {
  width: 100%;
  min-width: 600px;
  border-collapse: collapse;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "Wrapping the table in a scroll container with `overflow-x: auto` lets the table maintain its readable layout while scrolling horizontally on small screens. `min-width` ensures columns don't compress to unreadable widths.",
    explanationWrong:
      "A `width: 100%` table on a 320px screen compresses columns until text wraps uncontrollably. Without a scroll wrapper, the table either overflows the page (causing a full-page horizontal scrollbar) or becomes illegible.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-x",
    sourceLabel: "MDN: overflow-x",
  },
  {
    id: "oh-003",
    category: "overflow-handling",
    difficulty: "medium",
    title: "Long words and URLs breaking layout",
    prompt: "Which prevents long URLs from overflowing?",
    content: {
      type: "code",

      lang: "css",

      left: `.comment {
  max-width: 600px;
}

/* Long URLs break out of the container */`,

      right: `.comment {
  max-width: 600px;
  overflow-wrap: break-word;
}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`overflow-wrap: break-word` breaks long unbreakable strings (URLs, long words, base64) only when they would overflow their container. Normal text wraps at natural word boundaries; the forced break is a last resort. This prevents horizontal overflow from user-generated content.",
    explanationWrong:
      "User-generated content often contains long URLs, file paths, or words without spaces. Without `overflow-wrap: break-word`, these strings overflow their container and cause a horizontal scrollbar on the entire page.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap",
    sourceLabel: "MDN: overflow-wrap",
  },
  {
    id: "oh-004",
    category: "overflow-handling",
    difficulty: "medium",
    title: "Preventing code blocks from overflowing",
    prompt: "Which code block handles long lines properly?",
    content: {
      type: "code",

      lang: "css",

      left: `pre {
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
}

/* Code blocks overflow on mobile */`,

      right: `pre {
  background: #1e1e1e;
  padding: 1rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  white-space: pre;

}`,
    },

    correctSide: "right",
    explanationCorrect:
      "`overflow-x: auto` adds a horizontal scrollbar only when the code exceeds the container width. `white-space: pre` preserves code formatting (indentation, line breaks) while allowing horizontal scroll for long lines.",
    explanationWrong:
      "Without `overflow-x: auto`, code blocks with long lines push the entire page layout wider. On mobile, this creates a full-page horizontal scrollbar, which is one of the most common responsive design bugs.",
    sourceUrl: "https://developer.mozilla.org/en-US/docs/Web/CSS/white-space",
    sourceLabel: "MDN: white-space",
  },
  {
    id: "oh-005",
    category: "overflow-handling",
    difficulty: "hard",
    title: "Nested scroll containers",
    prompt: "Which modal scroll pattern is clearer to use?",
    content: {
      type: "code",

      lang: "css",

      left: `.modal {
  max-height: 80vh;
  overflow-y: auto;
}

.modal-body {
  overflow-y: auto;
  max-height: 400px;
}

/* Two nested scrollbars confuse users */`,

      right: `.modal {
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header { flex-shrink: 0; }

.modal-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
}

.modal-footer { flex-shrink: 0; }`,
    },

    correctSide: "right",
    explanationCorrect:
      "A flex column layout with `min-height: 0` on the body lets the body scroll while header and footer stay fixed. Only one scrollbar exists. The key is `min-height: 0` because without it, the flex child won't shrink below its content height.",
    explanationWrong:
      "Nested scroll containers create two independent scrollbars. Users don't know which region they're scrolling, and on touch devices the wrong scroll container often captures the gesture. One scroll context is always clearer.",
    sourceUrl:
      "https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_flexible_box_layout/Controlling_ratios_of_flex_items_along_the_main_axis#setting_a_minimum_size_for_a_flex_item",
    sourceLabel: "MDN: Flex item minimum size",
  },
];
