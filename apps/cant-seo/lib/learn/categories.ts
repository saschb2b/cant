import type { ChallengeCategory } from "./types";

/** Canonical display order of challenge categories. */
export const CATEGORY_ORDER: ChallengeCategory[] = [
  // Foundations
  "meta-tags",
  "open-graph",
  "twitter-cards",
  // Technical SEO
  "canonical-urls",
  "sitemaps-robots",
  "structured-data",
  // Performance & i18n
  "image-optimization",
  "internationalization",
];

/** Human-readable labels for each challenge category. */
export const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  "meta-tags": "Meta Tags",
  "open-graph": "Open Graph",
  "twitter-cards": "Twitter Cards",
  "structured-data": "Structured Data",
  "canonical-urls": "Canonical URLs",
  "sitemaps-robots": "Sitemaps & Robots",
  "image-optimization": "Image Optimization",
  internationalization: "Internationalization",
};

/** Logical grouping of categories for sidebar navigation. */
export interface CategorySection {
  label: string;
  categories: ChallengeCategory[];
}

export const CATEGORY_SECTIONS: CategorySection[] = [
  {
    label: "Foundations",
    categories: ["meta-tags", "open-graph", "twitter-cards"],
  },
  {
    label: "Technical SEO",
    categories: ["canonical-urls", "sitemaps-robots", "structured-data"],
  },
  {
    label: "Performance & i18n",
    categories: ["image-optimization", "internationalization"],
  },
];

/** Recommended category order for newcomers starting from scratch. */
export const LEARNING_PATH: ChallengeCategory[] = [
  "meta-tags",
  "open-graph",
  "canonical-urls",
  "structured-data",
  "image-optimization",
];

/** Short description for each category, shown on the learn overview. */
export const CATEGORY_DESCRIPTIONS: Record<ChallengeCategory, string> = {
  "meta-tags":
    "The title tag, meta description, and viewport meta. These are the foundation of every page's search appearance. You will hit this when your page shows 'Untitled' in browser tabs or gets a generic snippet in search results.",
  "open-graph":
    "og:title, og:image, og:description, and the rest of the Open Graph protocol. These control how your links appear when shared on LinkedIn, Facebook, Slack, Teams, and Discord. You will hit this when a shared link shows a blank card or the wrong image.",
  "twitter-cards":
    "twitter:card, twitter:image, and the difference between summary and summary_large_image. These control how your links look on Twitter/X. You will hit this when your tweet shows a tiny thumbnail instead of a large preview image.",
  "structured-data":
    "JSON-LD, schema.org markup, and how to add rich results like FAQ accordions, breadcrumbs, and article metadata to your Next.js pages. You will hit this when your competitors show star ratings in search results and you do not.",
  "canonical-urls":
    "The canonical link element, trailing slash handling, www vs non-www, and how to tell search engines which URL is the original. You will hit this when Google indexes three versions of the same page and splits your ranking.",
  "sitemaps-robots":
    "The sitemap.ts and robots.ts files in Next.js, how to control crawling, and when to use noindex vs disallow. You will hit this when search engines cannot find your new pages or index pages you wanted to keep private.",
  "image-optimization":
    "The opengraph-image.tsx convention, proper image dimensions for social sharing, next/image for Core Web Vitals, and how image size affects page speed. You will hit this when your OG image gets cropped on LinkedIn or your LCP score tanks.",
  internationalization:
    "hreflang tags, alternate links, Next.js i18n routing, and locale-specific metadata. You will hit this when Google shows the wrong language version of your page to users in a different country.",
};
