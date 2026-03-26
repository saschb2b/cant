/** Shared sx styles for Shiki-highlighted code blocks. */
export const codeBlockStyles = {
  display: "flex",
  flexDirection: "column",
  "& pre": {
    m: 0,
    p: 2,
    flex: 1,
    fontFamily: "var(--font-geist-mono), 'Geist Mono', monospace",
    fontSize: "0.85rem",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
    backgroundColor: "var(--mui-palette-background-paper) !important",
  },
  "& code": {
    fontFamily: "inherit",
  },
} as const;
